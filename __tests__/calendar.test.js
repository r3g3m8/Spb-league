import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import Calendar from '../src/app/calendar/page';
import StandingsPage from '../src/app/standings/page';
import Ticket from '@/components/Ticket';
import PlayerChart from '@/components/PlayerChart'
import NewsCard from '@/components/News'

describe('Calendar Page', () => {

  test('displays correct match information', () => {
    const match = {
      id: 1,
      homeTeam: {
        name: 'Зенит',
        logo: 'logo_zenit.svg.png',
      },
      awayTeam: {
        name: 'Краснодар',
        logo: 'logo_krasnodar.png',
      },
      result: '2 - 1',
      date: '2024-03-10',
      time: '15:00',
      tour: 5,
    };
  
    render(
      <Ticket
        home_team={match.homeTeam.name}
        away_team={match.awayTeam.name}
        result={match.result}
        homeLogo={match.homeTeam.logo}
        awayLogo={match.awayTeam.logo}
        date={match.date}
        time={match.time}
        tour={match.tour}
        admin={false}
      />
    );
  
    // Проверяем, что информация о матче правильно отображается
    expect(screen.getByText('Зенит 2 - 1 Краснодар')).toBeInTheDocument();
    expect(screen.getByText('2024-03-10')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
    expect(screen.getByText('Тур 5')).toBeInTheDocument();
  });

  const mockProps = {
    title: 'Test Title',
    desc: 'Test Description',
    img: 'image8.png',
    date: '2024-04-02'
  };

  it('renders news card with correct props', () => {
    render(<NewsCard {...mockProps} />);
    
    // Проверяем, что заголовок отображается с корректным текстом
    const titleElement = screen.getByText(/Test Title/i);
    expect(titleElement).toBeInTheDocument();

    // Проверяем, что описание отображается с корректным текстом
    const descElement = screen.getByText(/Test Description/i);
    expect(descElement).toBeInTheDocument();

    // Проверяем, что дата отображается с корректным текстом
    const dateElement = screen.getByText(/2024-04-02/i);
    expect(dateElement).toBeInTheDocument();

    // Проверяем, что изображение отображается с корректным alt-текстом
    const imgElement = screen.getByAltText(/news_img/i);
    expect(imgElement).toBeInTheDocument();
  });

describe('PlayerChart component', () => {
  test('Renders PlayerChart with provided players data', async () => {
    const players = [
      { id: 1, name: 'John', position: 'Forward', goals: 10, assists: 5 },
      { id: 2, name: 'Alice', position: 'Midfielder', goals: 8, assists: 7 },
      { id: 3, name: 'Bob', position: 'Defender', goals: 2, assists: 3 },
    ];

    render(<PlayerChart players={players} />);

    // Проверяем, что график отображается на странице
    const chartElement = screen.getByTestId('player-chart');
    expect(chartElement).toBeInTheDocument();
   
    const canvasElement = screen.getByRole('img');
    expect(canvasElement).toHaveAttribute('width', '300');
    expect(canvasElement).toHaveAttribute('height', '150');
  });
});


});
