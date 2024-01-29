"use client"

import React, { useEffect, useState } from 'react'
import styles from './header.module.css';
import Link from 'next/link';
import Image from 'next/image';

type props = {
    children: React.ReactNode;
}

function Header() {
    const [ is_logged_in, set_is_logged_in ] = useState(false);

    useEffect(() => {
        if(localStorage.getItem("jwt")) {
            set_is_logged_in(!is_logged_in)
        }
    },[])

  return (
    <>
        <header className={styles.header}>
            <Link href="/">
                <div className={styles.flex}>
                    <Image src='/spbLeagueLogo.png' alt='logo' width={80} height={60}/>
                    <h3>Лига Санкт-Петербурга</h3>
                </div>
            </Link>
            {!is_logged_in ? <Link href="/login">
                <p>Войти</p>
            </Link> : <Image src='/football-player.png' alt='profile' width={40} height={40}></Image>}
            
        </header>
    </>
  )
}

export default Header