import React, { useState, useEffect } from "react";
import classes from "./styles/SettingsVersionComponent.module.css";

import { FaSlack, FaBookOpen } from "react-icons/fa";
import {
  getVersionInfo,
  fetchVersionData,
  VersionData,
} from "./utils/versionUtils";
import { useAppStore } from "../../stores/Appstore";
import { Paragraph, Link } from "@digdir/designsystemet-react";

const SettingsVersionComponent: React.FC = () => {
  const { versionNumber, versionName, releaseDate } = getVersionInfo();
  const [versionInfo, setVersionInfo] = useState<VersionData | null>(null);

  const environment = useAppStore((state) => state.environment);

  useEffect(() => {
    const loadVersionInfo = async () => {
      const data = await fetchVersionData();
      setVersionInfo(data);
    };
    loadVersionInfo();
  }, []);

  return (
    <div>
      <Paragraph>
        Applikasjonsinformasjon: {versionName} - Versjon{" "}
        {versionInfo?.version || versionNumber}
      </Paragraph>
      <Paragraph>
        Utgivelsesdato:{" "}
        {versionInfo?.releaseDate || releaseDate || "Ikke tilgjengelig"}
      </Paragraph>
      <Paragraph>Valgt miljø: {environment}</Paragraph>
      <div>
        <Link className={classes.link} href="#">
          <FaBookOpen />
          Dokumentasjon
        </Link>
        <Link
          className={classes.link}
          href="https://digdir.slack.com/archives/C07AJ5NQE9E"
        >
          <FaSlack />
          Kontakt oss på Slack
        </Link>
      </div>
    </div>
  );
};

export default SettingsVersionComponent;
