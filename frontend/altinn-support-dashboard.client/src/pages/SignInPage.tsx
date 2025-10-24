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
    const isDarkMode = useAppStore((state) => state.setIsDarkMode)
    return (
        <div>
            <img 
            src={isDarkMode ? coloredLogo : logo} 
            alt="logo"/>
            <Heading>Internt dashboard</Heading>
            <Button variant="primary">
                Log inn med AnsattPorten
            </Button>
            <Button variant="primary">
                Logg inn med AI-dev
            </Button>
        </div>
    )
}

export default SignInPage;