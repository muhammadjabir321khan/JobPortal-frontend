import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/bootstrap.min.css'
import './styles/main.css'
import App from './App.jsx'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- required for dropdowns

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
