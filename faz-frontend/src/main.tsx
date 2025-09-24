// src/main.tsx or src/index.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

import AppRoutes from './routes/AppRoutes'

const container = document.getElementById('root')
if (!container) throw new Error('Root element with id "root" not found')

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </BrowserRouter>
  </React.StrictMode>
)
