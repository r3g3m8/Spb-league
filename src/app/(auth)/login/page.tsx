"use client"

import React, { useEffect, useState } from 'react'
import styles from './login.module.css'
import Input from '@/components/Input'
import Link from 'next/link';
import axios from 'axios';

function LoginPage() {
    const [form_data, set_form_data] = useState({
        login: "",
        password: "",
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
            .post(`${process.env.API_ADDRESS}/api/loginUser`, form_data)
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
                label="Пароль"
                name="password"
                type="password"
                onChange={handle_change}
                value={form_data.password}
            />
            <div className={styles.pass}>Забыли пароль?</div>
            <button className={styles.submit} type='button' onClick={sign_in}>Войти</button>
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

export default LoginPage