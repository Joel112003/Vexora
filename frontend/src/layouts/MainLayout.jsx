import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Outlet />
    </div>
  );
};

export default MainLayout;