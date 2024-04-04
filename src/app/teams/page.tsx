'use client'

import Header from '@/components/Header';
import Input from '@/components/Input';
import TeamCard from '@/components/TeamCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import addIcon from '@/public/addIcon.svg';
import Image from 'next/image';
import styles from './teams.module.css'

interface Team {
    id: number;
    stadium: {
        name?: string,
        city: string,
        address: string
    };
    name: string;
    logo: string;
  }

function Teams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [teamName, setTeamName] = useState('');
    const [teamLogo, setTeamLogo] = useState<File | null>(null);
    const [logoName, setLogoName] = useState('');
    const [stadium, setStadium] = useState('');
    // create a new FormData object and append the file to it
    const formData = new FormData();
  
    const fetchTeams = async () => {
        try {
          const response = await axios.get('/api/teams');
          setTeams(response.data);
          console.log(response.data)
        } catch (error) {
          console.error('Failed to fetch teams:', error);
        }
      };
    useEffect(() => {
      
        fetchTeams();
    }, []);
  
    const handleDeleteTeam = async (teamId: number) => {
      try {
        await axios.delete(`/api/teams/${teamId}`);
        setTeams(teams.filter((team) => team.id !== teamId));
      } catch (error) {
        console.error('Failed to delete team:', error);
      }
    };

    const handleAddTeam = async () => {
        try {
            let data = new FormData();
            
        if(!teamLogo){
            return;
        }
        
          await axios.post('/api/teams', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
              }
          });
          await fetchTeams(); // Обновляем список матчей после успешного добавления
        } catch (error) {
          console.error('Failed to add team:', error);
        }
      };
  
    function handleEditTeam(team: Team) {
        setSelectedTeam(team);
        setShowEditForm(true);
        setLogoName(team.logo)
    }

    const handleUpdateTeam = async (event: React.FormEvent) => {
      event.preventDefault();
  
      try {
        const formData = new FormData();
        formData.append('name', teamName);
        if (teamLogo) {
          formData.append('logo', teamLogo);
        }
        formData.append("stadium", stadium);
  
        await axios.put(`/api/teams/${selectedTeam?.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        fetchTeams();
  
        // Сбрасываем значения формы и состояния
        setTeamName('');
        setTeamLogo(null);
        setShowEditForm(false);
      } catch (error) {
        console.error('Failed to edit team:', error);
      }
    };

    function handleSetLogo(e: React.ChangeEvent<HTMLInputElement>): void {
        if (!e.target.files) {
            console.log("ther is no file")
            return;
          }
        //setTeamLogo(e.target.files[0]); //error
        const file = e.target.files[0];
        setTeamLogo(file)
    }

    return (
    <>
    <Header/>
      <div>
        <h1>Teams</h1>
  
        {/* Кнопка для добавления команды */}
        <Image src={addIcon} width={40} alt='add' onClick={() => setShowAddForm(true)}/>
        {/* Список команд */}
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              <TeamCard 
                name={team.name}
                img={team.logo}
                stadium={team.stadium}
                handlewDelForm={() => handleDeleteTeam(team.id)}
                handleEditForm={() => handleEditTeam(team)}
                admin
              />
            </li>
          ))}
        </ul>
  
        {/* Форма добавления команды */}
        {showAddForm && (
          <div>
            {/* Форма для добавления команды */}
            {/* Например: */}
            <input type="text" placeholder="Название команды" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            <input type="file" placeholder="Логотип" id='image' onChange={(e) => handleSetLogo(e)} accept="image/*"/>
            <input type="text" placeholder="Стадион" value={stadium} onChange={(e) => setStadium(e.target.value)} />
            <button onClick={() => setShowAddForm(false)}>Cancel</button>
            <button onClick={handleAddTeam}>Add Match</button>
          </div>
        )}

       {showEditForm && selectedTeam && (
        <div>
          {/* Форма для редактирования команды */}
          <form onSubmit={handleUpdateTeam}>
            <Input label='Название' name='Team 1' placeholder="Team 1" defaultValue={selectedTeam?.name} onChange={(e) => setTeamName(e.target.value)} />
            {selectedTeam.logo && (
              <img src={selectedTeam.logo} alt={selectedTeam.name} style={{ width: 100 }} />
            )}
            <div className={styles.fileUpload}>
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                onChange={(e) => handleSetLogo(e)}
                style={{ display: 'none' }}
              />
              <label htmlFor="fileInput" className={styles.fileLabel}>
                {logoName ? logoName : 'Выберите логотип'}
              </label>
            </div>
            {/* <input type="file" accept="image/*" defaultValue={selectedTeam.logo} onChange={(e) => handleSetLogo(e)} /> */}
            <Input label='Стадион' name='result' placeholder="result" defaultValue={selectedTeam.stadium.name} onChange={(e) => setStadium(e.target.value)} />
            <button type="submit">Save</button>
            <button onClick={() => setShowEditForm(false)}>Cancel</button>
          </form>
        </div>
      )}
      </div>
      </>
    );
}

export default Teams