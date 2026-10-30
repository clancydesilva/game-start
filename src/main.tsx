import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Swap the active style by changing the import below ('./style1-muted.css' or './style2-gameboy.css'):
import './style2-gameboy.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
