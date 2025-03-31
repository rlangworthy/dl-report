import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { GoogleDownload } from './gapi.tsx';
import './index.css'
import App from './App.tsx'
//import 'dotenv/config.js'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/dl-scheduling" element={<GoogleDownload />}/>
          <Route path="/home" element={<App />}/>
        </Routes>
      </BrowserRouter>
  </StrictMode>,
)
