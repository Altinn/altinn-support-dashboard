import { Alert, Button, Heading, Skeleton, Switch, Textfield } from "@digdir/designsystemet-react";
import { useAuthorizedPartiesForSystemUser } from "../hooks/hooks";
import { useAppStore } from "../stores/Appstore";
import { AuthorizedPartiesQueryParams, AuthorizedPartyExtended } from "../models/models";
import { useState } from "react";
import styles from "./styles/SystemUserPage.module.css";
import SystemUserCard from "../components/SystemUser/SystemUserCard";


export const SystemUserPage = () => {
    const environment = useAppStore((state) => state.environment);
    const [uuid, setUuid] = useState("");
    const [submittedUuid, setSubmittedUuid] = useState("");
    const [params, setParams] = useState<AuthorizedPartiesQueryParams>({
        includeAltinn2: false,
        includeAltinn3: true,
        includeRoles: true,
        includeAccessPackages: true,
        includeResources: true,
        includeInstances: false,
    });
    const [selectedParty, setSelectedParty] = useState<AuthorizedPartyExtended | null>(null);

    const { data, isLoading, error } = useAuthorizedPartiesForSystemUser(environment, submittedUuid, params);

    const handleToggle = (key: keyof AuthorizedPartiesQueryParams) => {
        setParams((prevParams) => ({
            ...prevParams,
            [key]: !prevParams[key],
        }));
    }

    return (
        <div>
            <Heading level={1} data-size="sm">
                Systembruker søk
            </Heading>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <Textfield
                        label="Systembruker UUID"
                        value={uuid}
                        onChange={(e) => setUuid(e.target.value)}
                    />
                    <div className={styles.switchGrid}>
                        <Switch
                            checked={params.includeAltinn2}
                            onChange={() => handleToggle("includeAltinn2")}
                            label="Inkluder Altinn 2"
                        />
                        <Switch
                            checked={params.includeAltinn3}
                            onChange={() => handleToggle("includeAltinn3")}
                            label="Inkluder Altinn 3"
                        />
                        <Switch
                            checked={params.includeRoles}
                            onChange={() => handleToggle("includeRoles")}
                            label="Inkluder roller"
                        />
                        <Switch
                            checked={params.includeAccessPackages}
                            onChange={() => handleToggle("includeAccessPackages")}
                            label="Inkluder tilgangspakker"
                        />
                        <Switch
                            checked={params.includeResources}
                            onChange={() => handleToggle("includeResources")}
                            label="Inkluder ressurser"
                        />
                        <Switch
                            checked={params.includeInstances}
                            onChange={() => handleToggle("includeInstances")}
                            label="Inkluder instanser"
                        />
                    </div>
                    <Button onClick={() => setSubmittedUuid(uuid)}>Søk</Button>
                </div>
                <div className={styles.responseContainer}>
                    <div className={styles.partyList}>
                        {isLoading && <Skeleton variant="rectangle" height={300} />}
                        {error && <Alert data-color="danger">{error.message}</Alert>}
                        {data?.length === 0 && <Alert data-color="info">Ingen resultater funnet</Alert>}
                        {data?.map((party) => (
                            <SystemUserCard
                                key={party.partyUuid}
                                party={party}
                                isSelected={selectedParty?.partyUuid === party.partyUuid}
                                onClick={() => setSelectedParty(party)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}