import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppContext.tsx';


export const authService = "https://orange-space-acorn-x5v4qr59prg7fvgwq-5000.app.github.dev/api/auth";
export const restaurantService = "https://orange-space-acorn-x5v4qr59prg7fvgwq-5001.app.github.dev/";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="97089728063-2vih33l8097k402dpnat2m5d9lijhv3p.apps.googleusercontent.com">
      <AppProvider><App /></AppProvider>
    </GoogleOAuthProvider>
    
  </StrictMode>,
)
