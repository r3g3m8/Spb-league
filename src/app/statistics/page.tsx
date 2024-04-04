'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import PlayerChart from '@/components/PlayerChart'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface Player {
    id: number;
    name: string;
    surname?: string;
    position: string;
    number?: number;
    goals?: number;
    assists?: number;
  }

function StatPage() {
    const [players, setPlayers] = useState<Player[]>([]);

    const loadResult = async () => {
        try {
          const response = await axios.get('/api/players');
          setPlayers(response.data);
        } catch (error) {
          console.error('Failed to load teams:', error);
        }
      };

    useEffect(() => {
        // Загрузка данных об игроках из API при монтировании компонента
        loadResult();
        console.log(players[0])
      }, []);

      
    
    return (
        <>
          <Header/>
          <h1>Статистика игроков</h1>
          <div>
              <PlayerChart players={players} />
          </div>
          <Footer/>
        </>
        
    )
}

export default StatPage