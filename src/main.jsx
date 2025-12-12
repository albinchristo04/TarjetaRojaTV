import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeadProvider } from 'react-head'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider>
      <App />
    </HeadProvider>
  </StrictMode>,
)
