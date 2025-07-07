import gradesData from '@/services/mockData/grades.json';

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.grades]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const grade = this.grades.find(g => g.Id === parseInt(id));
        if (grade) {
          resolve({ ...grade });
        } else {
          reject(new Error('Grade not found'));
        }
      }, 200);
    });
  }

  async getByStudentId(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentGrades = this.grades.filter(g => g.studentId === parseInt(studentId));
        resolve(studentGrades);
      }, 200);
    });
  }

  async getBySubject(subject) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjectGrades = this.grades.filter(g => g.subject === subject);
        resolve(subjectGrades);
      }, 200);
    });
  }

  async create(gradeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.grades.map(g => g.Id)) + 1;
        const newGrade = {
          Id: newId,
          ...gradeData,
          date: new Date().toISOString().split('T')[0]
        };
        this.grades.push(newGrade);
        resolve({ ...newGrade });
      }, 400);
    });
  }

  async update(id, gradeData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.grades.findIndex(g => g.Id === parseInt(id));
        if (index !== -1) {
          this.grades[index] = { ...this.grades[index], ...gradeData };
          resolve({ ...this.grades[index] });
        } else {
          reject(new Error('Grade not found'));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.grades.findIndex(g => g.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.grades.splice(index, 1)[0];
          resolve(deleted);
        } else {
          reject(new Error('Grade not found'));
        }
      }, 300);
    });
  }

  async updateBulkGrades(gradesData, term) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedGrades = [];
        
        Object.entries(gradesData).forEach(([key, score]) => {
          const [studentId, subject] = key.split('-');
          const existingGrade = this.grades.find(
            g => g.studentId === parseInt(studentId) && g.subject === subject && g.term === term
          );
          
          if (existingGrade) {
            existingGrade.score = parseFloat(score);
            updatedGrades.push(existingGrade);
          } else {
            const newId = Math.max(...this.grades.map(g => g.Id)) + 1;
            const newGrade = {
              Id: newId,
              studentId: parseInt(studentId),
              subject,
              assessment: 'Test',
              score: parseFloat(score),
              maxScore: 100,
              weight: 1.0,
              term,
              date: new Date().toISOString().split('T')[0]
            };
            this.grades.push(newGrade);
            updatedGrades.push(newGrade);
          }
        });
        
        resolve(updatedGrades);
      }, 500);
    });
  }

  async getGradeDistribution() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const distribution = [
          { grade: 'A (90-100)', count: 15 },
          { grade: 'B (80-89)', count: 25 },
          { grade: 'C (70-79)', count: 20 },
          { grade: 'D (60-69)', count: 10 },
          { grade: 'F (0-59)', count: 5 }
        ];
        resolve(distribution);
      }, 200);
    });
  }

  async getSubjects() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art'];
        resolve(subjects);
      }, 200);
    });
  }
}

export default new GradeService();