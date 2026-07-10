import React, { useEffect, useState } from "react";
import { useSsnFromToken } from "../hooks/hooks";

interface SsnTextProps {
  contact: {
    ssnToken?: string;
    displayedSocialSecurityNumber?: string;
  };
  environment?: string;
}

const SsnText: React.FC<SsnTextProps> = ({ contact, environment }) => {
  const [isRedacted, setIsRedacted] = useState(true);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: unredactedSsn, refetch } = useSsnFromToken(
    environment || "",
    contact.ssnToken || ""
  );

  const handleClick = async () => {
    if (!unredactedSsn) {
      try {
        await refetch();
        setIsRedacted(false);
      } catch (error) {
        console.error("Error fetching unredacted SSN:", error);
      }
    } else {
      setIsRedacted(!isRedacted);
    }
  };

  useEffect(() => {
    if (!isRedacted && unredactedSsn) {
      timeoutRef.current = setTimeout(() => {
        setIsRedacted(true);
      }, 15000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRedacted, unredactedSsn]);

  return (
    <span
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      title={
        isRedacted ? "Vis fullt fødselsnummer" : "Skjul fullt fødselsnummer"
      }
    >
      {!isRedacted && unredactedSsn
        ? unredactedSsn
        : contact.displayedSocialSecurityNumber}
    </span>
  );
};

export default SsnText;
