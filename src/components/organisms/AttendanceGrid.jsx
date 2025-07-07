import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const AttendanceGrid = ({ attendanceData, onMarkAttendance }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800 border-green-200';
      case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'Late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Excused': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return 'Check';
      case 'Absent': return 'X';
      case 'Late': return 'Clock';
      case 'Excused': return 'Info';
      default: return 'Minus';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Attendance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendanceData.map((record) => (
            <motion.div
              key={record.studentId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full p-2">
                    <ApperIcon name="User" size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {record.studentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Grade {record.grade}
                    </p>
                  </div>
                </div>
                <Badge variant={record.status.toLowerCase()}>
                  <ApperIcon name={getStatusIcon(record.status)} size={12} />
                  {record.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onMarkAttendance(record.studentId, 'Present')}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="Check" size={14} />
                  Present
                </button>
                <button
                  onClick={() => onMarkAttendance(record.studentId, 'Absent')}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={14} />
                  Absent
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceGrid;