import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="app-shell horizontal">
      <Navbar />
      <main className="main-content">
        <div className="page-container animate-scale">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

