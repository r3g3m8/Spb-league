import React from 'react'
import styles from './index.module.css'
import Link from 'next/link'
import Image from 'next/image'
import delIcon from '@/public/trash_icon.svg'
import editIcon from '@/public/edit file_edited_editing_icon.svg'

type props = {
    admin?: Boolean,
    name: String,
    img: string,
    stadium: {
      name?: string,
      city: string,
      address: string
    },
    handleEditForm?: any;
    handlewDelForm?: any;
}

function TeamCard(props: props) {
  const src = "/" + props.img;
  return (
      <div className={styles.card}>
          <div className={styles.title}>
            {props.img && <Image width={1000} height={1000} src={src} className={styles.img} alt="hh"></Image>}
            <h3>{props.name} </h3>
          </div>
          <div className={styles.desc}>
          <p>Стадион {props.stadium.name}: {props.stadium.city}, {props.stadium.address}</p>
          </div>
          { props.admin &&
              <>
              <Image src={editIcon} width={40} alt='edit' onClick={(m) => props.handleEditForm(m)}/>
              <Image src={delIcon} width={40} alt='delete' onClick={(d) => props.handlewDelForm(d)}/>
              </>
            }
    </div>

  )
}

export default TeamCard