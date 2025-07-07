import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import DashboardCharts from '@/components/organisms/DashboardCharts';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import studentService from '@/services/api/studentService';
import attendanceService from '@/services/api/attendanceService';
import gradeService from '@/services/api/gradeService';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [
        studentsData,
        attendanceData,
        weeklyData,
        gradeData
      ] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAttendanceStats(),
        attendanceService.getWeeklyAttendance(),
        gradeService.getGradeDistribution()
      ]);

      setStudents(studentsData);
      setAttendanceStats(attendanceData);
      setWeeklyAttendance(weeklyData);
      setGradeDistribution(gradeData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const activeStudents = students.filter(s => s.status === 'Active').length;
  const attendanceRate = attendanceStats ? 
    ((attendanceStats.present / attendanceStats.total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening in your school today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon="Users"
          color="primary"
          trend={5}
        />
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon="UserCheck"
          color="success"
          trend={2}
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon="Calendar"
          color="info"
          trend={-1}
        />
        <StatCard
          title="Average Grade"
          value="85.2"
          icon="BookOpen"
          color="warning"
          trend={3}
        />
      </div>

      {/* Charts */}
      <DashboardCharts
        attendanceData={weeklyAttendance}
        gradeData={gradeDistribution}
      />

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activities
        </h3>
        <div className="space-y-4">
          {[
            { action: 'New student enrolled', detail: 'Emma Johnson joined Grade 10A', time: '2 hours ago', type: 'student' },
            { action: 'Attendance marked', detail: 'Daily attendance completed for all classes', time: '3 hours ago', type: 'attendance' },
            { action: 'Grades updated', detail: 'Mathematics test scores added for Grade 11', time: '5 hours ago', type: 'grades' },
            { action: 'Report generated', detail: 'Monthly performance report created', time: '1 day ago', type: 'report' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-full ${
                activity.type === 'student' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'attendance' ? 'bg-green-100 text-green-600' :
                activity.type === 'grades' ? 'bg-yellow-100 text-yellow-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {activity.type === 'student' && <i className="fas fa-user-plus"></i>}
                {activity.type === 'attendance' && <i className="fas fa-calendar-check"></i>}
                {activity.type === 'grades' && <i className="fas fa-book"></i>}
                {activity.type === 'report' && <i className="fas fa-file-alt"></i>}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.detail}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;