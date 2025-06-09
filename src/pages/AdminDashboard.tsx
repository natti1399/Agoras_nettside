import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  LogOut, 
  Users, 
  Calendar, 
  BookOpen, 
  Settings, 
  Shield, 
  TrendingUp, 
  UserCheck,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  Plus,
  CreditCard
} from 'lucide-react';
import UserManagementModal from '../components/admin/UserManagementModal';
import StudentManagementModal from '../components/admin/StudentManagementModal';
import BookingManagementModal from '../components/admin/BookingManagementModal';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    activeTeachers: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch admin profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);

      // Fetch statistics
      const [usersResult, studentsResult, bookingsResult, teachersResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('students').select('*', { count: 'exact' }),
        supabase.from('bookings').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }).eq('role', 'teacher')
      ]);

      // Get booking status counts
      const { data: pendingBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      const { data: completedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('status', 'completed');

      setStats({
        totalUsers: usersResult.count || 0,
        totalStudents: studentsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        pendingBookings: pendingBookings?.length || 0,
        completedBookings: completedBookings?.length || 0,
        activeTeachers: teachersResult.count || 0
      });

      // Fetch recent bookings with user details - Fixed query with aliased plan_type
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          students (
            full_name,
            plan_type:plan_type,
            profiles!students_parent_id_fkey (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentBookings(bookingsData || []);

      // Fetch all users for management
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setAllUsers(usersData || []);

      // Fetch all students for management
      const { data: studentsData } = await supabase
        .from('students')
        .select(`
          *,
          profiles!students_parent_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      setAllStudents(studentsData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      // Refresh data
      await fetchAdminData();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowStudentModal(true);
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setShowBookingModal(true);
  };

  const handleModalClose = () => {
    setShowUserModal(false);
    setShowStudentModal(false);
    setShowBookingModal(false);
    setSelectedUser(null);
    setSelectedStudent(null);
    setSelectedBooking(null);
  };

  const handleModalSuccess = () => {
    fetchAdminData();
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-600 bg-gray-100';
      case 'standard': return 'text-green-600 bg-green-100';
      case 'pluss': return 'text-purple-600 bg-purple-100';
      case 'premium': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free': return 'Gratis';
      case 'standard': return 'Standard';
      case 'pluss': return 'Pluss';
      case 'premium': return 'Premium';
      default: return 'Gratis';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#741b1c] mx-auto mb-4"></div>
          <p className="text-gray-600">Laster admin dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, title: 'Totale Brukere', value: stats.totalUsers, color: 'from-blue-500 to-blue-600' },
    { icon: BookOpen, title: 'Registrerte Elever', value: stats.totalStudents, color: 'from-green-500 to-green-600' },
    { icon: Calendar, title: 'Totale Bookinger', value: stats.totalBookings, color: 'from-purple-500 to-purple-600' },
    { icon: UserCheck, title: 'Aktive Lærere', value: stats.activeTeachers, color: 'from-orange-500 to-orange-600' },
    { icon: Clock, title: 'Ventende Bookinger', value: stats.pendingBookings, color: 'from-yellow-500 to-yellow-600' },
    { icon: Award, title: 'Fullførte Timer', value: stats.completedBookings, color: 'from-[#741b1c] to-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/Logo Upscaled.png" 
                  alt="Agoras Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-[#741b1c]">Systemadministrasjon</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-[#741b1c]" />
                <span className="text-gray-700">Admin: {profile?.full_name || user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#741b1c] transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logg ut</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-full`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-[#741b1c]" />
                Nylige Bookinger
              </h2>
              <button
                onClick={handleAddBooking}
                className="bg-[#741b1c] text-white p-2 rounded-lg hover:bg-[#5a1415] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {booking.booking_type === 'consultation' ? 'Konsultasjon' : 
                         booking.booking_type === 'lesson' ? 'Undervisning' : 'Kartlegging'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Elev: {booking.students?.full_name || 'Ukjent'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-600">
                          Forelder: {booking.students?.profiles?.full_name || 'Ukjent'}
                        </p>
                        {booking.students?.plan_type && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(booking.students.plan_type)}`}>
                            {getPlanLabel(booking.students.plan_type)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.scheduled_date).toLocaleDateString('no-NO')} kl. {new Date(booking.scheduled_date).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Bekreftet' :
                         booking.status === 'pending' ? 'Venter' : 
                         booking.status === 'completed' ? 'Fullført' : booking.status}
                      </span>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Rediger"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                              title="Bekreft"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Avbryt"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {booking.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">"{booking.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-[#741b1c]" />
                Brukerhåndtering
              </h2>
              <button
                onClick={handleAddUser}
                className="bg-[#741b1c] text-white p-2 rounded-lg hover:bg-[#5a1415] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allUsers.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.full_name || 'Navn ikke oppgitt'}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'parent' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' :
                           user.role === 'teacher' ? 'Lærer' :
                           user.role === 'parent' ? 'Forelder' : 'Elev'}
                        </span>
                        {user.plan_type && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan_type)}`}>
                            {getPlanLabel(user.plan_type)}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Registrert: {new Date(user.created_at).toLocaleDateString('no-NO')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Rediger"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-[#741b1c]" />
                Elevhåndtering
              </h2>
              <button
                onClick={handleAddStudent}
                className="bg-[#741b1c] text-white p-2 rounded-lg hover:bg-[#5a1415] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allStudents.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.full_name}</h3>
                      <p className="text-sm text-gray-600">{student.grade_level}</p>
                      <p className="text-sm text-[#741b1c] capitalize">{student.current_level}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(student.plan_type || 'free')}`}>
                          {getPlanLabel(student.plan_type || 'free')}
                        </span>
                        <p className="text-xs text-gray-500">
                          Forelder: {student.profiles?.full_name || student.profiles?.email || 'Ukjent'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Rediger"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <button 
            onClick={handleAddUser}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="bg-[#741b1c] p-3 rounded-full w-fit mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Administrer Brukere</h3>
            <p className="text-gray-600">Håndter brukerkontoer og roller</p>
          </button>

          <button 
            onClick={handleAddBooking}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="bg-blue-500 p-3 rounded-full w-fit mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Oversikt</h3>
            <p className="text-gray-600">Se alle bookinger og timeplan</p>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left">
            <div className="bg-green-500 p-3 rounded-full w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapporter</h3>
            <p className="text-gray-600">Generer og se systemrapporter</p>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left">
            <div className="bg-purple-500 p-3 rounded-full w-fit mb-4">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Systeminnstillinger</h3>
            <p className="text-gray-600">Konfigurer systemparametere</p>
          </button>
        </div>
      </main>

      {/* Modals */}
      <UserManagementModal
        isOpen={showUserModal}
        onClose={handleModalClose}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />

      <StudentManagementModal
        isOpen={showStudentModal}
        onClose={handleModalClose}
        student={selectedStudent}
        onSuccess={handleModalSuccess}
      />

      <BookingManagementModal
        isOpen={showBookingModal}
        onClose={handleModalClose}
        booking={selectedBooking}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminDashboard;