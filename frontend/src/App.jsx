import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Resumes from './pages/Resumes';
import ResumeUpload from './pages/ResumeUpload';
import ResumeDetail from './pages/ResumeDetail';
import AIAnalyzer from './pages/AIAnalyzer';
import CompareVersions from './pages/CompareVersions';
import JobSearch from './pages/JobSearch';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public landing page */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Protected dashboard routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                        <Route path="/resumes" element={<DashboardLayout><Resumes /></DashboardLayout>} />
                        <Route path="/resumes/:id" element={<DashboardLayout><ResumeDetail /></DashboardLayout>} />
                        <Route path="/compare" element={<DashboardLayout><CompareVersions /></DashboardLayout>} />
                        <Route path="/upload" element={<DashboardLayout><ResumeUpload /></DashboardLayout>} />
                        <Route path="/jobs" element={<DashboardLayout><JobSearch /></DashboardLayout>} />
                        <Route path="/analyze" element={<DashboardLayout><AIAnalyzer /></DashboardLayout>} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
