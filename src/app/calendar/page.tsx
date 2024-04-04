'use client'

import Header from '@/components/Header';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Ticket from '@/components/Ticket';
import addIcon from '@/public/addIcon.svg';
import Image from 'next/image';
import Input from '@/components/Input';
import styles from './calendar.module.css'
import Footer from '@/components/Footer';
import { saveAs } from "file-saver";
import searchIcon from '@/public/search.svg';
import { AlignmentType, Document, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

interface Match {
    id: number;
    homeTeam: {
      name: string,
      logo: string,
    };
    awayTeam: {
      name: string,
      logo: string,
    };
    result: string;
    date: string;
    time: string;
    tour: number;
  }

  export default function Calendar() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [homeTeam, sethomeTeam] = useState('');
    const [awayTeam, setawayTeam] = useState('');
    const [result, setresult] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [tour, setTour] = useState<number>();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [auth, setAuth] = useState(false);
    const [token, setToken] = useState('');

    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [err, setErr] = useState<string[]>([])

    const [searchParams, setSearchParams] = useState({
      team: '',
      tour: '',
      date: ''
    });
    const [totalResults, setTotalResults] = useState<number>(0);

    const loadMatches = async () => {
      try {
        const response = await axios.get('/api/match');
        if(!response.data){
          return;
        }
        setMatches(response.data);
      } catch (error) {
        console.error('Failed to load matches:', error);
      }
    };
  
    useEffect(() => {
      const token = localStorage.getItem("jwt")
        if (token) {
            setToken(token);
            console.log(token);
            setAuth(true);
        }
      loadMatches();
    }, []); // Пустой массив зависимостей означает, что useEffect будет вызываться только после монтирования компонента
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/searchMatch', { params: searchParams });
          if(response.data.error){
            setErr(response.data.error)
            return;
          }

          setMatches(response.data.matches);
          setTotalResults(response.data.total);
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      };
  
      fetchData();
    }, [searchParams]);
  
    const handleAddMatch = async () => {
      try {
        const res = await axios.post('/api/match', { homeTeam, awayTeam, result, date, time, tour });
        if(res.data.error){
          setErr(res.data.error)
        }
        await loadMatches();

      } catch (error) {
        console.log('Failed to add match:', error);
      }
    };
  
    const handleUpdateMatch = async (id: number) => {
      try {
        const res = await axios.put('/api/match', { id, homeTeam, awayTeam, result, date, time, tour });
        if(res.data.error){
          setErr(res.data.error)
          return;
        }
        await loadMatches();
      } catch (error) {
        console.log('Failed to update match:', error);
      }
    };
  
    const handleDeleteMatch = async (id: number) => {
      try {
        const res = await axios.delete('/api/match', { data: { id } });

        if(res.data.error){
          setErr(res.data.error)
        }

        await loadMatches();
      } catch (error) {
        console.error('Failed to delete match:', error);
      }
    };

    const handleEditMatch = (match: Match) => {
      if(match.id == selectedMatch?.id){
        setShowEditForm(!showEditForm);
        setErr([])
        return;
      }
      if(showEditForm){
        setErr(["Форма для изменения уже открыта. Чтобы изменить другой матч закройте текущую форму."])
        return;
      }
      sethomeTeam(match.homeTeam.name)
      console.log(match.homeTeam.name)
      setawayTeam(match.awayTeam.name)
      setresult(match.result)
      setDate(match.date)
      setTime(match.time)
      setTour(match.tour)
      setShowEditForm(!showEditForm);
      setShowAddForm(false);
      setSelectedMatch(match);
      setErr([]);
    };


    function handleAddButton(): void {
      setShowEditForm(false);
      setShowAddForm(!showAddForm);
      sethomeTeam('')
      setawayTeam('')
      setresult('')
      setDate('')
      setTime('')
      setTour(undefined);
      setErr([])
    }

    // Функция для создания документа Word
    const createWordDocument = async (matches: any[]) => {
      const tableRows = await Promise.all(matches.map(async (match) => {
        const { homeTeam, awayTeam, result, date, time, tour } = match;
    
        const tourString = tour.toString();
        // Создание строки таблицы для каждого матча
        return new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({children: [
                      new TextRun({
                        text: homeTeam.name,
                        size: 22,
                      })
                    ], alignment: AlignmentType.CENTER}),
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: await fetchImageAsArrayBuffer(homeTeam.logo),
                          transformation: { width: 50, height: 70 },
                        }),
                      ], alignment: AlignmentType.CENTER
                    }),
                  ],
                }),
                
                new TableCell({
                  children: [new Paragraph({children: [
                    new TextRun({
                      text: result,
                      size: 22,
                    })
                  ], alignment: AlignmentType.CENTER})],
                }),
                new TableCell({
                  children: [
                    new Paragraph({children: [
                      new TextRun({
                        text: awayTeam.name,
                        size: 22,
                      })
                    ], alignment: AlignmentType.CENTER}),
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: await fetchImageAsArrayBuffer(awayTeam.logo),
                          transformation: { width: 50, height: 70 },
                        }),
                      ], alignment: AlignmentType.CENTER
                    }),
                  ],
                }),
                new TableCell({
                  children: [new Paragraph({children: [
                    new TextRun({
                      text: tourString,
                      size: 22,
                    })
                  ], alignment: AlignmentType.CENTER})],
                }),
                new TableCell({
                  children: [new Paragraph({children: [
                    new TextRun({
                      text: date,
                      size: 22,
                    })
                  ], alignment: AlignmentType.CENTER})],
                }),
                new TableCell({
                  children: [new Paragraph({children: [
                    new TextRun({
                      text: time,
                      size: 22,
                    })
                  ], alignment: AlignmentType.CENTER})],
                }),  
                ], 
              });
            }));

            const table = new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({children: [
                      new TextRun({
                        text: 'Хозяева',
                        bold: true,
                        size: 26,
                      })
                    ] , alignment: AlignmentType.CENTER})]  }),
                    new TableCell({ children: [new Paragraph({children: [
                      new TextRun({
                        text: 'Результат',
                        bold: true,
                        size: 26
                      })
                    ] , alignment: AlignmentType.CENTER})]}),
                    new TableCell({ children: [new Paragraph({children: [
                      new TextRun({
                        text: 'Гости',
                        bold: true,
                        size: 26
                      })
                    ] , alignment: AlignmentType.CENTER})] }),
                    new TableCell({ children: [new Paragraph({children: [
                      new TextRun({
                        text: 'Тур',
                        bold: true,
                        size: 26
                      })
                    ] , alignment: AlignmentType.CENTER})] }),
                    new TableCell({ children: [new Paragraph({children: [
                      new TextRun({
                        text: 'Дата',
                        bold: true,
                        size: 26
                      })
                    ] , alignment: AlignmentType.CENTER})] }),
                    new TableCell({ children: [new Paragraph({children: [
                      new TextRun({
                        text: 'Время',
                        bold: true,
                        size: 26
                      })
                    ] , alignment: AlignmentType.CENTER})] }),
                  ],
                }),
                ...tableRows,
              ],
            });
          // Добавление таблицы в документ
          const doc = new Document({sections: [
            {children: [table]
          }]})
              // Экспорт документа в формате Blob и сохранение файла
          const blob = await Packer.toBlob(doc);
          saveAs(blob, 'matches.docx');
      };
    
    // Функция для загрузки изображения как ArrayBuffer
    const fetchImageAsArrayBuffer = async (url: string) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    };

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
      const { name, value } = event.target;
      setSearchParams(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

    const handleTicket = async (matchId: number) => {
      console.log(auth);
      if(!auth){
        window.location.replace('/login')
      }
      try {
        console.log("Token is: " + token);
        const res = await axios.post('/api/ticket', { token, matchId });
        
        if(res.data.error){
          setErr(res.data.error)
        }

        if(res.data == '/login'){
          window.location.replace(res.data);
        }

        await loadMatches();
      } catch (error) {
        console.error('Failed to add ticket:', error);
      }
    }

  return (
    <div className={styles.page}>
      <Header/>
      <div className={styles.main}>
      <h1>Матчи</h1>
      <button className={styles.button} onClick={() => handleAddButton()}>
        Добавить матч
        <Image className={styles.icon} src={addIcon} width={40} alt='add' />
      </button>
      <button className={styles.button} onClick={() => setShowSearch(!showSearch)}>
        Найти матч
        <Image className={styles.icon} src={searchIcon} width={40} alt='search' />
      </button>
      {showSearch && <form>
        <Input
          name="team"
          placeholder="Название команды"
          value={searchParams.team}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="tour"
          placeholder="Тур"
          value={searchParams.tour}
          onChange={handleInputChange}
        />
        <Input
          type="date"
          name="date"
          placeholder="Дата"
          value={searchParams.date}
          onChange={handleInputChange}
        />
      </form>}
      
      {showAddForm &&(
         <div className={styles.matchForm}>
          <h2>Добавить матч</h2>
          {err && <div>{err.map((e) => (
            <p className={styles.error}>{e}</p>
          ))}</div>}
          <Input label='Тур' name='Tour' type="number" placeholder="№ тура" value={tour} onChange={(e) => setTour(e.target.value)} />
          <div className={styles.teams}>
            <Input label='Хозяева' name='Team 1' placeholder="Хозяева" value={homeTeam} onChange={(e) => sethomeTeam(e.target.value)} />
            <Input label='Счет' name='result' placeholder="Счет" value={result} onChange={(e) => setresult(e.target.value)} />
            <Input label='Гости' name='Team 2' placeholder="Гости" value={awayTeam} onChange={(e) => setawayTeam(e.target.value)} />
          </div>
          <Input label='Дата' name='Date' type="date" placeholder="Дата" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label='Время' name='Time' type="time" placeholder="Время" value={time} onChange={(e) => setTime(e.target.value)} />
          <button className={styles.button} onClick={() => setShowAddForm(false)}>Убрать форму</button>
          <button className={styles.submit} onClick={handleAddMatch}>Добавить</button>
        </div>
      )}

      {showEditForm && selectedMatch && (
          <div className={styles.matchForm}>
            <h2>Изменить матч</h2>
            {err && <p>{err.map((e) => (
            <p className={styles.error}>{e}</p>
            ))}</p>}
            <Input label='Тур' name='Tour' type="number" placeholder="№ тура" defaultValue={selectedMatch.tour} onChange={(e) => setTour(e.target.value)} />
            <div className={styles.teams}>
            <Input label='Хозяева' name='Team 1' placeholder="Хозяева" defaultValue={selectedMatch?.homeTeam.name} onChange={(e) => sethomeTeam(e.target.value)} />
            <Input label='Счет' name='result' placeholder="Счет" defaultValue={selectedMatch.result} onChange={(e) => setresult(e.target.value)} />
            <Input label='Гости' name='Team 2' placeholder="Гости" defaultValue={selectedMatch.awayTeam.name} onChange={(e) => setawayTeam(e.target.value)} />
            </div>
            <Input label='Дата' name='Date' type="date" placeholder="Дата" defaultValue={selectedMatch.date} onChange={(e) => setDate(e.target.value)} />
            <Input label='Время' name='Time' type="time" placeholder="Время" defaultValue={selectedMatch.time} onChange={(e) => setTime(e.target.value)} />
            <button className={styles.button} onClick={() => setShowEditForm(false)}>Убрать форму</button>
            <button className={styles.submit} onClick={() => handleUpdateMatch(selectedMatch.id)}>Изменить матч</button>
          </div>
      )}

      <ul>
        {matches && matches.sort((a, b) => a.tour - b.tour).map((match) => (
          <li key={match.id}>
            <Ticket
              home_team={match.homeTeam.name} 
              away_team={match.awayTeam.name}
              result={match.result || "vs"} 
              homeLogo={match.homeTeam.logo}
              awayLogo={match.awayTeam.logo}
              date={match.date}
              time={match.time}
              tour={match.tour}
              admin
              handlewDelForm={() => handleDeleteMatch(match.id)}
              handleEditMatch={() => handleEditMatch(match)}
              handleTicket={() => handleTicket(match.id)}
            /> 
          </li>
        ))}
        {totalResults && <p>Всего найдено: {totalResults}</p>}
      </ul>
      <button className={styles.button} onClick={() => createWordDocument(matches)}>Сгенерировать в word</button>
      </div>
      
      <Footer/>
    </div>
  )
}