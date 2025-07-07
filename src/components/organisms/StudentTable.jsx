import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const StudentTable = ({ students, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleRowClick = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      default: return 'default';
    }
  };

  return (
    <div className="data-table">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Student</th>
              <th className="text-left">Grade</th>
              <th className="text-left">Email</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <motion.tr
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(student.Id)}
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full p-2">
                      <ApperIcon name="User" size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        ID: {student.Id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="font-medium">{student.grade}</span>
                </td>
                <td className="py-4">
                  <span className="text-gray-600">{student.email}</span>
                </td>
                <td className="py-4">
                  <span className="text-gray-600">{student.phone}</span>
                </td>
                <td className="py-4">
                  <Badge variant={getStatusVariant(student.status)}>
                    {student.status}
                  </Badge>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(student);
                      }}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(student.Id);
                      }}
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;