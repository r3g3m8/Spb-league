import React, { useEffect, useState } from 'react'
import styles from './footer.module.css';
import Image from 'next/image';

function Header() {

  return (
    <>
        <footer className={styles.main}>
            <Image src={'/spbLeagueLogoWhite.png'} alt='logo' width={90} height={70}/>
            <div className={styles.address}>
                <p>Просп. Энгельса 23</p>
                <p>+7900-000-00-00</p>
            </div>
        </footer>
    </>
  )
}

export default Header