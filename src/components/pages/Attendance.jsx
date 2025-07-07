import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import AttendanceGrid from '@/components/organisms/AttendanceGrid';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import attendanceService from '@/services/api/attendanceService';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('grid');

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await attendanceService.getTodaysAttendance();
      setAttendanceData(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleMarkAttendance = async (studentId, status) => {
    try {
      await attendanceService.markAttendance(studentId, status);
      
      // Update local state
      setAttendanceData(prev =>
        prev.map(record =>
          record.studentId === studentId
            ? { ...record, status }
            : record
        )
      );
      
      toast.success(`Attendance marked as ${status}`);
    } catch (err) {
      toast.error('Failed to mark attendance');
    }
  };

  const handleBulkMarkPresent = async () => {
    try {
      const promises = attendanceData
        .filter(record => record.status === 'Not Marked')
        .map(record => attendanceService.markAttendance(record.studentId, 'Present'));
      
      await Promise.all(promises);
      
      setAttendanceData(prev =>
        prev.map(record =>
          record.status === 'Not Marked'
            ? { ...record, status: 'Present' }
            : record
        )
      );
      
      toast.success('All unmarked students marked as present');
    } catch (err) {
      toast.error('Failed to mark bulk attendance');
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      present: attendanceData.filter(r => r.status === 'Present').length,
      absent: attendanceData.filter(r => r.status === 'Absent').length,
      late: attendanceData.filter(r => r.status === 'Late').length,
      excused: attendanceData.filter(r => r.status === 'Excused').length,
      notMarked: attendanceData.filter(r => r.status === 'Not Marked').length
    };
    stats.total = attendanceData.length;
    return stats;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAttendance} />;
  }

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">
            Track and manage student attendance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button onClick={handleBulkMarkPresent} variant="secondary">
            <ApperIcon name="CheckCircle" size={16} className="mr-2" />
            Mark All Present
          </Button>
        </div>
      </motion.div>

      {/* Attendance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ApperIcon name="Users" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <ApperIcon name="Check" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
              <p className="text-sm text-gray-600">Present</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <ApperIcon name="X" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <ApperIcon name="Clock" size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
              <p className="text-sm text-gray-600">Late</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ApperIcon name="Info" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.excused}</p>
              <p className="text-sm text-gray-600">Excused</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <ApperIcon name="Minus" size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.notMarked}</p>
              <p className="text-sm text-gray-600">Not Marked</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Attendance Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {attendanceData.length === 0 ? (
          <Empty
            type="attendance"
            onAction={loadAttendance}
          />
        ) : (
          <AttendanceGrid
            attendanceData={attendanceData}
            onMarkAttendance={handleMarkAttendance}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Attendance;