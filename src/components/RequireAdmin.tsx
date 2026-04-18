import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, authReady } = useAdmin();

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center gap-3 text-gray-400">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Checking session…</p>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}
