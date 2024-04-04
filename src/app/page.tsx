import Image from 'next/image'
import styles from './page.module.css'
import Header from '../../components/Header'
import logo from '@/public/spbLeagueLogoWhite.png'
import Ticket from '@/components/Ticket'
import getData from './getData'
import News from '@/components/News'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default async function Home() {
  const { getAllMatches, getTeamsById, getLatestNews } = getData();

  const data = await getAllMatches();
  const matches = data.length > 0 ? data.map(async (m) => {
    const teams = await getTeamsById(m);
    return <Ticket 
      home_team={teams.home_team?.name || ""}
      away_team={teams.away_team?.name || ""}
      date={m.date || ""}
      time={m.time || ""}
      tour={m.tour || 0}
      result={m.result || "vs"}
      homeLogo={teams.home_team?.logo}
      awayLogo={teams.away_team?.logo}
  />
  }) : <><h2>Ближайших матчей нет</h2></>

  const data1 = await getLatestNews();
  const news = data1.length > 0 ? data1.map((n) => {
    return <News 
      title={n.title || ""}
      desc={n.content || ""}
      img={n.image || ""}
      date={n.publish_date || ""}
  />
  }) : <></>

  return (
    <div className={styles.page}>
      <div className={styles.content}>
      <div className={styles.main}>
      <Header main/>
      <Image className={styles.logo} src={logo} alt='logo'></Image>
      <div className={styles.container}>
        <h1 className={styles.welcome}>Добро пожаловать!</h1>
        <div className={styles.row}>
          <Link href='/calendar'>Купить билет</Link>
          <Link href='/'>Смотреть матч</Link>  
        </div>
        </div>
    </div>
    
    <div className={styles.block}>
    <h1>Следующие матчи</h1>
      {matches}
    </div>
    
    <div className={styles.block1}>
      <h1>Новости</h1>
      <div className={styles.news}>
        {news}
      </div>
      <Link href="/news">Читать все новости</Link>
    </div>
      </div>
      
    <Footer/>
    </div>
  )
}

