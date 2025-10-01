import classes from "./styles/SettingsLanguageComponent.module.css";

import {
  Card,
  Heading,
  Select,
  SelectOption,
} from "@digdir/designsystemet-react";
import { useState } from "react";

const SettingsLanguageComponent: React.FC = () => {
  const [language, setLanguage] = useState<string>("nb");
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLanguage(event.target.value as string);
  };

  return (
    <Card className={classes.container}>
      <Heading level={6} className={classes.title}>
        Språkvalg
      </Heading>
      <Select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
      >
        <SelectOption value="nb">Norsk Bokmål</SelectOption>
      </Select>
    </Card>
  );
};

export default SettingsLanguageComponent;
