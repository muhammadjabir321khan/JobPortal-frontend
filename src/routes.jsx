// src/routes.jsx
import { Navigate } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import { useSelector } from 'react-redux';

function Protected({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const routes = [
  {
    element: <GuestLayout />, children: [
      { path: '/', element: <Home /> },
      { path: '/jobs', element: <Jobs /> },
      { path: '/jobs/:id', element: <JobDetail /> },
      { path: '/profile', element: <Profile /> },
      { path: '/about', element: <About /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
    ],
  },
  {
    element: <Protected><GuestLayout /></Protected>,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
];

export default routes;
