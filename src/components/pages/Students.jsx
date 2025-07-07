import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import StudentCard from '@/components/molecules/StudentCard';
import StudentTable from '@/components/organisms/StudentTable';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import studentService from '@/services/api/studentService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    email: '',
    phone: '',
    address: '',
    guardianName: '',
    guardianContact: '',
    status: 'Active'
  });

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.includes(searchTerm)
    );
    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      grade: '',
      email: '',
      phone: '',
      address: '',
      guardianName: '',
      guardianContact: '',
      status: 'Active'
    });
    setShowAddForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      grade: student.grade,
      email: student.email,
      phone: student.phone,
      address: student.address,
      guardianName: student.guardianName,
      guardianContact: student.guardianContact,
      status: student.status
    });
    setShowAddForm(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(studentId);
        setStudents(prev => prev.filter(s => s.Id !== studentId));
        setFilteredStudents(prev => prev.filter(s => s.Id !== studentId));
        toast.success('Student deleted successfully');
      } catch (err) {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        const updated = await studentService.update(editingStudent.Id, formData);
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updated : s));
        setFilteredStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updated : s));
        toast.success('Student updated successfully');
      } else {
        const newStudent = await studentService.create(formData);
        setStudents(prev => [...prev, newStudent]);
        setFilteredStudents(prev => [...prev, newStudent]);
        toast.success('Student added successfully');
      }
      setShowAddForm(false);
    } catch (err) {
      toast.error('Failed to save student');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <Loading type={viewMode === 'table' ? 'table' : 'cards'} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">
            Manage your student roster and information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ApperIcon name="Table" size={20} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ApperIcon name="LayoutGrid" size={20} />
            </button>
          </div>
          <Button onClick={handleAddStudent}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Student
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search students..."
            className="flex-1"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <Empty
            type="students"
            onAction={handleAddStudent}
          />
        ) : (
          <>
            {viewMode === 'table' ? (
              <StudentTable
                students={filteredStudents}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.map((student) => (
                  <StudentCard key={student.Id} student={student} />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Add/Edit Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Grade"
                  name="grade"
                  type="select"
                  value={formData.grade}
                  onChange={handleInputChange}
                  options={[
                    { value: '9', label: 'Grade 9' },
                    { value: '10', label: 'Grade 10' },
                    { value: '11', label: 'Grade 11' },
                    { value: '12', label: 'Grade 12' }
                  ]}
                  required
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Status"
                  name="status"
                  type="select"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' }
                  ]}
                />
              </div>
              
              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Guardian Name"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Guardian Contact"
                  name="guardianContact"
                  type="tel"
                  value={formData.guardianContact}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <Button type="submit">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Students;