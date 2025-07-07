import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const GradeGrid = ({ grades, students, subjects, onSaveGrades }) => {
  const [editingGrades, setEditingGrades] = useState({});
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  const handleGradeChange = (studentId, subject, value) => {
    setEditingGrades(prev => ({
      ...prev,
      [`${studentId}-${subject}`]: value
    }));
  };

  const handleSaveGrades = () => {
    onSaveGrades(editingGrades, selectedTerm);
    setEditingGrades({});
  };

  const getGradeColor = (grade) => {
    const numGrade = parseFloat(grade);
    if (numGrade >= 90) return 'text-green-600';
    if (numGrade >= 80) return 'text-blue-600';
    if (numGrade >= 70) return 'text-yellow-600';
    if (numGrade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const calculateGPA = (studentGrades) => {
    const validGrades = studentGrades.filter(g => g.score && g.score > 0);
    if (validGrades.length === 0) return 0;
    
    const total = validGrades.reduce((sum, g) => sum + g.score, 0);
    return (total / validGrades.length).toFixed(2);
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Grade Management
          </h3>
          <div className="flex items-center gap-4">
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
            <Button onClick={handleSaveGrades} disabled={Object.keys(editingGrades).length === 0}>
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                {subjects.map(subject => (
                  <th key={subject} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {subject}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => {
                const studentGrades = grades.filter(g => g.studentId === student.Id);
                const gpa = calculateGPA(studentGrades);
                
                return (
                  <motion.tr
                    key={student.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full p-2">
                          <ApperIcon name="User" size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Grade {student.grade}
                          </p>
                        </div>
                      </div>
                    </td>
                    {subjects.map(subject => {
                      const existingGrade = studentGrades.find(g => g.subject === subject);
                      const editingKey = `${student.Id}-${subject}`;
                      const currentValue = editingGrades[editingKey] !== undefined 
                        ? editingGrades[editingKey] 
                        : existingGrade?.score || '';
                      
                      return (
                        <td key={subject} className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={currentValue}
                            onChange={(e) => handleGradeChange(student.Id, subject, e.target.value)}
                            className={`w-20 text-center ${getGradeColor(currentValue)}`}
                            placeholder="--"
                          />
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold text-lg ${getGradeColor(gpa * 10)}`}>
                        {gpa}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradeGrid;