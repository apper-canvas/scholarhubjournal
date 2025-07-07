import { useState } from 'react';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';

const DashboardCharts = ({ attendanceData, gradeData }) => {
  const [attendanceChartType, setAttendanceChartType] = useState('bar');
  const [gradeChartType, setGradeChartType] = useState('pie');

  // Attendance Chart Configuration
  const attendanceOptions = {
    chart: {
      type: attendanceChartType,
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#48BB78', '#F56565', '#F6AD55', '#4299E1'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: attendanceData.map(d => d.date),
      labels: { style: { fontSize: '12px' } }
    },
    yaxis: {
      labels: { style: { fontSize: '12px' } }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
    },
    grid: {
      borderColor: '#e7e7e7',
      row: { opacity: 0.5 }
    }
  };

  const attendanceSeries = [
    {
      name: 'Present',
      data: attendanceData.map(d => d.present)
    },
    {
      name: 'Absent',
      data: attendanceData.map(d => d.absent)
    },
    {
      name: 'Late',
      data: attendanceData.map(d => d.late)
    }
  ];

  // Grade Distribution Chart Configuration
  const gradeOptions = {
    chart: {
      type: gradeChartType,
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#48BB78', '#4299E1', '#F6AD55', '#F56565'],
    labels: gradeData.map(d => d.grade),
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%';
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    }
  };

  const gradeSeries = gradeData.map(d => d.count);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance Chart */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance Overview
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAttendanceChartType('bar')}
              className={`p-2 rounded-lg ${attendanceChartType === 'bar' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ApperIcon name="BarChart3" size={16} />
            </button>
            <button
              onClick={() => setAttendanceChartType('line')}
              className={`p-2 rounded-lg ${attendanceChartType === 'line' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ApperIcon name="TrendingUp" size={16} />
            </button>
          </div>
        </div>
        <Chart
          options={attendanceOptions}
          series={attendanceSeries}
          type={attendanceChartType}
          height={300}
        />
      </div>

      {/* Grade Distribution Chart */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Grade Distribution
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGradeChartType('pie')}
              className={`p-2 rounded-lg ${gradeChartType === 'pie' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ApperIcon name="PieChart" size={16} />
            </button>
            <button
              onClick={() => setGradeChartType('donut')}
              className={`p-2 rounded-lg ${gradeChartType === 'donut' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ApperIcon name="Circle" size={16} />
            </button>
          </div>
        </div>
        <Chart
          options={gradeOptions}
          series={gradeSeries}
          type={gradeChartType}
          height={300}
        />
      </div>
    </div>
  );
};

export default DashboardCharts;