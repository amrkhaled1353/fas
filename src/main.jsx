import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// TEMPORARY DEBUG OVERLAY
window.addEventListener('error', (event) => {
  document.body.innerHTML += `<div style="position: fixed; top: 0; left: 0; z-index: 9999; background: red; color: white; padding: 20px; font-family: monospace; white-space: pre-wrap;">ERROR: ${event.message}<br/>${event.error?.stack}</div>`;
});
window.addEventListener('unhandledrejection', (event) => {
  document.body.innerHTML += `<div style="position: fixed; top: 0; left: 0; z-index: 9999; background: orange; color: white; padding: 20px; font-family: monospace; white-space: pre-wrap;">PROMISE ERROR: ${event.reason}</div>`;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
