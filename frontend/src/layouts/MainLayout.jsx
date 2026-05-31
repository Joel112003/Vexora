import { Outlet }  from 'react-router-dom';
import Navbar      from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col" style={{ background: '#050c07', minHeight: '100dvh' }}>
      <Navbar />
      {/* Each page owns its own width/padding/height constraints */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;