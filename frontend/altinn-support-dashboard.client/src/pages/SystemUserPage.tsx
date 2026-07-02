import { Alert, Button, Heading, Skeleton, Switch, Textfield } from "@digdir/designsystemet-react";
import { useAuthorizedPartiesForSystemUser } from "../hooks/hooks";
import { useAppStore } from "../stores/Appstore";
import { AuthorizedPartiesQueryParams } from "../models/models";
import { useState } from "react";
import styles from "./styles/SystemUserPage.module.css";
import SystemUserCard from "../components/SystemUser/SystemUserCard";
import SystemUserDetailedView from "../components/SystemUser/SystemUserDeatiledView";


export const SystemUserPage = () => {
    const environment = useAppStore((state) => state.environment);
    const systemUserUuid = useAppStore((state) => state.systemUserUuid);
    const systemUserParams = useAppStore((state) => state.systemUserParams);
    const systemUserSelectedPartyUuid = useAppStore((state) => state.systemUserSelectedPartyUuid);
    const setSystemUserUuid = useAppStore((state) => state.setSystemUserUuid);
    const setSystemUserParams = useAppStore((state) => state.setSystemUserParams);
    const setSystemUserSelectedPartyUuid = useAppStore((state) => state.setSystemUserSelectedPartyUuid);

    const [uuid, setUuid] = useState(systemUserUuid);

    const { data, isLoading, error } = useAuthorizedPartiesForSystemUser(environment, systemUserUuid, systemUserParams);

    const selectedParty = data?.find((p) => p.partyUuid === systemUserSelectedPartyUuid) ?? null;

    const handleToggle = (key: keyof AuthorizedPartiesQueryParams) => {
        setSystemUserParams({
            ...systemUserParams,
            [key]: !systemUserParams[key],
        });
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
                        onKeyDown={(e) => e.key === "Enter" && setSystemUserUuid(uuid)}
                    />
                    <div className={styles.switchGrid}>
                        <Switch
                            checked={systemUserParams.includeAltinn2}
                            onChange={() => handleToggle("includeAltinn2")}
                            label="Inkluder Altinn 2"
                        />
                        <Switch
                            checked={systemUserParams.includeAltinn3}
                            onChange={() => handleToggle("includeAltinn3")}
                            label="Inkluder Altinn 3"
                        />
                        <Switch
                            checked={systemUserParams.includeRoles}
                            onChange={() => handleToggle("includeRoles")}
                            label="Inkluder roller"
                        />
                        <Switch
                            checked={systemUserParams.includeAccessPackages}
                            onChange={() => handleToggle("includeAccessPackages")}
                            label="Inkluder tilgangspakker"
                        />
                        <Switch
                            checked={systemUserParams.includeResources}
                            onChange={() => handleToggle("includeResources")}
                            label="Inkluder ressurser"
                        />
                        <Switch
                            checked={systemUserParams.includeInstances}
                            onChange={() => handleToggle("includeInstances")}
                            label="Inkluder instanser"
                        />
                    </div>
                    <Button onClick={() => setSystemUserUuid(uuid)}>Søk</Button>
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
                                isSelected={systemUserSelectedPartyUuid === party.partyUuid}
                                onClick={() => setSystemUserSelectedPartyUuid(party.partyUuid)}
                            />
                        ))}
                    </div>

                    <div className={styles.partyDetails}>
                        <SystemUserDetailedView party={selectedParty} />
                    </div>
                </div>
            </div>
        </div>
    )
}
