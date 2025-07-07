import attendanceData from '@/services/mockData/attendance.json';
import studentService from './studentService';

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.attendance]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const record = this.attendance.find(a => a.Id === parseInt(id));
        if (record) {
          resolve({ ...record });
        } else {
          reject(new Error('Attendance record not found'));
        }
      }, 200);
    });
  }

  async getByStudentId(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = this.attendance.filter(a => a.studentId === parseInt(studentId));
        resolve(records);
      }, 200);
    });
  }

  async getByDate(date) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = this.attendance.filter(a => a.date === date);
        resolve(records);
      }, 200);
    });
  }

  async getTodaysAttendance() {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const today = new Date().toISOString().split('T')[0];
        const todaysRecords = this.attendance.filter(a => a.date === today);
        const students = await studentService.getAll();
        
        const attendanceWithStudents = students.map(student => {
          const record = todaysRecords.find(r => r.studentId === student.Id);
          return {
            studentId: student.Id,
            studentName: `${student.firstName} ${student.lastName}`,
            grade: student.grade,
            status: record?.status || 'Not Marked',
            reason: record?.reason || '',
            timestamp: record?.timestamp || null
          };
        });
        
        resolve(attendanceWithStudents);
      }, 300);
    });
  }

  async markAttendance(studentId, status, reason = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        const existingIndex = this.attendance.findIndex(
          a => a.studentId === parseInt(studentId) && a.date === today
        );
        
        const record = {
          studentId: parseInt(studentId),
          date: today,
          status,
          reason,
          markedBy: 'Teacher',
          timestamp: new Date().toISOString()
        };
        
        if (existingIndex !== -1) {
          // Update existing record
          this.attendance[existingIndex] = { ...this.attendance[existingIndex], ...record };
          resolve({ ...this.attendance[existingIndex] });
        } else {
          // Create new record
          const newId = Math.max(...this.attendance.map(a => a.Id)) + 1;
          const newRecord = { Id: newId, ...record };
          this.attendance.push(newRecord);
          resolve({ ...newRecord });
        }
      }, 400);
    });
  }

  async getAttendanceStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaysRecords = this.attendance.filter(a => a.date === today);
        
        const stats = {
          present: todaysRecords.filter(r => r.status === 'Present').length,
          absent: todaysRecords.filter(r => r.status === 'Absent').length,
          late: todaysRecords.filter(r => r.status === 'Late').length,
          excused: todaysRecords.filter(r => r.status === 'Excused').length,
          total: todaysRecords.length
        };
        
        resolve(stats);
      }, 200);
    });
  }

  async getWeeklyAttendance() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const weekData = [
          { date: '2024-01-15', present: 8, absent: 2, late: 1 },
          { date: '2024-01-16', present: 9, absent: 1, late: 1 },
          { date: '2024-01-17', present: 10, absent: 1, late: 0 },
          { date: '2024-01-18', present: 8, absent: 2, late: 1 },
          { date: '2024-01-19', present: 9, absent: 1, late: 1 }
        ];
        resolve(weekData);
      }, 300);
    });
  }
}

export default new AttendanceService();