import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { useToast } from './components/Toast';
import { Landing } from './pages/Landing';
import { TailorWorkspace } from './pages/TailorWorkspace';
import { History } from './pages/History';
import { HowItWorks } from './pages/HowItWorks';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';

function AppContent() {
  const { ToastContainer } = useToast();
  
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tailor" element={<TailorWorkspace />} />
          <Route path="/history" element={<History />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;