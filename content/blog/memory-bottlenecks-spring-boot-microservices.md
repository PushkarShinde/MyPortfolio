---
title: "Fixing Memory Bottlenecks Across a Multi-Service Spring Boot App"
date: "2026-07-14"
category: "Backend Engineering"
excerpt: "How I fixed the JVM heap exhaustion across multiple local microservices including Eureka, RabbitMQ, Keycloak, PostgreSQL, and a Gemini-powered service, with container-level heap caps, lazy initialization, and a Docker-to-Podman migration."
slug: "memory-bottlenecks-spring-boot-microservices"
readTime: "15 min read"
---

# The Day My Laptop Fought Back

When I started building the Fitness App, I wasn't thinking about memory at all. I was blindly following a yt tutorial with a grin on my face and wishing I'll get to learn, but it's not the case. The real learning happened when I stopped caring about the tutorial, the stuff started falling apart, and I went on a solo ride. At first, I was excited about the fun part: an Eureka-based service registry, a RabbitMQ event bus, Keycloak for auth, PostgreSQL for storage, and a Gemini API integration to make the whole thing "smart.".

Then I ran `docker compose up` on my own machine and watched my laptop fans spin up like a jet engine preparing for takeoff. Then the tears started rolling, lol.

This post is about what actually happens to memory when you run a real microservice system on a real development laptop, not a beefy cloud VM, and the concrete steps I took to get it under control. If you're building anything similar on a machine like an i5-13500H with a "decent but not infinite" amount of RAM, this should save you a few days of confusion.
But let's ask the basic question...

## Why Microservices?

Monoliths are comfortable. You deploy one artifact, debug one log stream, and reason about one codebase. But the moment you start working in a team, different feature ideas n perspectives starts pouring in (Btw, All of them Gold), or simply your traffic patterns start diverging across features... *the monolith becomes a bottleneck*.

Microservices solve this by giving each bounded context its own deployable unit. But they introduce **new categories of failure** that monoliths never had to worry about: network partitions, distributed transactions, cascading timeouts, and the ever-present question of *"which service actually owns this data?"*

This blog walks through the hurdles I faced while building an AI-powered fitness platform, and the concrete decisions that made it work.
And before moving on to the memory bottlenecks, I also want to talk about the mistakes I made while designing the architecture of the it. The biggest one of which is the *Service Decomposition*.

## Service Decomposition

The first mistake any newbie would make (Um, at least this is what I tell myself, lol) is decomposing by technical layer (a "database service", an "auth service", a "notification service"). This creates **distributed monoliths** - services that can't be deployed independently because they share too much implicit knowledge.

Instead, decompose by **business capability**:

```java
// Each service owns its domain completely
@SpringBootApplication
public class ActivityServiceApplication {
    // Owns: workout plans, exercises, user progress
    // Does NOT own: user profiles, billing, notifications
}
```

For the fitness platform, I ended up with four services:

- **User Service** - registration, profiles (User data), preferences
- **Recommendation Service** - AI-generated plans, exercise catalog
- **Activity Service** - tracking, streaks, analytics
- **Gateway Service** - routing, rate limiting, auth token validation

> The key idea: each service should be deployable, testable, and understandable, standalone. If you spot a service interdependency before deploying, you've drawn the boundaries wrong.

## Why microservices are so much heavier locally than they look on a diagram

On an architecture diagram, six boxes connected by arrows look harmless. In reality, every one of those boxes that runs on the JVM is its own independent process with its own:

- **Heap** - where your objects live
- **Metaspace** - where class metadata lives (this one surprises people; it's off-heap but still very real memory)
- **Thread stacks** - every thread (and Spring Boot spins up a lot of them: Tomcat worker threads, RabbitMQ listener threads, scheduled task threads) reserves its own stack, usually 512KB–1MB by default
- **JIT compiler code cache**
- **GC bookkeeping structures**, which scale with heap size and the number of GC threads

Multiply that by six services, then add Keycloak (itself a fairly heavy JVM application with its own embedded database interactions), PostgreSQL, and RabbitMQ (which runs on the Erlang VM, with its own memory model entirely). None of these processes know or care that the other five exist. Each one assumes it can have as much memory as it wants.

On top of that, if you're on Windows, Docker Desktop doesn't run containers natively, it runs a lightweight Linux VM under WSL2, and that VM itself reserves a chunk of RAM before a single one of your containers has even started.

So the "six boxes on a diagram" problem is really more like "eight to nine independent memory-hungry processes plus a virtual machine," all competing for whatever's left after Windows, your IDE, and your browser tabs take their share.

## The actual symptom

It didn't show up as a clean, readable stack trace at first. It showed up as:

- Services becoming unresponsive under light load, with Eureka showing them as `DOWN` intermittently
- IntelliJ becoming sluggish to the point of being unusable while the stack was running
- Occasional hard crashes of a service with an `OutOfMemoryError` in the logs, usually not the service I expected
- Restarting one service sometimes triggering cascading slowness in others, because everything was fighting over the same finite RAM and the OS was paging aggressively

The tricky part about JVM memory problems in a multi-service setup is that the *symptom* often shows up in the wrong place. The service that OOMs isn't necessarily the one that's misbehaving, it might just be the one that happened to ask for more heap at the moment memory ran out.

## Root cause: JVMs weren't being told the truth about their environment

The core issue was that each service's JVM was making its own independent, locally "reasonable" decision about how much heap to claim, with no awareness of the other JVMs running alongside it or of the actual memory ceiling on the machine.

By default, without explicit heap flags, the JVM sizes its heap as a percentage of the memory it *thinks* it has available. In a containerized environment, if you haven't set a memory limit on the container, or haven't told the JVM to respect that limit, it can end up sizing itself against the host's total memory, not against any sensible per-service budget. Do that multiple times over and you've effectively told your machine "please prepare to give each of these services a meaningful chunk of total RAM," which obviously doesn't add up. Dead silence!

There's a second, quieter contributor: Spring Boot's eager initialization. By default, Spring creates and wires the entire application context, every bean, every auto-configuration, every connection pool, at startup; whether or not it's needed for the first request. That's a burst of allocation the moment each service starts, which is exactly when you're most likely to be starting *other* services too.

## What I actually did

### 1. Container-level heap caps, sized per service role

Instead of letting each JVM guess, I set explicit memory limits at the container level and paired them with `-XX:MaxRAMPercentage` (and `-XX:InitialRAMPercentage`) so the JVM's heap sizing is derived from the container's actual cgroup limit, not the host machine's total memory.

The important detail here is that I didn't give every service the same budget. A stateless API gateway doing routing and header manipulation doesn't need the same heap as the service handling PDF/report generation or making calls to the Gemini API with larger request/response payloads. Profiling actual usage per service (rather than copy-pasting one `-Xmx` value everywhere) meant the total footprint across all six services came down significantly without starving the ones that actually needed the memory.

### 2. Lazy initialization

Adding `spring.main.lazy-initialization=true` meant beans are only created when they're first needed, not all at once at startup. This did two things: it lowered the peak memory spike during the "everything starts at once" phase of `docker compose up`, and it noticeably cut down cumulative startup time across six services starting roughly together.

The trade-off is real and worth knowing about: the *first* request to a lazily-initialized path pays the initialization cost, so first-request latency goes up. For local development that's a completely acceptable trade. I would think harder about it in production, where predictable latency on the first real request matters more than saving memory at boot.

### 3. Migrating from Docker Desktop to Podman

I wanna give credit for this to one of my cracked seniors [Pranay Dubey](https://www.linkedin.com/in/pranaydubey272/). One day, he casually introduced me with Podman, and without a second thought I went on with it. This was the change with the biggest visible impact on Windows specifically. Docker Desktop's architecture on Windows runs a full Linux VM under WSL2 as an intermediary layer, and the `dockerd` daemon itself sits there consuming memory continuously, independent of your containers.

Podman doesn't use a persistent background daemon the same way, it's a daemonless, fork/exec model where the container runtime process only exists for the lifetime of what it's managing, and it can run rootless, interacting more directly with cgroups rather than going through an extra daemon layer. Migrating the stack from Docker to Podman freed up a meaningful, consistently-available slice of RAM that had previously just been "daemon tax," before any of my actual services had even started.

### Net result

Between the three changes, I could run all six application services, Keycloak, PostgreSQL, MongoDB, and RabbitMQ together, locally, without OOM kills or the cascading slowdown I'd been getting before, and with enough headroom left over that IntelliJ and the rest of my machine stayed usable while the stack was up.

## What I'll do differently going forward

**Move inter-service calls from REST/JSON to gRPC with Protobuf over HTTP/2.** I've traced a chunk of the remaining overhead to REST calls between services: JSON serialization/deserialization allocates a lot of short-lived objects, and each REST client typically holds its own connection pool. gRPC's binary Protobuf encoding is smaller and cheaper to (de)serialize than JSON, and HTTP/2 multiplexing means fewer, more efficient connections between services instead of a pool per REST client per service pair. I'm treating this as the next real lever, not a nice-to-have — it addresses both the latency bottleneck and a chunk of the memory overhead from connection pooling and serialization buffers at the same time.

**Right-size the GC for a dev environment, not a production one.** The default G1GC is tuned for balancing throughput and pause times on larger heaps with real production traffic. On a laptop, with small heaps and short-lived local runs, a simpler collector with less bookkeeping overhead can be a better fit for the *development* profile specifically, something I want to test properly with actual measurements before adopting it, rather than just changing a flag because it sounds right.

**Get more disciplined about what actually needs to run.** Not every service needs to be live for every task. I'm moving toward using Testcontainers or lightweight stubs (WireMock) for services I'm not actively modifying, rather than spinning up the full Keycloak + RabbitMQ + PostgreSQL stack every time I just want to work on one business service in isolation.

**Treat memory limits as a first-class part of the service, not an afterthought.** Going forward, every new service gets its container memory budget defined *before* I write the first controller, based on its actual role, the same way I'd think about its API contract.

## Practical value: running a heavy Spring Boot stack on a Windows laptop (~i5 class, "decent" RAM)

If you're in the same spot, a capable but not unlimited machine, several JVM services, Windows as the host OS, here's what actually moves the needle, roughly in order of impact:

1. **Cap WSL2's memory usage explicitly.** By default, WSL2 (which Docker Desktop runs on) can claim up to a large share of your total RAM and won't always give it back promptly. Create or edit `%UserProfile%\.wslconfig`:
   ```
   [wsl2]
   memory=8GB
   processors=6
   ```
   This puts a hard ceiling on the VM itself, so it can't quietly eat the RAM your IDE needs.

2. **Consider Podman Desktop instead of Docker Desktop**, for the daemonless/rootless reasons above. On identical hardware, this was the single change that gave back the most "just sitting there" memory.

3. **Set explicit memory and CPU limits per service in your compose file**, and derive JVM heap flags from those limits (`-XX:MaxRAMPercentage`) rather than hardcoding `-Xmx` values that assume a fixed amount of host memory. This keeps a runaway service from starving its neighbors.

4. **Turn on lazy initialization for local profiles.** `spring.main.lazy-initialization=true` in your `application-local.yml`, not your production profile.

5. **Don't run the whole stack for every task.** Use Testcontainers, in-memory substitutes, or stubs for the services you're not currently touching. This is as much about memory as it is about not waiting three minutes for Keycloak to boot every time you want to test one endpoint.

6. **Watch actual heap and non-heap usage, not guesses.** Spring Boot Actuator's `/actuator/metrics/jvm.memory.used` endpoint, or a quick attach with VisualVM/JConsole, tells you which service is actually using what, far more reliable than assuming the crashing service is the one at fault.

7. **Be honest about your IDE's own footprint.** IntelliJ's indexing and its own JVM (with its own heap) are competing for the same RAM as your services. On a memory-constrained run, closing unrelated modules or excluding generated/build directories from indexing genuinely helps.

None of these individually solved the problem for me. Together, they turned a stack that would grind my laptop to a halt into one I can run comfortably alongside everything else I need open while developing.

---

*This is based on real memory-exhaustion issues I hit while building the Fitness App - a Spring Boot microservices project using Eureka, RabbitMQ, Keycloak, PostgreSQL, and the Gemini API. If you're fighting a similar battle, I'd genuinely like to compare notes.*

Thanks for Reading! See you again.