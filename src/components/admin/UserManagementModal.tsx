import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, UserCheck, Save, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onSuccess: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'parent'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'parent'
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        role: 'parent'
      });
    }
    setError('');
    setShowDeleteConfirm(false);
  }, [user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            role: formData.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
      } else {
        // Create new user - this would typically require admin privileges
        // For now, we'll show a message that this needs to be done through registration
        setError('Nye brukere må registrere seg selv gjennom registreringsskjemaet');
        setLoading(false);
        return;
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
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      // First, delete related records
      await supabase.from('students').delete().eq('parent_id', user.id);
      await supabase.from('bookings').delete().eq('student_id', user.id);
      
      // Then delete the profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

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
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Rediger Bruker' : 'Ny Bruker'}
          </h2>
          <p className="text-gray-600">
            {isEditing ? 'Oppdater brukerinformasjon' : 'Legg til ny bruker'}
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
                Fullt Navn *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="Fullt navn"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-post *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="E-postadresse"
                  required
                  disabled={isEditing}
                />
              </div>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">E-post kan ikke endres</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="+47 123 45 678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rolle *
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  required
                >
                  <option value="parent">Forelder</option>
                  <option value="student">Elev</option>
                  <option value="teacher">Lærer</option>
                  <option value="admin">Administrator</option>
                </select>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Slett Bruker</h3>
            <p className="text-gray-600 mb-6">
              Er du sikker på at du vil slette denne brukeren? Dette vil også slette alle tilknyttede elever og bookinger. Denne handlingen kan ikke angres.
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

export default UserManagementModal;