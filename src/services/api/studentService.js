import studentsData from '@/services/mockData/students.json';

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.students]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const student = this.students.find(s => s.Id === parseInt(id));
        if (student) {
          resolve({ ...student });
        } else {
          reject(new Error('Student not found'));
        }
      }, 200);
    });
  }

  async create(studentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.students.map(s => s.Id)) + 1;
        const newStudent = {
          Id: newId,
          ...studentData,
          enrollmentDate: new Date().toISOString().split('T')[0]
        };
        this.students.push(newStudent);
        resolve({ ...newStudent });
      }, 400);
    });
  }

  async update(id, studentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.students.findIndex(s => s.Id === parseInt(id));
        if (index !== -1) {
          this.students[index] = { ...this.students[index], ...studentData };
          resolve({ ...this.students[index] });
        } else {
          reject(new Error('Student not found'));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.students.findIndex(s => s.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.students.splice(index, 1)[0];
          resolve(deleted);
        } else {
          reject(new Error('Student not found'));
        }
      }, 300);
    });
  }

  async searchStudents(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.students.filter(student =>
          student.firstName.toLowerCase().includes(query.toLowerCase()) ||
          student.lastName.toLowerCase().includes(query.toLowerCase()) ||
          student.email.toLowerCase().includes(query.toLowerCase()) ||
          student.grade.includes(query)
        );
        resolve(filtered);
      }, 200);
    });
  }

  async getStudentsByGrade(grade) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.students.filter(student => student.grade === grade);
        resolve(filtered);
      }, 200);
    });
  }
}

export default new StudentService();