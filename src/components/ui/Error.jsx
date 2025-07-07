import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  type = 'default'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full p-6 mb-6">
        <ApperIcon 
          name="AlertCircle" 
          size={48} 
          className="text-red-600" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;