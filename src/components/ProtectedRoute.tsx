import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { session, profile, loading, initialized } = useAuth();
    const location = useLocation();

    if (loading || !initialized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
                <Loader2 className="animate-spin text-amber-600 mb-4" size={40} />
                <p className="text-stone-500 font-serif italic">Vérification de l'accès...</p>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (requireAdmin && profile?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
