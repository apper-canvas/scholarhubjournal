import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/students', label: 'Students', icon: 'Users' },
    { path: '/attendance', label: 'Attendance', icon: 'Calendar' },
    { path: '/grades', label: 'Grades', icon: 'BookOpen' },
    { path: '/reports', label: 'Reports', icon: 'FileText' }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-2">
            <ApperIcon name="GraduationCap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ScholarHub</h1>
            <p className="text-sm text-gray-600">Student Management</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-2">
                <ApperIcon name="GraduationCap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ScholarHub</h1>
                <p className="text-sm text-gray-600">Student Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;