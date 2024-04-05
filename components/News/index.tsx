import React from 'react'
import styles from './index.module.css'
import Link from 'next/link'
import Image from 'next/image'

type props = {
    title: String,
    desc: String,
    img: string,
    date: String
}

function NewsCard(props: props) {
  const src = "/" + props.img;
  return (
      <div>
        <Link href="https://www.championat.com/football/article-4676353-gol-vratarya-v-futbole-video-zhasurbek-umrzakov-zabil-v-matche-uzbekistan-kndr-v-2016-godu-ban-chana-pek-ho.html" className={styles.each_news}>
            {props.img && <Image width={1000} height={1000} src={src} className={styles.img} alt="news_img"></Image>}
              <div className={styles.description_news}>
                <div className={styles.title_news}>{props.title}</div>
                <p>{props.desc}</p>
                <p>{props.date}</p>
              </div>
          </Link>
        </div>

  )
}

export default NewsCard