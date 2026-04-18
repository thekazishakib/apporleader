import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white font-sans selection:bg-primary/30 selection:text-white">
      <Header />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
