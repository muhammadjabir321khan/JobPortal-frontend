import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <>
            <main className="page-content">
                <Outlet />
            </main>
        </>
    );
}