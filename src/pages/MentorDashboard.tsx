import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  LogOut, 
  Users, 
  Calendar, 
  BookOpen, 
  Clock, 
  Award,
  CheckCircle,
  XCircle,
  User,
  GraduationCap,
  Target,
  TrendingUp,
  MessageCircle,
  FileText,
  Plus,
  Edit3
} from 'lucide-react';

const MentorDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [myStudents, setMyStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    upcomingLessons: 0,
    completedLessons: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMentorData();
    }
  }, [user]);

  const fetchMentorData = async () => {
    try {
      // Fetch mentor profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);

      // Fetch bookings assigned to this teacher
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          students (
            full_name,
            grade_level,
            current_level,
            profiles!students_parent_id_fkey (
              full_name,
              email,
              phone
            )
          )
        `)
        .eq('teacher_id', user?.id)
        .order('scheduled_date', { ascending: true });

      setMyBookings(bookingsData || []);

      // Get unique students from bookings
      const uniqueStudents = bookingsData?.reduce((acc: any[], booking) => {
        if (booking.students && !acc.find(s => s.id === booking.students.id)) {
          acc.push(booking.students);
        }
        return acc;
      }, []) || [];

      setMyStudents(uniqueStudents);

      // Calculate stats
      const now = new Date();
      const upcomingLessons = bookingsData?.filter(b => 
        new Date(b.scheduled_date) > now && 
        (b.status === 'confirmed' || b.status === 'pending')
      ).length || 0;

      const completedLessons = bookingsData?.filter(b => 
        b.status === 'completed'
      ).length || 0;

      const pendingBookings = bookingsData?.filter(b => 
        b.status === 'pending'
      ).length || 0;

      setStats({
        totalStudents: uniqueStudents.length,
        upcomingLessons,
        completedLessons,
        pendingBookings
      });

    } catch (error) {
      console.error('Error fetching mentor data:', error);
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
      await fetchMentorData();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleQuickAction = (actionName: string) => {
    console.log(`${actionName} functionality coming soon!`);
    alert(`${actionName} er under utvikling og kommer snart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#741b1c] mx-auto mb-4"></div>
          <p className="text-gray-600">Laster mentor dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, title: 'Mine Elever', value: stats.totalStudents, color: 'from-blue-500 to-blue-600' },
    { icon: Calendar, title: 'Kommende Timer', value: stats.upcomingLessons, color: 'from-green-500 to-green-600' },
    { icon: Award, title: 'Fullførte Timer', value: stats.completedLessons, color: 'from-purple-500 to-purple-600' },
    { icon: Clock, title: 'Ventende Bookinger', value: stats.pendingBookings, color: 'from-orange-500 to-orange-600' }
  ];

  const todaysBookings = myBookings.filter(booking => {
    const bookingDate = new Date(booking.scheduled_date);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  });

  const upcomingBookings = myBookings.filter(booking => {
    const bookingDate = new Date(booking.scheduled_date);
    const today = new Date();
    return bookingDate > today && (booking.status === 'confirmed' || booking.status === 'pending');
  }).slice(0, 5);

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
                <h1 className="text-xl font-bold text-gray-900">Mentor Dashboard</h1>
                <p className="text-xs text-[#741b1c]">Lærerportal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-[#741b1c]" />
                <span className="text-gray-700">Lærer: {profile?.full_name || user?.email}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Today's Schedule */}
        {todaysBookings.length > 0 && (
          <div className="bg-gradient-to-r from-[#741b1c] to-red-600 rounded-xl p-6 mb-8 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              I dag ({todaysBookings.length} timer)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaysBookings.map((booking) => (
                <div key={booking.id} className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold capitalize">
                        {booking.booking_type === 'consultation' ? 'Konsultasjon' : 
                         booking.booking_type === 'lesson' ? 'Undervisning' : 'Kartlegging'}
                      </h3>
                      <p className="text-sm opacity-90">{booking.students?.full_name}</p>
                      <p className="text-xs opacity-75">
                        {new Date(booking.scheduled_date).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-500 bg-opacity-80' :
                      booking.status === 'pending' ? 'bg-yellow-500 bg-opacity-80' :
                      'bg-gray-500 bg-opacity-80'
                    }`}>
                      {booking.status === 'confirmed' ? 'Bekreftet' :
                       booking.status === 'pending' ? 'Venter' : booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-[#741b1c]" />
                Kommende Timer
              </h2>
              <span className="text-sm text-gray-500">{upcomingBookings.length} timer</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Ingen kommende timer</p>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {booking.booking_type === 'consultation' ? 'Konsultasjon' : 
                           booking.booking_type === 'lesson' ? 'Undervisning' : 'Kartlegging'}
                        </h3>
                        <p className="text-sm text-gray-600">{booking.students?.full_name}</p>
                        <p className="text-sm text-gray-600">{booking.students?.grade_level}</p>
                        <p className="text-xs text-[#741b1c]">
                          {new Date(booking.scheduled_date).toLocaleDateString('no-NO')} kl. {new Date(booking.scheduled_date).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Bekreftet' :
                           booking.status === 'pending' ? 'Venter' : booking.status}
                        </span>
                        
                        {booking.status === 'pending' && (
                          <div className="flex space-x-1">
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
                          </div>
                        )}
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">"{booking.notes}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Students */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-[#741b1c]" />
                Mine Elever
              </h2>
              <span className="text-sm text-gray-500">{myStudents.length} elever</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {myStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Ingen elever tildelt ennå</p>
                </div>
              ) : (
                myStudents.map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.full_name}</h3>
                        <p className="text-sm text-gray-600">{student.grade_level}</p>
                        <p className="text-sm text-[#741b1c] capitalize">{student.current_level}</p>
                        <p className="text-xs text-gray-500">
                          Forelder: {student.profiles?.full_name || 'Ukjent'}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleQuickAction('Se fremgang')}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Se fremgang"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleQuickAction('Send melding')}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Send melding"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <button 
            onClick={() => handleQuickAction('Ny Læringsrapport')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="bg-[#741b1c] p-3 rounded-full w-fit mb-4">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ny Læringsrapport</h3>
            <p className="text-gray-600">Opprett rapport for en elev</p>
          </button>

          <button 
            onClick={() => handleQuickAction('Min Timeplan')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="bg-blue-500 p-3 rounded-full w-fit mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Min Timeplan</h3>
            <p className="text-gray-600">Se full oversikt over timer</p>
          </button>

          <button 
            onClick={() => handleQuickAction('Undervisningsmateriell')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="bg-green-500 p-3 rounded-full w-fit mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Undervisningsmateriell</h3>
            <p className="text-gray-600">Tilgang til ressurser og oppgaver</p>
          </button>

          <button 
            onClick={() => handleQuickAction('Elevmål')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="bg-purple-500 p-3 rounded-full w-fit mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Elevmål</h3>
            <p className="text-gray-600">Sett og følg opp læringsmål</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default MentorDashboard;