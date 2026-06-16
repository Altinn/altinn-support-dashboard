import { Card, Heading, Spinner } from "@digdir/designsystemet-react";
import { useAppStore } from "../../stores/Appstore";
import { useResourceDetails } from "../../hooks/hooks";
import { ResourceSearchResult } from "../../models/resourceModels";
import styles from "./styles/ResourceSearchDetailedView.module.css";
import PolicySubjectCard from "./PolicySubjectCard";

interface ResourceSearchDetailedViewProps {
    selectedResource: ResourceSearchResult | null;
}

const ResourceSearchDetailedView: React.FC<ResourceSearchDetailedViewProps> = ({
    selectedResource,
}) => {
    const environment = useAppStore((state) => state.environment);
    const { resourceQuery, policyRulesQuery } = useResourceDetails(
        environment,
        selectedResource?.identifier,
    );

    if (!selectedResource) return null;

    const resource = resourceQuery.data;
    const title = resource?.title?.nb ?? resource?.title?.nn ?? resource?.title?.en ?? selectedResource.identifier;

    const groupedRoleRules = (policyRulesQuery.data ?? [])
        .filter((rule) => rule.subject?.some((s) => s.type === "urn:altinn:rolecode"))
        .reduce<Record<string, Set<string>>>((acc, rule) => {
            const subject = rule.subject?.map((s) => s.value).join(", ") ?? "—";
            const action = rule.action?.value ?? "—";
            if (!acc[subject]) acc[subject] = new Set<string>();
            acc[subject].add(action);
            return acc;
        }, {});

    const groupedPackageRules = (policyRulesQuery.data ?? [])
        .filter((rule) => rule.subject?.some((s) => s.type === "urn:altinn:accesspackage"))
        .reduce<Record<string, Set<string>>>((acc, rule) => {
            const subject = rule.subject?.map((s) => s.value).join(", ") ?? "—";
            const action = rule.action?.value ?? "—";
            if (!acc[subject]) acc[subject] = new Set<string>();
            acc[subject].add(action);
            return acc;
        }, {});

    return (
        <div className={styles.container}>
            <Heading level={2} data-size="sm" className={styles.title}>
                {title}
            </Heading>

            {resourceQuery.isLoading ? (
                <Spinner aria-label="Laster..." />
            ) : resource ? (
                <>
                    <Card data-color="neutral" className={styles.propertiesCard}>
                        <Heading level={4} data-size="sm">Egenskaper</Heading>
                        <dl className={styles.definitionList}>
                            <dt>Delegerbar</dt><dd>{resource.delegable ? "Ja" : "Nei"}</dd>
                            <dt>Synlig</dt><dd>{resource.visible ? "Ja" : "Nei"}</dd>
                            <dt>Tilgangsliste-modus</dt><dd>{resource.accessListMode ?? "—"}</dd>
                            <dt>Selvidentifisert bruker</dt><dd>{resource.selfIdentifiedUserEnabled ? "Ja" : "Nei"}</dd>
                            <dt>Virksomhetsbruker</dt><dd>{resource.enterpriseUserEnabled ? "Ja" : "Nei"}</dd>
                            <dt>Engangssamtykke</dt><dd>{resource.isOneTimeConsent ? "Ja" : "Nei"}</dd>
                            <dt>Versjon</dt><dd>{resource.versionId ?? "—"}</dd>
                        </dl>
                    </Card>

                    {(resource.resourceReferances ?? []).length > 0 && (
                        <section className={styles.section}>
                            <Heading level={4} data-size="xs">Referanser</Heading>
                            <table className={styles.table}>
                                <thead>
                                    <tr><th>Kilde</th><th>Type</th><th>Referanse</th></tr>
                                </thead>
                                <tbody>
                                    {resource.resourceReferances!.map((ref, i) => (
                                        <tr key={i}>
                                            <td>{ref.referenceSource ?? "—"}</td>
                                            <td>{ref.referenceType ?? "—"}</td>
                                            <td>{ref.reference ?? "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </>
            ) : null}

            {policyRulesQuery.isLoading ? (
                <Spinner aria-label="Laster..." />
            ) : (
                <>
                    <section className={styles.section}>
                        <Heading level={4} data-size="xs">Tilgangspakker</Heading>
                        {Object.entries(groupedPackageRules).length === 0 ? (
                            <p>Ingen tilgangspakker</p>
                        ) : (
                            Object.entries(groupedPackageRules).map(([subject, actions]) => (
                                <PolicySubjectCard key={subject} subject={subject} actions={[...actions]} />
                            ))
                        )}
                    </section>

                    <section className={styles.section}>
                        <Heading level={4} data-size="xs">Roller</Heading>
                        {Object.entries(groupedRoleRules).length === 0 ? (
                            <p>Ingen roller</p>
                        ) : (
                            Object.entries(groupedRoleRules).map(([subject, actions]) => (
                                <PolicySubjectCard key={subject} subject={subject} actions={[...actions]} />
                            ))
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default ResourceSearchDetailedView;