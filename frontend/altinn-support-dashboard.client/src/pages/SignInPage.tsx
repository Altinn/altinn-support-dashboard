import React, { useEffect } from "react";
import { Button } from "@digdir/designsystemet-react";
import style from "./styles/SignInPage.module.css";
import logo from "../assets/log-in-white.png";
import coloredLogo from "../assets/log-in-blue.png";
import { useAppStore } from "../stores/Appstore";
import cat from "../assets/fun/sleeping cat.gif";
import dog from "../assets/fun/sleeping dog.gif";
import {
  initiateAiDevSignIn,
  initiateSignIn,
  initiateSignOut,
} from "../utils/ansattportenApi";
import { useLocation } from "react-router-dom";
import { showPopup } from "../components/Popup";

export const SignInPage: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const location = useLocation();

  const selectedImage = React.useMemo(() => {
    const images = [cat, dog];
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  useEffect(() => {
    const errorParam = new URLSearchParams(location.search).get("error");
    console.log(errorParam);

    if (errorParam === "loginFailed") {
      showPopup("Innlogging feilet, prøv igjen", "error");
    }
  }, []);

  const handleSignInAnsattporten = () => {
    initiateSignIn("/dashboard");
  };
  const handleSignInAiDev = () => {
    initiateAiDevSignIn("/dashboard");
  };

  return (
    <div className={style.container}>
      <img
        src={isDarkMode ? logo : coloredLogo}
        alt="logo"
        className={style.logo}
      />

      <Button
        variant="primary"
        className={style.ansattPortenButton}
        onClick={handleSignInAnsattporten}
      >
        Logg inn med AnsattPorten
      </Button>
      <Button
        variant="primary"
        className={style.aidevButton}
        onClick={handleSignInAiDev}
      >
        Logg inn med AI-dev
      </Button>
      <div className={style.gifContainer}>
        <img src={selectedImage} alt="gif" className={style.catGif} />
      </div>
    </div>
  );
};

export default SignInPage;
