import './App.css';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CompanyDashboard from './pages/CompanyDashboard';
import UserDashboard from './pages/UserDashboard';
import CreateJobPost from './pages/CreateJobPost';
import JobListingPage from './pages/JobListingPage';
import JobDetailPage from './pages/JobDetailPage';
import ResumeUpload from './components/resume/ResumeUpload';
import ResumeDetail from './components/resume/ResumeDetail';
import ResumeEdit from './components/resume/ResumeEdit';
import ApplicationForm from './pages/ApplicationForm';



function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/" element={<CompanyDashboard />} />
        <Route path="/company/:id" element={<CompanyDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/jobs" element={<div>Jobs Page</div>} />
        <Route path="/create-job" element={<CreateJobPost />} />
        <Route path="/job-posts" element={<JobListingPage />} />
        <Route path="/job-posts/:id" element={<JobDetailPage />} />
        <Route path="/resumes/upload" element={<ResumeUpload />} />
        <Route path="/resumes/:id" element={<ResumeDetail />} />
        <Route path="/resumes/edit/:id" element={<ResumeEdit />} />
        <Route path="/apply/:id" element={<ApplicationForm />} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
