import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import { AuthProvider } from './context/AuthContext.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  React.createElement(
    StrictMode,
    null,
    React.createElement(
      AuthProvider,
      null,
      React.createElement(App, null)
    )
  )
)
