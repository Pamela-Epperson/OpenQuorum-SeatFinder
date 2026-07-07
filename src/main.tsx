import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// SeatFinder.jsx is the maintained component (imports shared states.config.js).
// App.tsx is the legacy self-contained build kept for reference only.
import App from './SeatFinder.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
