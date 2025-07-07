import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend = null, 
  color = 'primary',
  className = ''
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 text-white',
    secondary: 'from-secondary-500 to-secondary-600 text-white',
    success: 'from-green-500 to-green-600 text-white',
    warning: 'from-yellow-500 to-yellow-600 text-white',
    danger: 'from-red-500 to-red-600 text-white',
    info: 'from-blue-500 to-blue-600 text-white'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`card bg-gradient-to-r ${colorClasses[color]} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className="mr-1" 
              />
              <span className="text-sm font-medium">
                {Math.abs(trend)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;