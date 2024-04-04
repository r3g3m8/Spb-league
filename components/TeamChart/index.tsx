import { BarElement, CategoryScale, Chart, LinearScale, PointElement } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

interface Team {
    id: number;
    name: string
    logo: string
    result: string;
    scored: number
    conceded: number
    points : number
    wins: number
    draws: number
    loses: number
    games: number
  }

  interface TeamChartProps {
    teams: Team[];
  }
  
  Chart.register(LinearScale);
  Chart.register(PointElement);
  Chart.register(CategoryScale);
  Chart.register(BarElement);
  
  const TeamChart: React.FC<TeamChartProps> = ({ teams }) => {
    // Извлекаем названия команд и количество очков
  const labels = teams.map(team => team.name);
  const points = teams.map(team => team.points);

  // Настройка данных для гистограммы
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Очки команд',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: points,
      },
    ],
  };

  // Настройка опций гистограммы
  const options = {
    scales: {
      y: {
        min: 0,
        max: 40,  // Минимальное значение на оси y
        ticks: {
            stepSize: 1 // Шаг для оси x
          }
      },
    },
  };

  const style = {
    width: '1000px',
    height: '800px'
  }

  return (
    <div style={style}>
      <h2>Гистограмма очков команд</h2>
      <Bar data={data} options={options} />
    </div>
  );
  };  

export default TeamChart;
