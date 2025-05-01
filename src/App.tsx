import './App.css';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Register from './pages/Register'
import Login from './pages/Login';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/jobs" element={<div>Jobs Page</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


      </Routes>
    </>
  );
}

export default App;
