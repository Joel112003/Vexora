import { Outlet }  from 'react-router-dom';
import Navbar      from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black bg-gradient-to-b from-emerald-950/40 via-black to-black">

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;