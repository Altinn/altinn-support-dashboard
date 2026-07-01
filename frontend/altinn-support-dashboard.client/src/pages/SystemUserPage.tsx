import { Button, Heading, Switch, Textfield } from "@digdir/designsystemet-react";
import { useAuthorizedPartiesForSystemUser } from "../hooks/hooks";
import { useAppStore } from "../stores/Appstore";
import { AuthorizedPartiesQueryParams } from "../models/models";
import { useState } from "react";



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
            <div>
                <div>
                    <Textfield
                        label="Systembruker UUID"
                        value={uuid}
                        onChange={(e) => setUuid(e.target.value)}
                    />
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
                    <Button onClick={() => setSubmittedUuid(uuid)}>Søk</Button>
                </div>
                <div>
                    {isLoading && <p>Laster...</p>}
                </div>
            </div>
        </div>
    )
}