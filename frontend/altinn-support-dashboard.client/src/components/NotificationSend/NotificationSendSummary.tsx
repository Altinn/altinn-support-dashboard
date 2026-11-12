import { Alert, Heading, Paragraph } from "@digdir/designsystemet-react";
import { NotificationSendResponse } from "../../models/notificationSendModels"

type NotificationSendSummaryProps = {
    response: NotificationSendResponse
};

const NotificationSendSummary: React.FC<NotificationSendSummaryProps> = ({
    response
}) => {
    const { result, problem } = response;

    if (result) {
        return(
            <Alert data-color="success">
                <Heading level={2} data-size="xs">
                    E-post bestilt
                </Heading>
                <Paragraph>
                    Ordre-ID: <code>{result.notificationOrderId}</code>
                </Paragraph>
                {result.notification && (
                    <>
                        <Paragraph>
                            Shipment-ID: <code>{result.notification.shipmentId}</code>
                        </Paragraph>
                        {result.notification.sendersReference && (
                            <Paragraph>
                                Senders refernce: {result.notification.sendersReference}
                            </Paragraph>
                        )}
                    </>
                )}
            </Alert>
        );
    }

    if (problem) {
        return (
            <Alert data-color="danger">
                <Heading level={2} data-size="xs">
                    {problem.title ?? "Bestilling feilet"}
                    {problem.status ? `(${problem.status})` : ""}
                </Heading>
                {problem.detail && <Paragraph>{problem.detail}</Paragraph>}
                {problem.errors && (
                    <ul>
                        {Object.entries(problem.errors).flatMap(([field, messages]) =>
                            messages.map((msg, i) => (
                                <li key={`${field}-${i}`}>
                                    <strong>{field}:</strong> {msg}
                                </li>
                            ))      
                        )}
                    </ul>
                )}
            </Alert>
        );
    }

    return null;
}

export  default NotificationSendSummary;