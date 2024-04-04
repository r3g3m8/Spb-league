'use client'
import { useFormState, useFormStatus } from 'react-dom';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { join } from 'path'
import upload from './dbNews';
import axios from 'axios';
import Input from '@/components/Input';
import styles from './news.module.css'
//import { writeFile } from 'fs/promises';

type formType = {
  title?: string,
  content?: string,
  image?: File,
  date?: string
}

export default function ServerUploadPage() {
  function SubmitButton() {
    const { pending } = useFormStatus();
    async function handleClick(event: any): Promise<void> {
    }
  
  return (
    <input type="submit" aria-disabled={pending} className={styles.submit} value="Отправить"/>
  )
  }

  async function onSubmit(data: FormData) {
    console.log("Data: " + data)
    await upload(data);
  }

  return (
    <main className={styles.form}>
      <h1>Добавление новости</h1>
      <form action={onSubmit} >
        <Input
             label='Заголовок: ' 
             name="title" 
             required
        />
	   	  <input type="file" name="image" className={styles.input} accept="image/*"/>		
        <Input
          label="Дата: "
          name="date"
          type='date'
          pattern="\d{4}-\d{2}-\d{2}"
          required 
        />
        <Input
          label="Описание: "
          name="content"  
          required
        />
        <SubmitButton/>
      </form>
        
    </main>
  )
}
