import React, { useState, useEffect } from "react";

import { Typography, Link, Box } from "@mui/material";
import { FaSlack, FaBookOpen } from "react-icons/fa";
import {
  getVersionInfo,
  fetchVersionData,
  VersionData,
} from "./utils/versionUtils";
import { useAppStore } from "../../stores/Appstore";

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
    <Box sx={{ mt: 5 }}>
      <Typography variant="body2" gutterBottom>
        Applikasjonsinformasjon: {versionName} - Versjon{" "}
        {versionInfo?.version || versionNumber}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Utgivelsesdato:{" "}
        {versionInfo?.releaseDate || releaseDate || "Ikke tilgjengelig"}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Valgt miljø: {environment}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Link href="#" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <FaBookOpen style={{ marginRight: "8px" }} />
          Dokumentasjon
        </Link>
        <Link
          href="https://digdir.slack.com/archives/C07AJ5NQE9E"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <FaSlack style={{ marginRight: "8px" }} />
          Kontakt oss på Slack
        </Link>
      </Box>
    </Box>
  );
};

export default SettingsVersionComponent;
