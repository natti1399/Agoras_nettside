import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, User, Calendar, BookOpen, Settings, Plus, Edit3, Save, X, Check, Phone, Mail, GraduationCap, Clock, Target, Award, CreditCard, Lock } from 'lucide-react';

const ParentStudentDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editableProfileData, setEditableProfileData] = useState({
    full_name: '',
    phone: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Form states
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    grade_level: '',
    current_level: 'ungdomsskole',
    plan_type: 'free',
    goals: '',
    notes: ''
  });
  const [newBooking, setNewBooking] = useState({
    student_id: '',
    booking_type: 'consultation',
    scheduled_date: '',
    notes: ''
  });
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditableProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);

      if (profileData?.role === 'parent') {
        // Parent: fetch their students
        const { data: studentsData } = await supabase
          .from('students')
          .select('*')
          .eq('parent_id', user?.id);

        setStudents(studentsData || []);

        // Fetch bookings for all students
        if (studentsData && studentsData.length > 0) {
          const studentIds = studentsData.map(s => s.id);
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select('*, students(full_name)')
            .in('student_id', studentIds)
            .order('scheduled_date', { ascending: true });

          setBookings(bookingsData || []);
        }
      } else if (profileData?.role === 'student') {
        // Student: create a virtual student object for themselves
        const virtualStudent = {
          id: user?.id,
          full_name: profileData.full_name || 'Meg selv',
          grade_level: 'Student',
          current_level: 'student',
          plan_type: profileData.plan_type || 'free'
        };
        setStudents([virtualStudent]);

        // Fetch bookings for the student themselves
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('student_id', user?.id)
          .order('scheduled_date', { ascending: true });

        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setUpdateError('');
    setUpdateSuccess(false);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditableProfileData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || ''
    });
    setUpdateError('');
    setUpdateSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editableProfileData.full_name,
          phone: editableProfileData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      // Update local profile state
      setProfile(prev => ({
        ...prev,
        full_name: editableProfileData.full_name,
        phone: editableProfileData.phone
      }));

      setUpdateSuccess(true);
      setIsEditingProfile(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      setUpdateError(error.message || 'En feil oppstod ved oppdatering av profilen');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const { error } = await supabase
        .from('students')
        .insert([{
          parent_id: user?.id,
          full_name: newStudent.full_name,
          grade_level: newStudent.grade_level,
          current_level: newStudent.current_level,
          plan_type: newStudent.plan_type,
          goals: newStudent.goals,
          notes: newStudent.notes
        }]);

      if (error) throw error;

      // Refresh students data
      await fetchUserData();
      
      // Reset form and close modal
      setNewStudent({
        full_name: '',
        grade_level: '',
        current_level: 'ungdomsskole',
        plan_type: 'free',
        goals: '',
        notes: ''
      });
      setShowAddStudentModal(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);

    } catch (error: any) {
      console.error('Error adding student:', error);
      setUpdateError(error.message || 'En feil oppstod ved registrering av elev');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // For students, use their own ID if no student_id is selected
      const studentId = profile?.role === 'student' ? user?.id : newBooking.student_id;

      // Get the student's plan to check restrictions
      let studentPlan = 'free';
      if (profile?.role === 'student') {
        studentPlan = profile.plan_type || 'free';
      } else {
        const selectedStudent = students.find(s => s.id === studentId);
        studentPlan = selectedStudent?.plan_type || 'free';
      }

      // Check if the booking type is allowed for the student's plan
      if (!isBookingTypeAllowed(newBooking.booking_type, studentPlan)) {
        setUpdateError('Denne typen booking er ikke tilgjengelig for din plan. Oppgrader for å få tilgang.');
        setSubmitLoading(false);
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .insert([{
          student_id: studentId,
          booking_type: newBooking.booking_type,
          scheduled_date: newBooking.scheduled_date,
          duration_minutes: 30,
          status: 'pending',
          notes: newBooking.notes
        }]);

      if (error) throw error;

      // Refresh bookings data
      await fetchUserData();
      
      // Reset form and close modal
      setNewBooking({
        student_id: '',
        booking_type: 'consultation',
        scheduled_date: '',
        notes: ''
      });
      setShowBookingModal(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);

    } catch (error: any) {
      console.error('Error booking consultation:', error);
      setUpdateError(error.message || 'En feil oppstod ved booking');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    // Simulate sending contact form (in real app, this would send an email or create a support ticket)
    setTimeout(() => {
      setContactForm({ subject: '', message: '' });
      setShowContactModal(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setSubmitLoading(false);
    }, 1000);
  };

  // Plan access control functions
  const getPlanFeatures = (planType: string) => {
    switch (planType) {
      case 'free':
        return {
          bookingTypes: ['consultation'],
          maxBookingsPerMonth: 1,
          features: ['Gratis konsultasjon']
        };
      case 'standard':
        return {
          bookingTypes: ['consultation', 'assessment'],
          maxBookingsPerMonth: 2,
          features: ['Konsultasjon', 'Kartleggingsprøve', '2 timer/måned']
        };
      case 'pluss':
        return {
          bookingTypes: ['consultation', 'assessment', 'lesson'],
          maxBookingsPerMonth: 4,
          features: ['Alle typer timer', '4 timer/måned', 'Læringsrapport']
        };
      case 'premium':
        return {
          bookingTypes: ['consultation', 'assessment', 'lesson'],
          maxBookingsPerMonth: 8,
          features: ['Alle typer timer', '8 timer/måned', 'Læringsrapport', 'Prioritert support']
        };
      default:
        return getPlanFeatures('free');
    }
  };

  const isBookingTypeAllowed = (bookingType: string, planType: string) => {
    const features = getPlanFeatures(planType);
    return features.bookingTypes.includes(bookingType);
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

  const getSelectedStudentPlan = () => {
    if (profile?.role === 'student') {
      return profile.plan_type || 'free';
    }
    const selectedStudent = students.find(s => s.id === newBooking.student_id);
    return selectedStudent?.plan_type || 'free';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#741b1c] mx-auto mb-4"></div>
          <p className="text-gray-600">Laster...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold text-gray-900">Agoras Dashboard</h1>
                <p className="text-xs text-[#741b1c] capitalize">{profile?.role} Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(profile?.plan_type || 'free')}`}>
                  {getPlanLabel(profile?.plan_type || 'free')} Plan
                </span>
                <span className="text-gray-700">Hei, {profile?.full_name || user?.email}</span>
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

      {/* Success Message */}
      {updateSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>Operasjonen ble fullført!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-[#741b1c] p-3 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Min Profil</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 capitalize">{profile?.role}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(profile?.plan_type || 'free')}`}>
                    {getPlanLabel(profile?.plan_type || 'free')}
                  </span>
                </div>
              </div>
            </div>

            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {updateError}
              </div>
            )}

            {!isEditingProfile ? (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Navn</label>
                    <p className="text-gray-900">{profile?.full_name || 'Ikke oppgitt'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">E-post</label>
                    <p className="text-gray-900">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefon</label>
                    <p className="text-gray-900">{profile?.phone || 'Ikke oppgitt'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plan</label>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(profile?.plan_type || 'free')}`}>
                        {getPlanLabel(profile?.plan_type || 'free')}
                      </span>
                      {profile?.plan_type === 'free' && (
                        <button className="text-xs text-[#741b1c] hover:underline">
                          Oppgrader
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleEditProfile}
                  className="w-full mt-6 bg-[#741b1c] text-white py-2 rounded-lg hover:bg-[#5a1415] transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Rediger Profil</span>
                </button>
              </>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fullt Navn
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={editableProfileData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                    placeholder="Ditt fulle navn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-post
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">E-post kan ikke endres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editableProfileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                    placeholder="+47 123 45 678"
                  />
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 bg-[#741b1c] text-white py-2 rounded-lg hover:bg-[#5a1415] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    <span>{updateLoading ? 'Lagrer...' : 'Lagre Endringer'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updateLoading}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4" />
                    <span>Avbryt</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Students Section (for parents only) */}
          {profile?.role === 'parent' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Mine Elever</h2>
                </div>
                <button 
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-[#741b1c] text-white p-2 rounded-lg hover:bg-[#5a1415] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Ingen elever registrert ennå</p>
                  <button 
                    onClick={() => setShowAddStudentModal(true)}
                    className="bg-[#741b1c] text-white px-4 py-2 rounded-lg hover:bg-[#5a1415] transition-colors"
                  >
                    Legg til elev
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{student.full_name}</h3>
                          <p className="text-sm text-gray-600">{student.grade_level}</p>
                          <p className="text-sm text-[#741b1c] capitalize">{student.current_level}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(student.plan_type || 'free')}`}>
                              {getPlanLabel(student.plan_type || 'free')}
                            </span>
                          </div>
                          {student.goals && (
                            <p className="text-xs text-gray-500 mt-1">Mål: {student.goals}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-4 w-4 text-[#741b1c]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Student Progress Section (for students only) */}
          {profile?.role === 'student' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Min Fremgang</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Totale Timer</span>
                    <span className="text-lg font-bold text-[#741b1c]">{bookings.filter(b => b.status === 'completed').length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#741b1c] h-2 rounded-full" style={{ width: `${Math.min((bookings.filter(b => b.status === 'completed').length / 10) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Min Plan</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(profile?.plan_type || 'free')}`}>
                      {getPlanLabel(profile?.plan_type || 'free')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {getPlanFeatures(profile?.plan_type || 'free').features.join(' • ')}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Neste Mål</span>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600">Fullfør 10 timer for å låse opp sertifikat</p>
                </div>

                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-[#741b1c] text-white py-3 rounded-lg hover:bg-[#5a1415] transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Book Ny Time</span>
                </button>
              </div>
            </div>
          )}

          {/* Bookings Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {profile?.role === 'student' ? 'Mine Timer' : 'Kommende Timer'}
                </h2>
              </div>
              {(students.length > 0 || profile?.role === 'student') && (
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="bg-[#741b1c] text-white p-2 rounded-lg hover:bg-[#5a1415] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Ingen timer booket ennå</p>
                {(students.length > 0 || profile?.role === 'student') ? (
                  <button 
                    onClick={() => setShowBookingModal(true)}
                    className="bg-[#741b1c] text-white px-4 py-2 rounded-lg hover:bg-[#5a1415] transition-colors"
                  >
                    Book time
                  </button>
                ) : (
                  <p className="text-sm text-gray-400">Legg til en elev først for å kunne booke timer</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-[#741b1c]" />
                          {booking.booking_type === 'consultation' ? 'Konsultasjon' : 
                           booking.booking_type === 'lesson' ? 'Undervisning' : 'Kartlegging'}
                        </h3>
                        {profile?.role === 'parent' && booking.students?.full_name && (
                          <p className="text-sm text-gray-600">{booking.students.full_name}</p>
                        )}
                        <p className="text-sm text-[#741b1c]">
                          {new Date(booking.scheduled_date).toLocaleDateString('no-NO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {booking.notes && (
                          <p className="text-xs text-gray-500 mt-1">{booking.notes}</p>
                        )}
                      </div>
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
                    </div>
                  </div>
                ))}
                {bookings.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{bookings.length - 3} flere timer...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <button 
            onClick={() => setShowBookingModal(true)}
            disabled={students.length === 0 && profile?.role === 'parent'}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-[#741b1c] p-3 rounded-full w-fit mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {profile?.role === 'student' ? 'Book Min Neste Time' : 'Book Gratis Konsultasjon'}
            </h3>
            <p className="text-gray-600">
              {profile?.role === 'student' 
                ? 'Planlegg din neste undervisningstime' 
                : 'Få en personlig vurdering av elevens behov'}
            </p>
            {students.length === 0 && profile?.role === 'parent' && (
              <p className="text-sm text-red-500 mt-2">Legg til en elev først</p>
            )}
          </button>

          <button 
            onClick={() => window.open('/kurs', '_blank')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="bg-blue-500 p-3 rounded-full w-fit mb-4">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Se Kursutvalg</h3>
            <p className="text-gray-600">Utforsk våre tilpassede matematikkurs</p>
          </button>

          <button 
            onClick={() => setShowContactModal(true)}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="bg-green-500 p-3 rounded-full w-fit mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kontakt Oss</h3>
            <p className="text-gray-600">Få hjelp fra våre rådgivere</p>
          </button>
        </div>
      </main>

      {/* Add Student Modal (Parents only) */}
      {showAddStudentModal && profile?.role === 'parent' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Legg til Elev</h2>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fullt Navn *
                </label>
                <input
                  type="text"
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({...newStudent, full_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="Elevens fulle navn"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Klassetrinn *
                </label>
                <input
                  type="text"
                  value={newStudent.grade_level}
                  onChange={(e) => setNewStudent({...newStudent, grade_level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="f.eks. 9. klasse, Vg2, R1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivå *
                </label>
                <select
                  value={newStudent.current_level}
                  onChange={(e) => setNewStudent({...newStudent, current_level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  required
                >
                  <option value="ungdomsskole">Ungdomsskole</option>
                  <option value="videregaaende">Videregående</option>
                  <option value="r1-r2">R1 & R2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Type *
                </label>
                <select
                  value={newStudent.plan_type}
                  onChange={(e) => setNewStudent({...newStudent, plan_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  required
                >
                  <option value="free">Gratis</option>
                  <option value="standard">Standard</option>
                  <option value="pluss">Pluss</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mål og Ønsker
                </label>
                <textarea
                  value={newStudent.goals}
                  onChange={(e) => setNewStudent({...newStudent, goals: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="Hva ønsker eleven å oppnå?"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-[#741b1c] text-white py-2 rounded-lg hover:bg-[#5a1415] transition-colors disabled:opacity-50"
                >
                  {submitLoading ? 'Legger til...' : 'Legg til Elev'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Time</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleBookConsultation} className="space-y-4">
              {profile?.role === 'parent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Velg Elev *
                  </label>
                  <select
                    value={newBooking.student_id}
                    onChange={(e) => setNewBooking({...newBooking, student_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                    required
                  >
                    <option value="">Velg en elev</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.full_name} ({getPlanLabel(student.plan_type || 'free')})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type Time *
                </label>
                <select
                  value={newBooking.booking_type}
                  onChange={(e) => setNewBooking({...newBooking, booking_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  required
                >
                  <option value="consultation" disabled={!isBookingTypeAllowed('consultation', getSelectedStudentPlan())}>
                    Gratis Konsultasjon {!isBookingTypeAllowed('consultation', getSelectedStudentPlan()) && '(Ikke tilgjengelig)'}
                  </option>
                  <option value="assessment" disabled={!isBookingTypeAllowed('assessment', getSelectedStudentPlan())}>
                    Kartleggingsprøve {!isBookingTypeAllowed('assessment', getSelectedStudentPlan()) && '(Krever Standard+)'}
                  </option>
                  <option value="lesson" disabled={!isBookingTypeAllowed('lesson', getSelectedStudentPlan())}>
                    Undervisningstime {!isBookingTypeAllowed('lesson', getSelectedStudentPlan()) && '(Krever Pluss+)'}
                  </option>
                </select>
                
                {/* Plan restriction notice */}
                {(newBooking.student_id || profile?.role === 'student') && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Plan: {getPlanLabel(getSelectedStudentPlan())}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Tilgjengelige tjenester: {getPlanFeatures(getSelectedStudentPlan()).features.join(' • ')}
                    </div>
                    {!isBookingTypeAllowed(newBooking.booking_type, getSelectedStudentPlan()) && (
                      <div className="flex items-center space-x-1 mt-2 text-red-600">
                        <Lock className="h-3 w-3" />
                        <span className="text-xs">Denne tjenesten krever en høyere plan</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ønsket Dato og Tid *
                </label>
                <input
                  type="datetime-local"
                  value={newBooking.scheduled_date}
                  onChange={(e) => setNewBooking({...newBooking, scheduled_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notater
                </label>
                <textarea
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="Spesielle ønsker eller informasjon..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={submitLoading || !isBookingTypeAllowed(newBooking.booking_type, getSelectedStudentPlan())}
                  className="flex-1 bg-[#741b1c] text-white py-2 rounded-lg hover:bg-[#5a1415] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? 'Booker...' : 'Book Time'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kontakt Support</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-[#741b1c]" />
                <div>
                  <p className="font-medium text-gray-900">E-post</p>
                  <p className="text-sm text-gray-600">agoras_norge@hotmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-[#741b1c]" />
                <div>
                  <p className="font-medium text-gray-900">Telefon</p>
                  <p className="text-sm text-gray-600">Ring for direkte kontakt</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emne *
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="Hva gjelder henvendelsen?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Melding *
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="Beskriv din henvendelse..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-[#741b1c] text-white py-2 rounded-lg hover:bg-[#5a1415] transition-colors disabled:opacity-50"
                >
                  {submitLoading ? 'Sender...' : 'Send Melding'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentStudentDashboard;