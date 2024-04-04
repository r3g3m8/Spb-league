'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styles from './standings.module.css'
import TeamChart from '@/components/TeamChart';

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

function StandingsPage() {
    const [standings, setStandings] = useState<Team[]>([]);
    const [sortBy, setSortBy] = useState<keyof Team | null>(null);
    const [sortDirection, setSortDirection] = useState('asc');

    let counter = 1;
    const loadResult = async () => {
        try {
          const response = await axios.get('/api/teams');
          setStandings(response.data);
        } catch (error) {
          console.error('Failed to load teams:', error);
        }
      };
    
      useEffect(() => {
        loadResult();
      }, []);

      const sortedStandings = [...standings].sort((a, b) => {
        if (!sortBy) return 0;
    
        const aValue = a[sortBy];
        const bValue = b[sortBy];
    
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      }); 
    
    function handleSort(param:  keyof Team): void {
        if (param === sortBy) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(param);
            setSortDirection('asc');
        }
    }

  return (
    <>
     <Header/>
       <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
          <tr>
                <th>Место</th>
                <th onClick={() => handleSort('name')}>Команда</th>
                <th onClick={() => handleSort('games')}>И</th>
                <th onClick={() => handleSort('wins')}>В</th>
                <th onClick={() => handleSort('draws')}>Н</th>
                <th onClick={() => handleSort('loses')}>П</th>
                <th onClick={() => handleSort('scored')}>Забито - пропущено</th>
                <th onClick={() => handleSort('points')}>Очки</th>
            </tr>
          </thead>
          <tbody>
          {sortedStandings && sortedStandings.map((team, id) => (
                <tr key={id}>
                    <td>{counter++}</td>
                    <td><img src={team.logo}></img>{team.name}</td>
                    <td>{team.games}</td>
                    <td>{team.wins}</td>
                    <td>{team.draws}</td>
                    <td>{team.loses}</td>
                    <td>{team.scored} - {team.conceded}</td>
                    <td>{team.points}</td>
                </tr>
            ))}
          </tbody>
        </table>
        </div>
        <TeamChart teams={sortedStandings}/>
     <Footer/>
    </>
  )
}

export default StandingsPage