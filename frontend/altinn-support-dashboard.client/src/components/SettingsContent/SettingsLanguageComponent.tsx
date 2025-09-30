import classes from "./styles/SettingsLanguageComponent.module.css";

import { Card, Select, SelectOption } from "@digdir/designsystemet-react";
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
      <h3 className={classes.title}>Språkvalg</h3>
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
