import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data found",
  description = "There's nothing here yet. Start by adding some data.",
  actionText = "Add New",
  onAction,
  icon = "Database",
  type = 'default'
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'students':
        return {
          title: "No students found",
          description: "Start building your student roster by adding your first student.",
          actionText: "Add Student",
          icon: "UserPlus"
        };
      case 'attendance':
        return {
          title: "No attendance records",
          description: "Begin tracking attendance by marking students present or absent.",
          actionText: "Mark Attendance",
          icon: "Calendar"
        };
      case 'grades':
        return {
          title: "No grades recorded",
          description: "Start recording academic performance by adding student grades.",
          actionText: "Add Grades",
          icon: "BookOpen"
        };
      case 'reports':
        return {
          title: "No reports generated",
          description: "Create comprehensive reports to analyze student performance.",
          actionText: "Generate Report",
          icon: "FileText"
        };
      default:
        return { title, description, actionText, icon };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-8 mb-6">
        <ApperIcon 
          name={config.icon} 
          size={64} 
          className="text-gray-400" 
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {config.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {config.description}
      </p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {config.actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;