import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { RestyleProvider } from './contexts/RestyleContext';
import { Landing } from './pages/Landing';
import { Upload } from './pages/Upload';
import { Processing } from './pages/Processing';
import { Results } from './pages/Results';
import { Browse } from './pages/Browse';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col">

        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </motion.div>
    </AnimatePresence>);
}

export function App() {
  return (
    <RestyleProvider>
      <BrowserRouter>
        <div className="flex min-h-screen w-full flex-col bg-lilac font-sans">
          <SiteHeader />
          <AnimatedRoutes />
          <SiteFooter />
        </div>
      </BrowserRouter>
    </RestyleProvider>);
}
