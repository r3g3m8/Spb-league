"use client"

import React, { useEffect, useState } from 'react'
import styles from '../login/login.module.css'
import Input from '@/components/Input'
import Link from 'next/link';
import axios from 'axios';
import jwt from 'jsonwebtoken'

function RegiterPage() {
    const [form_data, set_form_data] = useState({
        login: "",
        password: "",
        name: "",
        surname: ""
    })

    useEffect(() => {
        if (localStorage.getItem("jwt")) {
            //window.location.replace("/");
        }
    }, []);

    function handle_change(event: any) {
        const { name, value } = event.target;
        set_form_data(prev_form_data => {
            return {
                ...prev_form_data,
                [name]: value,
            };
        });
    }
    
    function sign_in(){
        //let a = jwt.sign({ data: form_data.login}, `${process.env.NEXTAUTH_SECRET}`,{ expiresIn: '1h' });
        axios
            .post(`${process.env.API_ADDRESS}/api/registerUser`, form_data)
            .then((res) => {
                if(!res.data){
                    console.log(res.data)
                }
                localStorage.setItem("jwt", res.data.token);
                console.log(JSON.stringify(res.data));
                window.location.replace("/");
            })
            .catch((error) => {
                console.log("Errrrr:" + error.response.data)
            });
    }


    return (
        <div className={styles.center}>
        <h1>Вход</h1>
            <div className={styles.form}>
            <Input
                    label="Логин (email)"
                    name="login"
                    type="email"
                    onChange={handle_change}
                    value={form_data.login}
                />
                <Input
                    label="Имя"
                    name="name"
                    onChange={handle_change}
                    value={form_data.name}
                />
                <Input
                    label="Фамилия"
                    name="surname"
                    onChange={handle_change}
                    value={form_data.surname}
                />
                <Input
                    label="Пароль"
                    name="password" 
                    type='password'
                    onChange={handle_change}
                    value={form_data.password}
                />
                <Input
                    label="Подтверждение пароля"
                    type='password'
                    name="confirmPassword"
                />
                <div className={styles.pass}>Забыли пароль?</div>
                <button 
                    className={styles.submit} 
                    type='submit'
                    onClick={sign_in}>
                    Регистрация
                </button>
                <div className={styles.signup_link}>
                    <p>Ещё нет аккаунта?</p>
                    <Link href="/register">
                        <p>Зарегестрируйтесь</p>
                    </Link>
                </div>
            </div>
        </div>
      )
}

export default RegiterPage