import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, FileText, Save, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BookingManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  onSuccess: () => void;
}

const BookingManagementModal: React.FC<BookingManagementModalProps> = ({ 
  isOpen, 
  onClose, 
  booking, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    student_id: '',
    teacher_id: '',
    booking_type: 'consultation',
    scheduled_date: '',
    duration_minutes: 30,
    status: 'pending',
    notes: ''
  });
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!booking;

  useEffect(() => {
    if (isOpen) {
      fetchStudentsAndTeachers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (booking) {
      setFormData({
        student_id: booking.student_id || '',
        teacher_id: booking.teacher_id || '',
        booking_type: booking.booking_type || 'consultation',
        scheduled_date: booking.scheduled_date ? new Date(booking.scheduled_date).toISOString().slice(0, 16) : '',
        duration_minutes: booking.duration_minutes || 30,
        status: booking.status || 'pending',
        notes: booking.notes || ''
      });
    } else {
      setFormData({
        student_id: '',
        teacher_id: '',
        booking_type: 'consultation',
        scheduled_date: '',
        duration_minutes: 30,
        status: 'pending',
        notes: ''
      });
    }
    setError('');
    setShowDeleteConfirm(false);
  }, [booking, isOpen]);

  const fetchStudentsAndTeachers = async () => {
    try {
      const [studentsResult, teachersResult] = await Promise.all([
        supabase
          .from('students')
          .select('id, full_name, profiles!students_parent_id_fkey(full_name)')
          .order('full_name'),
        supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'teacher')
          .order('full_name')
      ]);
      
      setStudents(studentsResult.data || []);
      setTeachers(teachersResult.data || []);
    } catch (error) {
      console.error('Error fetching students and teachers:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration_minutes' ? parseInt(value) || 30 : value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        student_id: formData.student_id,
        teacher_id: formData.teacher_id || null,
        booking_type: formData.booking_type,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        duration_minutes: formData.duration_minutes,
        status: formData.status,
        notes: formData.notes
      };

      if (isEditing) {
        // Update existing booking
        const { error } = await supabase
          .from('bookings')
          .update({
            ...bookingData,
            updated_at: new Date().toISOString()
          })
          .eq('id', booking.id);

        if (error) throw error;
      } else {
        // Create new booking
        const { error } = await supabase
          .from('bookings')
          .insert([bookingData]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'En feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!booking) return;
    
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'En feil oppstod ved sletting');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Rediger Booking' : 'Ny Booking'}
          </h2>
          <p className="text-gray-600">
            {isEditing ? 'Oppdater bookinginformasjon' : 'Opprett ny booking'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!showDeleteConfirm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elev *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  required
                >
                  <option value="">Velg elev</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} ({student.profiles?.full_name || 'Ukjent forelder'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lærer
              </label>
              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
              >
                <option value="">Ikke tildelt ennå</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name || teacher.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="booking_type"
                value={formData.booking_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                required
              >
                <option value="consultation">Konsultasjon</option>
                <option value="assessment">Kartlegging</option>
                <option value="lesson">Undervisning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dato og Tid *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="datetime-local"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Varighet (minutter) *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  min="15"
                  max="180"
                  step="15"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                required
              >
                <option value="pending">Venter</option>
                <option value="confirmed">Bekreftet</option>
                <option value="completed">Fullført</option>
                <option value="cancelled">Avbrutt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notater
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="Ekstra informasjon om bookingen..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#741b1c] text-white py-3 rounded-lg hover:bg-[#5a1415] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Lagrer...' : (isEditing ? 'Oppdater' : 'Opprett')}</span>
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Slett Booking</h3>
            <p className="text-gray-600 mb-6">
              Er du sikker på at du vil slette denne bookingen? Denne handlingen kan ikke angres.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? 'Sletter...' : 'Ja, Slett'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagementModal;