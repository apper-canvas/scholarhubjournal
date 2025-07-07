import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import studentService from '@/services/api/studentService';
import gradeService from '@/services/api/gradeService';
import attendanceService from '@/services/api/attendanceService';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [studentData, gradesData, attendanceData] = await Promise.all([
        studentService.getById(id),
        gradeService.getByStudentId(id),
        attendanceService.getByStudentId(id)
      ]);
      
      setStudent(studentData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.score, 0);
    return (total / grades.length).toFixed(2);
  };

  const calculateAttendanceRate = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    return ((presentCount / attendance.length) * 100).toFixed(1);
  };

  const getSubjectGrades = () => {
    const subjects = {};
    grades.forEach(grade => {
      if (!subjects[grade.subject]) {
        subjects[grade.subject] = [];
      }
      subjects[grade.subject].push(grade);
    });
    return subjects;
  };

  const getRecentAttendance = () => {
    return attendance
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudentData} />;
  }

  if (!student) {
    return <Error message="Student not found" />;
  }

  const subjectGrades = getSubjectGrades();
  const recentAttendance = getRecentAttendance();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/students')}
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              Grade {student.grade} • ID: {student.Id}
            </p>
          </div>
        </div>
        <Badge variant={student.status.toLowerCase()}>
          {student.status}
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full p-4">
                <ApperIcon name="User" size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Student Information
                </h3>
                <p className="text-sm text-gray-600">
                  Personal details and contact information
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{student.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{student.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900">{student.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Enrollment Date</label>
                <p className="text-gray-900">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Guardian</label>
                <p className="text-gray-900">{student.guardianName}</p>
                <p className="text-sm text-gray-600">{student.guardianContact}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ApperIcon name="BookOpen" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{calculateGPA()}</p>
                  <p className="text-sm text-gray-600">Current GPA</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ApperIcon name="Calendar" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{calculateAttendanceRate()}%</p>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <ApperIcon name="Award" size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
                  <p className="text-sm text-gray-600">Total Grades</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Grades */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subject Performance
            </h3>
            <div className="space-y-4">
              {Object.entries(subjectGrades).map(([subject, subjectGradeList]) => {
                const average = (subjectGradeList.reduce((sum, g) => sum + g.score, 0) / subjectGradeList.length).toFixed(1);
                const highest = Math.max(...subjectGradeList.map(g => g.score));
                const lowest = Math.min(...subjectGradeList.map(g => g.score));
                
                return (
                  <div key={subject} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{subject}</h4>
                      <span className="text-lg font-semibold text-primary-600">{average}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tests:</span>
                        <span className="ml-2 font-medium">{subjectGradeList.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Highest:</span>
                        <span className="ml-2 font-medium text-green-600">{highest}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Lowest:</span>
                        <span className="ml-2 font-medium text-red-600">{lowest}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Attendance
            </h3>
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    {record.reason && (
                      <p className="text-sm text-gray-600">{record.reason}</p>
                    )}
                  </div>
                  <Badge variant={record.status.toLowerCase()}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;