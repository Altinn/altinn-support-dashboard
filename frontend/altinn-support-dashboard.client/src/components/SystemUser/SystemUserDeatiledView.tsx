import { Card, Heading } from "@digdir/designsystemet-react";
import { useRoleDefinitions } from "../../hooks/hooks";
import { AuthorizedPartyExtended } from "../../models/models";
import { useAppStore } from "../../stores/Appstore";
import styles from "./style/SystemUserDetailedView.module.css";
import PolicySubjectCard from "../ResourceSearch/PolicySubjectCard";


interface SystemUserDetailedViewProps {
    party: AuthorizedPartyExtended | null;
}

const SystemUserDetailedView: React.FC<SystemUserDetailedViewProps> = ({
    party
}) => {
    const environment = useAppStore((state) => state.environment);
    const roleDefinitionsQuery = useRoleDefinitions(environment);

    const roleNameMap: Record<string, string> = {};
    for (const role of roleDefinitionsQuery.data ?? []) {
        roleNameMap[role.code.toLowerCase()] = role.name;
        if (role.legacyRoleCode) roleNameMap[role.legacyRoleCode.toLowerCase()] = role.name;
    }

    if (!party) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading className={styles.orgInformation}>
                    {party.organizationNumber && <span>Org Nr: {party.organizationNumber}</span>}
                    {party.personId && <span>Personnr: {party.personId}</span>}
                </Heading>
                <Heading className={styles.orgName}>{party.name}</Heading>
            </div>

            {party.authorizedRoles && party.authorizedRoles.length > 0 && (
                <Card data-color="neutral" className={styles.section}>
                    <Heading level={5} data-size="xs">Roller</Heading>
                    <div>
                        {party.authorizedRoles.map((code) => (
                            <PolicySubjectCard key={code} subject={roleNameMap[code.toLowerCase()] ?? code} actions={[]} />
                        ))}
                    </div>
                </Card>
            )}

            {party.authorizedResources && party.authorizedResources.length > 0 && (
                <Card data-color="neutral" className={styles.section}>
                    <Heading level={5} data-size="xs">Ressurser</Heading>
                    <div>
                        {party.authorizedResources.map((resource) => (
                            <PolicySubjectCard key={resource} subject={resource} actions={[]} />
                        ))}
                    </div>
                </Card>
            )}

            {party.authorizedAccessPackages && party.authorizedAccessPackages.length > 0 && (
                <Card data-color="neutral" className={styles.section}>
                    <Heading level={5} data-size="xs">Tilgangspakker</Heading>
                    <div>
                        {party.authorizedAccessPackages.map((accessPackage) => (
                            <PolicySubjectCard key={accessPackage} subject={accessPackage} actions={[]} />
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}

export default SystemUserDetailedView;