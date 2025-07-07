import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const StudentCard = ({ student }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/students/${student.Id}`);
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      default: return 'default';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={handleClick}
      className="card cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full p-3">
          <ApperIcon name="User" size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-gray-600">Grade {student.grade}</p>
        </div>
        <Badge variant={getStatusVariant(student.status)}>
          {student.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Mail" size={14} />
          <span>{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Phone" size={14} />
          <span>{student.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" size={14} />
          <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard;