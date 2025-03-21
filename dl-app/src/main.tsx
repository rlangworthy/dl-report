import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleDownload } from './gapi.tsx';
import './index.css'
import App from './App.tsx'
//import 'dotenv/config.js'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="126149146398-0q04pjbq98bov64tsgbgs5mlqmnmj540.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GoogleDownload />}/>
          <Route path="/home" element={<App />}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
