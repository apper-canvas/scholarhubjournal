import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import GradeGrid from '@/components/organisms/GradeGrid';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import gradeService from '@/services/api/gradeService';
import studentService from '@/services/api/studentService';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const loadGradesData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [gradesData, studentsData, subjectsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        gradeService.getSubjects()
      ]);
      
      setGrades(gradesData);
      setStudents(studentsData.filter(s => s.status === 'Active'));
      setSubjects(subjectsData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load grades data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  const handleSaveGrades = async (editingGrades, term) => {
    try {
      await gradeService.updateBulkGrades(editingGrades, term);
      
      // Reload grades to get updated data
      const updatedGrades = await gradeService.getAll();
      setGrades(updatedGrades);
      
      toast.success('Grades saved successfully');
    } catch (err) {
      toast.error('Failed to save grades');
    }
  };

  const getFilteredData = () => {
    let filteredStudents = students;
    let filteredGrades = grades;

    if (selectedGrade) {
      filteredStudents = students.filter(s => s.grade === selectedGrade);
    }

    if (selectedSubject) {
      filteredGrades = grades.filter(g => g.subject === selectedSubject);
    }

    return { filteredStudents, filteredGrades };
  };

  const calculateClassAverage = () => {
    const { filteredGrades } = getFilteredData();
    if (filteredGrades.length === 0) return 0;
    
    const total = filteredGrades.reduce((sum, grade) => sum + grade.score, 0);
    return (total / filteredGrades.length).toFixed(1);
  };

  const getGradeStats = () => {
    const { filteredGrades } = getFilteredData();
    const stats = {
      total: filteredGrades.length,
      average: calculateClassAverage(),
      highest: filteredGrades.length > 0 ? Math.max(...filteredGrades.map(g => g.score)) : 0,
      lowest: filteredGrades.length > 0 ? Math.min(...filteredGrades.map(g => g.score)) : 0
    };
    return stats;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGradesData} />;
  }

  const { filteredStudents, filteredGrades } = getFilteredData();
  const stats = getGradeStats();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">
            Manage student grades and academic performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Grade Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ApperIcon name="BookOpen" size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Grades</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.average}</p>
              <p className="text-sm text-gray-600">Class Average</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ApperIcon name="Award" size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.highest}</p>
              <p className="text-sm text-gray-600">Highest Score</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <ApperIcon name="AlertCircle" size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.lowest}</p>
              <p className="text-sm text-gray-600">Lowest Score</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grade Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredStudents.length === 0 ? (
          <Empty
            type="grades"
            onAction={loadGradesData}
          />
        ) : (
          <GradeGrid
            grades={filteredGrades}
            students={filteredStudents}
            subjects={subjects}
            onSaveGrades={handleSaveGrades}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Grades;