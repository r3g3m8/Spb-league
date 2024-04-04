"use client"

import React, { useEffect, useState } from 'react'
import styles from './header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import jwt from 'jsonwebtoken';
import axios from 'axios';

type props = {
    main?: boolean
}

function Header(props: props) {
    const [ is_logged_in, set_is_logged_in ] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        //console.log("Token is: " + token);
        axios.get(`${process.env.API_ADDRESS}/api/loginUser/?token=${token}`)
        .then((res) => {
            if(!res.data){
                console.log(res.data)
            }
            set_is_logged_in(!is_logged_in)
        })
        .catch((error) => {
            //console.log("Errrrr:" + error)
        });
    }, []);

  return (
    <>
        <header className={props.main ? styles.mainHeader : styles.header}>
            <Link href="/">
                <div className={styles.flex}>
                    <Image src={props.main ? '/spbLeagueLogoWhite.png' : '/spbLeagueLogo.png'} alt='logo' width={80} height={60}/>
                    <h3>Лига Санкт-Петербурга</h3>
                </div>
            </Link>
            <Link href="/news">Новости</Link>
            <Link href="/calendar">Календарь</Link>
            <Link href="/standings">Турнирная таблица</Link>
            <Link href="/statistics">Статистика</Link>
            {!is_logged_in ? <Link href="/login">
                <p>Вход</p>
            </Link> : <Link href='/profile'><Image src='/football-player.png' alt='profile' width={40} height={40}></Image></Link> }
            
        </header>
    </>
  )
}

export default Header