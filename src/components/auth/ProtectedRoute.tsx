import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = React.useState<any>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { supabase } = await import('../../lib/supabase');
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setProfile(profileData);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setProfileLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#741b1c] mx-auto mb-4"></div>
          <p className="text-gray-600">Laster...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
    return <Navigate to="/\" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;