import './App.css';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CompanyDashboard from './pages/CompanyDashboard';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/jobs" element={<div>Jobs Page</div>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
