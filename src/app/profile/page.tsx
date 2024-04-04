'use client'

import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import styles from './profile.module.css'
import axios from 'axios'
import Footer from '@/components/Footer'
import Ticket from '@/components/Ticket'

interface Profile {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
}

interface TicketInterf {
  id: number;
  match: {
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
}

function Profile() {
    const [profile, setProfile] = useState<Profile>();
    const [ticket, setTicket] = useState<TicketInterf[]>([]);  

    const loadProfile = async () => {
        try {
          const token = localStorage.getItem("jwt");
          console.log("Token is: " + token)
          if (token) {
              console.log(token)
              //window.location.replace("/");
          }
          const resUser = await axios.get(`${process.env.API_ADDRESS}/api/profile/?token=${token}`)
          
          setProfile(resUser.data);

          } catch (error) {
            console.error('Failed:', error);
          }
    };

    const loadTickets = async () =>  {
      try {
        if(profile?.id == undefined){
          return;
        }
        const resTickets = await axios.get(`${process.env.API_ADDRESS}/api/ticket/?userId=${profile?.id}`)
          if(!resTickets.data){
            console.error("tickets not found")
          }
        console.log(JSON.stringify(resTickets.data));
        setTicket(resTickets.data);
        
        const resMatch = await axios.get(`${process.env.API_ADDRESS}/api/match`)
        if(!resMatch.data)
            console.error("tickets not found")
        
      } catch (error) {
        console.error('Failed:', error);
      }
    }

    const tickets = ticket.length > 0 ? ticket.map((t) => {
      return <div key={t.id}>
        <Ticket
        home_team={t.match.homeTeam.name} 
        away_team={t.match.awayTeam.name}
        result={t.match.result || "vs"} 
        homeLogo={t.match.homeTeam.logo}
        awayLogo={t.match.awayTeam.logo}
        date={t.match.date}
        time={t.match.time}
        tour={t.match.tour}
        inBucket
    /> 
        </div>
    }) : <><p>haha</p></>
    
    useEffect(() => {
      loadProfile();
    }, []); // Пустой массив зависимостей означает, что useEffect будет вызываться только после монтирования компонента
  
    useEffect(() => {
      loadTickets();
    }, [profile]);

    return (
    <>
        <Header/>
        <div className={styles.profile}>
              { profile && (
                <div>
                  <h1>Привет, {profile.name} {profile.surname}</h1>
                </div>
              )}
            <div>
              <h2>Купленные билеты: </h2>
              { tickets }
            </div>
            
        </div>
        <Footer/>
    </>
    )
}

export default Profile


