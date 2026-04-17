import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function GuestLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content jp-page">
        <Outlet />
      </main>
    </div>
  );
}