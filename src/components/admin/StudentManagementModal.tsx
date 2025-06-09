import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Target, FileText, Save, Trash2, AlertTriangle, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StudentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: any;
  onSuccess: () => void;
}

const StudentManagementModal: React.FC<StudentManagementModalProps> = ({ 
  isOpen, 
  onClose, 
  student, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    grade_level: '',
    current_level: 'ungdomsskole',
    plan_type: 'free',
    goals: '',
    notes: '',
    parent_id: ''
  });
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!student;

  useEffect(() => {
    if (isOpen) {
      fetchParents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.full_name || '',
        grade_level: student.grade_level || '',
        current_level: student.current_level || 'ungdomsskole',
        plan_type: student.plan_type || 'free',
        goals: student.goals || '',
        notes: student.notes || '',
        parent_id: student.parent_id || ''
      });
    } else {
      setFormData({
        full_name: '',
        grade_level: '',
        current_level: 'ungdomsskole',
        plan_type: 'free',
        goals: '',
        notes: '',
        parent_id: ''
      });
    }
    setError('');
    setShowDeleteConfirm(false);
  }, [student, isOpen]);

  const fetchParents = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'parent')
        .order('full_name');
      
      setParents(data || []);
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update({
            full_name: formData.full_name,
            grade_level: formData.grade_level,
            current_level: formData.current_level,
            plan_type: formData.plan_type,
            goals: formData.goals,
            notes: formData.notes,
            parent_id: formData.parent_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', student.id);

        if (error) throw error;
      } else {
        // Create new student
        const { error } = await supabase
          .from('students')
          .insert([{
            full_name: formData.full_name,
            grade_level: formData.grade_level,
            current_level: formData.current_level,
            plan_type: formData.plan_type,
            goals: formData.goals,
            notes: formData.notes,
            parent_id: formData.parent_id
          }]);

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
    if (!student) return;
    
    setLoading(true);
    setError('');

    try {
      // First, delete related bookings
      await supabase.from('bookings').delete().eq('student_id', student.id);
      
      // Then delete the student
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', student.id);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'En feil oppstod ved sletting');
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-600';
      case 'standard': return 'text-green-600';
      case 'pluss': return 'text-purple-600';
      case 'premium': return 'text-orange-600';
      default: return 'text-gray-600';
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

  if (!isOpen) return null;

  console.log('StudentManagementModal is rendering');

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
            {isEditing ? 'Rediger Elev' : 'Ny Elev'}
          </h2>
          <p className="text-gray-600">
            {isEditing ? 'Oppdater elevinformasjon' : 'Legg til ny elev'}
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
                  placeholder="Elevens fulle navn"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Klassetrinn *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="grade_level"
                  value={formData.grade_level}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="f.eks. 9. klasse, Vg2, R1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivå *
              </label>
              <select
                name="current_level"
                value={formData.current_level}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
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
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="plan_type"
                  value={formData.plan_type}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  required
                >
                  <option value="free">Gratis</option>
                  <option value="standard">Standard</option>
                  <option value="pluss">Pluss</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bestemmer hvilke tjenester eleven har tilgang til
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forelder *
              </label>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                required
              >
                <option value="">Velg forelder</option>
                {parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.full_name || parent.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mål og Ønsker
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#741b1c] focus:border-transparent"
                  placeholder="Hva ønsker eleven å oppnå?"
                  rows={3}
                />
              </div>
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
                  placeholder="Ekstra informasjon om eleven..."
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Slett Elev</h3>
            <p className="text-gray-600 mb-6">
              Er du sikker på at du vil slette denne eleven? Dette vil også slette alle tilknyttede bookinger. Denne handlingen kan ikke angres.
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

export default StudentManagementModal;