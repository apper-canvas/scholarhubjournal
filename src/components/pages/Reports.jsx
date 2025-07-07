import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import studentService from '@/services/api/studentService';
import gradeService from '@/services/api/gradeService';
import attendanceService from '@/services/api/attendanceService';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('student');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [generatedReports, setGeneratedReports] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [studentsData, subjectsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getSubjects()
      ]);
      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load initial data');
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data = {};
      
      switch (reportType) {
        case 'student':
          if (!selectedStudent) {
            toast.error('Please select a student');
            return;
          }
          data = await generateStudentReport(selectedStudent);
          break;
        case 'class':
          if (!selectedGrade) {
            toast.error('Please select a grade');
            return;
          }
          data = await generateClassReport(selectedGrade);
          break;
        case 'subject':
          if (!selectedSubject) {
            toast.error('Please select a subject');
            return;
          }
          data = await generateSubjectReport(selectedSubject);
          break;
        case 'attendance':
          if (!dateRange.startDate || !dateRange.endDate) {
            toast.error('Please select date range');
            return;
          }
          data = await generateAttendanceReport(dateRange);
          break;
        default:
          break;
      }
      
      setReportData(data);
      
      // Add to generated reports list
      const newReport = {
        id: Date.now(),
        type: reportType,
        title: getReportTitle(),
        generatedAt: new Date().toLocaleString(),
        parameters: getReportParameters()
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      toast.success('Report generated successfully');
      
    } catch (err) {
      setError(err.message);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateStudentReport = async (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId));
    const grades = await gradeService.getByStudentId(studentId);
    const attendance = await attendanceService.getByStudentId(studentId);
    
    return {
      type: 'student',
      student,
      grades,
      attendance,
      stats: {
        averageGrade: grades.length > 0 ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1) : 0,
        totalGrades: grades.length,
        attendanceRate: attendance.length > 0 ? ((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100).toFixed(1) : 0
      }
    };
  };

  const generateClassReport = async (grade) => {
    const classStudents = students.filter(s => s.grade === grade);
    const allGrades = await gradeService.getAll();
    const classGrades = allGrades.filter(g => 
      classStudents.some(s => s.Id === g.studentId)
    );
    
    return {
      type: 'class',
      grade,
      students: classStudents,
      grades: classGrades,
      stats: {
        totalStudents: classStudents.length,
        averageGrade: classGrades.length > 0 ? (classGrades.reduce((sum, g) => sum + g.score, 0) / classGrades.length).toFixed(1) : 0,
        highestGrade: classGrades.length > 0 ? Math.max(...classGrades.map(g => g.score)) : 0,
        lowestGrade: classGrades.length > 0 ? Math.min(...classGrades.map(g => g.score)) : 0
      }
    };
  };

  const generateSubjectReport = async (subject) => {
    const subjectGrades = await gradeService.getBySubject(subject);
    const subjectStudents = students.filter(s => 
      subjectGrades.some(g => g.studentId === s.Id)
    );
    
    return {
      type: 'subject',
      subject,
      students: subjectStudents,
      grades: subjectGrades,
      stats: {
        totalStudents: subjectStudents.length,
        averageGrade: subjectGrades.length > 0 ? (subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length).toFixed(1) : 0,
        highestGrade: subjectGrades.length > 0 ? Math.max(...subjectGrades.map(g => g.score)) : 0,
        lowestGrade: subjectGrades.length > 0 ? Math.min(...subjectGrades.map(g => g.score)) : 0
      }
    };
  };

  const generateAttendanceReport = async (dateRange) => {
    const allAttendance = await attendanceService.getAll();
    const filteredAttendance = allAttendance.filter(a => 
      a.date >= dateRange.startDate && a.date <= dateRange.endDate
    );
    
    return {
      type: 'attendance',
      dateRange,
      attendance: filteredAttendance,
      stats: {
        totalRecords: filteredAttendance.length,
        presentCount: filteredAttendance.filter(a => a.status === 'Present').length,
        absentCount: filteredAttendance.filter(a => a.status === 'Absent').length,
        lateCount: filteredAttendance.filter(a => a.status === 'Late').length,
        excusedCount: filteredAttendance.filter(a => a.status === 'Excused').length
      }
    };
  };

const getReportTitle = () => {
    switch (reportType) {
      case 'student': {
        const student = students.find(s => s.Id === parseInt(selectedStudent));
        return `Student Report - ${student?.firstName} ${student?.lastName}`;
      }
      case 'class':
        return `Class Report - Grade ${selectedGrade}`;
      case 'subject':
        return `Subject Report - ${selectedSubject}`;
      case 'attendance':
        return `Attendance Report - ${dateRange.startDate} to ${dateRange.endDate}`;
      default:
        return 'Report';
    }
  };

  const getReportParameters = () => {
    switch (reportType) {
      case 'student':
        return { studentId: selectedStudent };
      case 'class':
        return { grade: selectedGrade };
      case 'subject':
        return { subject: selectedSubject };
      case 'attendance':
        return { ...dateRange };
      default:
        return {};
    }
  };

  const exportReport = (format) => {
    if (!reportData) {
      toast.error('No report data to export');
      return;
    }
    
    // Mock export functionality
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  if (error) {
    return <Error message={error} onRetry={loadInitialData} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate and manage academic reports
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Report Configuration
            </h3>
            
            <div className="space-y-4">
              <FormField
                label="Report Type"
                name="reportType"
                type="select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                options={[
                  { value: 'student', label: 'Student Report' },
                  { value: 'class', label: 'Class Report' },
                  { value: 'subject', label: 'Subject Report' },
                  { value: 'attendance', label: 'Attendance Report' }
                ]}
              />
              
              {reportType === 'student' && (
                <FormField
                  label="Select Student"
                  name="selectedStudent"
                  type="select"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  options={students.map(s => ({
                    value: s.Id,
                    label: `${s.firstName} ${s.lastName} (Grade ${s.grade})`
                  }))}
                />
              )}
              
              {reportType === 'class' && (
                <FormField
                  label="Select Grade"
                  name="selectedGrade"
                  type="select"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  options={[
                    { value: '9', label: 'Grade 9' },
                    { value: '10', label: 'Grade 10' },
                    { value: '11', label: 'Grade 11' },
                    { value: '12', label: 'Grade 12' }
                  ]}
                />
              )}
              
              {reportType === 'subject' && (
                <FormField
                  label="Select Subject"
                  name="selectedSubject"
                  type="select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  options={subjects.map(s => ({
                    value: s,
                    label: s
                  }))}
                />
              )}
              
              {reportType === 'attendance' && (
                <>
                  <FormField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <FormField
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </>
              )}
              
              <Button
                onClick={generateReport}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="FileText" size={16} className="mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Report Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Report Preview
              </h3>
              {reportData && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => exportReport('pdf')}
                  >
                    <ApperIcon name="FileDown" size={16} className="mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => exportReport('excel')}
                  >
                    <ApperIcon name="FileSpreadsheet" size={16} className="mr-2" />
                    Excel
                  </Button>
                </div>
              )}
            </div>
            
            {loading ? (
              <Loading />
            ) : reportData ? (
              <div className="space-y-6">
                {/* Report Header */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-xl font-semibold text-gray-900">
                    {getReportTitle()}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Generated on {new Date().toLocaleString()}
                  </p>
                </div>

                {/* Report Content */}
                <div className="space-y-4">
                  {reportData.type === 'student' && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Student Information</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{reportData.student.firstName} {reportData.student.lastName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Grade:</span>
                          <span className="ml-2 font-medium">{reportData.student.grade}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{reportData.student.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-2 font-medium">{reportData.student.status}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Statistics</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(reportData.stats).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Empty
                type="reports"
                title="No report generated"
                description="Configure your report parameters and click 'Generate Report' to create a new report."
                actionText="Generate Report"
                onAction={generateReport}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Generated Reports History */}
      {generatedReports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Reports
          </h3>
          <div className="space-y-3">
            {generatedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-600">Generated: {report.generatedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Eye" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Download" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;