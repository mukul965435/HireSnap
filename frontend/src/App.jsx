import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages (to be implemented)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resumes from './pages/Resumes';
import ResumeUpload from './pages/ResumeUpload';
import JobSearch from './pages/JobSearch';
import AIAnalyzer from './pages/AIAnalyzer';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                        <Route path="/resumes" element={<DashboardLayout><Resumes /></DashboardLayout>} />
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
