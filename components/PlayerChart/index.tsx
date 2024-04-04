// PlayerChart.tsx
import { Chart, LinearScale, PointElement } from 'chart.js';
import React from 'react';
import { Bubble } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface Player {
  id: number;
  name: string;
  surname?: string;
  position: string;
  number?: number;
  goals?: number;
  assists?: number;
}

interface PlayerChartProps {
  players: Player[];
}

Chart.register(LinearScale);
Chart.register(PointElement)
Chart.register(ChartDataLabels)

const PlayerChart: React.FC<PlayerChartProps> = ({ players }) => {
  const data = {
    labels: players.map(player => player.name),
    datasets: [{
      label: 'Статистика игроков',
      data: players.map(player => ({
        x: player.assists || 0,
        y: player.goals || 0,
        r: 10 // Размер точек
      })),
      backgroundColor: '#FF6384', // Цвет точек
      hoverBackgroundColor: '#36A2EB', // Цвет при наведении
    }]
  };

  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Голы' // Название оси y
        },
        min: 0,
        max: 20,  // Минимальное значение на оси y
        ticks: {
            stepSize: 1 // Шаг для оси x
          }
      },
      x: {
        title: {
          display: true,
          text: 'Ассисты' // Название оси x
        },
        min: 0,
        max: 15, // Минимальное значение на оси x
        ticks: {
            stepSize: 1 // Шаг для оси x
          }
      }
    },
    plugins: {
        datalabels: {
          color: '#4RFF5E',
          offsetY: 10,
           // Цвет текста
          formatter: (value: any, context: any) => {
            const player = players[context.dataIndex];
            return `${player.name} ${player.surname || ''}`; // Форматируем текст метки
          }
        }
      }
  };

  const style = {
    width: '1000px',
    height: '800px'
  }

  return (
    <div style={style} data-testid="player-chart">
      <Bubble data={data} plugins={[ChartDataLabels]} options={options}  />
    </div>
  );
};

export default PlayerChart;
