import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import NurseDashboard from './pages/NurseDashboard';
import CleanerDashboard from './pages/CleanerDashboard';
import CookDashboard from './pages/CookDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorRegister from './pages/DoctorRegister';
import NurseRegister from './pages/NurseRegister';
import CleanerRegister from './pages/CleanerRegister';
import CookRegister from './pages/CookRegister';
import EmployeeRegister from './pages/EmployeeRegister';
import AppointmentBooking from './pages/AppointmentBooking';
import HospitalSearch from './pages/HospitalSearch';
import Telemedicine from './pages/Telemedicine';
import MedicalRecords from './pages/MedicalRecords';
import Notifications from './pages/Notifications';
import DoctorReports from './pages/DoctorReports';
import AdminReports from './pages/AdminReports';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import CleanerTasks from './pages/CleanerTasks';
import CookTasks from './pages/CookTasks';
import PatientRegister from './pages/PatientRegister';
import PasswordRecovery from './pages/PasswordRecovery';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <ErrorBoundary>
            <Router>
              <div style={{ display: 'flex' }}>
                {user && !loading && <Sidebar />}
                <div style={{ flexGrow: 1 }}>
                  {user && !loading && <Header />}
                  <div style={{ marginTop: '64px', padding: '20px' }}>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/patient-register" element={<PatientRegister />} />
                      <Route path="/password-recovery" element={<PasswordRecovery />} />
                      <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['paciente']}><PatientDashboard /></ProtectedRoute>} />
                      <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={['medico']}><DoctorDashboard /></ProtectedRoute>} />
                      <Route path="/nurse-dashboard" element={<ProtectedRoute allowedRoles={['enfermeiro']}><NurseDashboard /></ProtectedRoute>} />
                      <Route path="/cleaner-dashboard" element={<ProtectedRoute allowedRoles={['faxineiro']}><CleanerDashboard /></ProtectedRoute>} />
                      <Route path="/cook-dashboard" element={<ProtectedRoute allowedRoles={['cozinheiro']}><CookDashboard /></ProtectedRoute>} />
                      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/doctor-register" element={<ProtectedRoute allowedRoles={['admin']}><DoctorRegister /></ProtectedRoute>} />
                      <Route path="/nurse-register" element={<ProtectedRoute allowedRoles={['admin']}><NurseRegister /></ProtectedRoute>} />
                      <Route path="/cleaner-register" element={<ProtectedRoute allowedRoles={['admin']}><CleanerRegister /></ProtectedRoute>} />
                      <Route path="/cook-register" element={<ProtectedRoute allowedRoles={['admin']}><CookRegister /></ProtectedRoute>} />
                      <Route path="/employee-register" element={<ProtectedRoute allowedRoles={['admin']}><EmployeeRegister /></ProtectedRoute>} />
                      <Route path="/appointment-booking" element={<ProtectedRoute allowedRoles={['paciente']}><AppointmentBooking /></ProtectedRoute>} />
                      <Route path="/hospital-search" element={<ProtectedRoute allowedRoles={['paciente']}><HospitalSearch /></ProtectedRoute>} />
                      <Route path="/telemedicine" element={<ProtectedRoute allowedRoles={['paciente', 'medico']}><Telemedicine /></ProtectedRoute>} />
                      <Route path="/medical-records" element={<ProtectedRoute allowedRoles={['paciente']}><MedicalRecords /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['paciente', 'medico', 'enfermeiro', 'faxineiro', 'cozinheiro', 'admin']}><Notifications /></ProtectedRoute>} />
                      <Route path="/doctor-reports" element={<ProtectedRoute allowedRoles={['medico']}><DoctorReports /></ProtectedRoute>} />
                      <Route path="/admin-reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute allowedRoles={['paciente', 'medico', 'enfermeiro', 'faxineiro', 'cozinheiro', 'admin']}><UserProfile /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute allowedRoles={['paciente', 'medico', 'enfermeiro', 'faxineiro', 'cozinheiro', 'admin']}><Settings /></ProtectedRoute>} />
                      <Route path="/cleaner-tasks" element={<ProtectedRoute allowedRoles={['faxineiro']}><CleanerTasks /></ProtectedRoute>} />
                      <Route path="/cook-tasks" element={<ProtectedRoute allowedRoles={['cozinheiro']}><CookTasks /></ProtectedRoute>} />
                      <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </Router>
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
