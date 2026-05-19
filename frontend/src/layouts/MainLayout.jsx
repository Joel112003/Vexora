import { Outlet }  from 'react-router-dom';
import Navbar      from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;