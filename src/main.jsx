import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import BlogListingPage from './pages/BlogListingPage.jsx'
import BlogPostPage from './pages/BlogPostPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blogs" element={<BlogListingPage />} />
        <Route path="/blogs/:slug" element={<BlogPostPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
