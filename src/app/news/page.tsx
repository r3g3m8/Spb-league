import React from 'react'
import getData from '../getData';
import NewsCard from '@/components/News'
import AddNews from './addNews'
import styles from './news.module.css'
import Header from '@/components/Header';
import { generateWordDocument } from './generateWord';
import Footer from '@/components/Footer';

export default async function News() {
    const { getAllNews } = getData();
    const data1 = await getAllNews();
    const news = data1.length > 0 ? data1.map((n) => {
      return <NewsCard 
        title={n.title || ""}
        desc={n.content || ""}
        img={n.image || ""}
        date={n.publish_date || ""}
    />
    }) : <></>

  return (
    <>
    <Header/>
    <div className={styles.block}>
    <h1>Новости</h1>
    <div className={styles.blockNews}>
      {news}
    </div>
    <AddNews/>
    </div>
    <Footer/>
    </>
    
  )
}