import React from 'react';
import {
    Button,
    Heading
} from '@digdir/designsystemet-react';
import style from './styles/SignInPage.module.css';
import logo from '../assets/Logo-logIn.png'
import coloredLogo from "../assets/log-in-blue.png";
import { useAppStore } from "../stores/Appstore";


export const SignInPage: React.FC = () => {
    const isDarkMode = useAppStore((state) => state.isDarkMode)
    const toggleDarkMode = useAppStore((state) => state.setIsDarkMode)
    return (
        <div>
            <img 
            src={isDarkMode ? logo : coloredLogo} 
            alt="logo"/>
            <Heading>Internt dashboard</Heading>
            <Button variant="primary">
                Log inn med AnsattPorten
            </Button>
            <Button variant="primary">
                Logg inn med AI-dev
            </Button>

            <Button 
            onClick={() => toggleDarkMode(!isDarkMode)} 
            variant="secondary">Toggle Dark Mode</Button>
        </div>
    )
}

export default SignInPage;