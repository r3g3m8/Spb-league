import React from 'react'
import styles from '@/components/Ticket/ticket.module.css'
import neva from '@/public/NEVAlogo.png'
import Image from 'next/image'
import delIcon from '@/public/trash_icon.svg'
import editIcon from '@/public/edit file_edited_editing_icon.svg'

type props = {
    handleEditMatch?: any;
    handlewDelForm?: any;
    home_team: String,
    away_team: String,
    homeLogo?: String,
    awayLogo?: String,
    date?: String,
    time?: String,
    tour?: number | Number,
    result?: String,
    stadium?: String,
    admin?: Boolean,
    inBucket?: Boolean,
    handleTicket?: any
}

function index(props: props) {
    const homeLogo = "/" + props.homeLogo;
    const awayLogo = "/" + props.awayLogo;
  return (
    <>
        <div className={styles.container}>
            <div className={styles.ticket}>
                <div className={styles.teams}>
                    <Image className={styles.logo} src={homeLogo} width={1000} height={1000} alt='br'/>
                    <p>{props.home_team} {props.result} {props.away_team}</p>
                    <Image className={styles.logo} src={awayLogo} width={1000} height={1000} alt='br'/>
                </div>
                <div className={styles.league}>Тур {props.tour?.toString()}</div>
                <div className={styles.day}>
                    <div className=''>{props.date}</div>
                    <div className={styles.time}>{props.time}</div>
                </div>
                <div>
                    {props.stadium}
                </div>
                   { props.admin &&
                    <>
                    <Image className={styles.img} data-testid='edit-button' src={editIcon} width={40} alt='edit' onClick={(m) => props.handleEditMatch(m)}/>
                    <Image className={styles.img} src={delIcon} width={40} alt='delete' onClick={(d) => props.handlewDelForm(d)}/>
                    </> }
                <div className={styles.actions}>
                    { (!props.inBucket) ? (props.result == "vs") ? 
                    <button onClick={props.handleTicket} className={styles.buy}>Купить билет</button>
                    : <button className={styles.played}>Матч уже сыгран</button> : <button className={styles.buy}>Хорошего просмотра</button>}
                    
                </div>
            </div>
        </div>
    </>
  )
}

export default index