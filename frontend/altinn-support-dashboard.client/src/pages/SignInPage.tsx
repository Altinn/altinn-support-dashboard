import React from 'react';
import {
    Button
} from '@digdir/designsystemet-react';
import style from './styles/SignInPage.module.css';
import logo from '../assets/log-in-white.png'
import coloredLogo from "../assets/log-in-blue.png";
import { useAppStore } from "../stores/Appstore";


export const SignInPage: React.FC = () => {
    const isDarkMode = useAppStore((state) => state.isDarkMode)
    return (
        <div className={style.container}>
            <img 
            src={isDarkMode ? logo : coloredLogo} 
            alt="logo"
            className={style.logo}
            />

            <Button variant="primary"
            className = {style.ansattPortenButton}
            >
                Logg inn med AnsattPorten
            </Button>
            <Button variant="primary"
            className = {style.aidevButton}
            >
                Logg inn med AI-dev
            </Button>
        </div>
    )
}

export default SignInPage;