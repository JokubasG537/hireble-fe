import './App.scss';
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
import CompanyPublicPage from './pages/CompanyPublicPage';
import PublicUserProfile from './pages/PublicUserProfile';
import Footer from './components/Footer';
import { Toaster } from 'sonner';
// import JobBoard from './components/JobBoard';
// import JobDetail from './components/JobDetail';

function App() {
  return (
    <>
      <Nav />
      <main>
        <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<CompanyDashboard  />} />
        <Route path="/companies/:id" element={<CompanyPublicPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/users/:id" element={<PublicUserProfile />} />
        <Route path="/create-job" element={<CreateJobPost />} />
         {/* <Route path="/jobs" element={<JobBoard />}>
        <Route path=":jobId" element={<JobDetail />} />
      </Route> */}
        <Route path="/job-posts" element={<JobListingPage />} />
        {/* <Route path="/job-posts/:jobId" element={<JobDetailPage />} /> */}
        <Route path="/resumes/upload" element={<ResumeUpload />} />
        <Route path="/resumes/:id" element={<ResumeDetail />} />
        <Route path="/resumes/edit/:id" element={<ResumeEdit />} />
        <Route path="/apply/:id" element={<ApplicationForm />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Footer />
      </main>
    </>
  );
}

export default App;
