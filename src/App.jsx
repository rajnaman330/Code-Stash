import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 1. Ye import kiya
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddSnippet from './pages/AddSnippet';
import SnippetDetail from './pages/SnippetDetail';

function App() {
  return (
    <>
      {/* 2. Ye component lagaya taaki notifications dikh sakein */}
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddSnippet />} />
        <Route path="/edit/:id" element={<AddSnippet />} />
        <Route path="/snippet/:id" element={<SnippetDetail />} />
      </Routes>
    </>
  )
}

export default App;