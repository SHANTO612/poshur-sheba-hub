import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import React from 'react';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);
