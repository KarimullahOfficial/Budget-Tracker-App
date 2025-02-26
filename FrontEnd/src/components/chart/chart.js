import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, startOfMonth, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';

// Register necessary components for the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function MonthlySmartChart({ incomes = [], expenses = [] }) {
  // Helper function to aggregate data by month
  const aggregateDataByMonth = (data) => {
    const monthlyData = {};

    if (!Array.isArray(data)) return monthlyData;

    data.forEach((item) => {
      const monthStart = startOfMonth(new Date(item.date)).toISOString(); // Group by month
      if (!monthlyData[monthStart]) {
        monthlyData[monthStart] = 0;
      }
      monthlyData[monthStart] += parseFloat(item.amount);
    });

    return monthlyData;
  };

  // Aggregate incomes and expenses by month
  const monthlyIncomes = aggregateDataByMonth(incomes);
  const monthlyExpenses = aggregateDataByMonth(expenses);

  // Generate labels for each month of the current year
  const currentYear = new Date().getFullYear();
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(currentYear, 0, 1)),
    end: endOfYear(new Date(currentYear, 11, 31)),
  });

  // Prepare data for the chart
  const labels = months.map((month) => format(month, 'MMM yyyy')); // Format as "Jan 2023", "Feb 2023", etc.
  const incomeData = months.map((month) => monthlyIncomes[month.toISOString()] || 0);
  const expenseData = months.map((month) => monthlyExpenses[month.toISOString()] || 0);

  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Light blue color for income
        borderColor: 'rgba(75, 192, 192, 1)', // Darker blue for income
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Light red color for expenses
        borderColor: 'rgba(255, 99, 132, 1)', // Darker red for expenses
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Income and Expenses',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (€)',
        },
        beginAtZero: true, // Start the y-axis at 0
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}

export default MonthlySmartChart;
