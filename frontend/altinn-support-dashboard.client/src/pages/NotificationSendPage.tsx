import { useMemo, useState } from "react";
import { useSendTestEmail } from "../hooks/hooks";
import { useAppStore } from "../stores/Appstore";
import { NotificationSendResponse } from "../models/notificationSendModels";
import { Alert, Button, Heading, Paragraph } from "@digdir/designsystemet-react";
import { TestFlaskIcon } from "@navikt/aksel-icons";
import MessageInputField from "../components/Correspondence/MessageInputField";
import ResponseStatusCode from "../components/Correspondence/ResponseStatusCode";
import NotificationSendSummary from "../components/NotificationSend/NotificationSendSummary";
import CorrespondenceResponseField from "../components/Correspondence/CorrespondenceResponseField";
import classes from "./styles/CorrespondencePage.module.css";



const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_SUBJECT = "Varsel test Altinn";
const EMAIL_BODY = "Test varsel fra Altinn.\nDenne mailen kan ikke besvares.";
const RESPONSE_STORAGE_KEY = "notifSendResponse";

// A bad stored value must never stop the page from loading
const loadStoredResponse = (): NotificationSendResponse | undefined => {
    const item = sessionStorage.getItem(RESPONSE_STORAGE_KEY);
    if (!item) return undefined;

    try {
        const parsed = JSON.parse(item);
        // Valid JSON can still be an old or unexpected shape
        if (typeof parsed?.statusCode === "number"){
            return parsed;
        }
    } catch {
        // Malformed JSON, handled below
    }

    sessionStorage.removeItem(RESPONSE_STORAGE_KEY);
    return undefined;
};

export const NotificationSendPage = () => {
    const  post = useSendTestEmail();
    const environment = useAppStore((state) => state.environment);

    // The recipient's email is personal data, so it is never stored.
    const [emailAddress, setEmailAddress] = useState<string>("");

    const [response, setResponse] = useState<NotificationSendResponse | undefined>(loadStoredResponse);

    const emailError = useMemo(
        () =>
            emailAddress && !EMAIL_REGEX.test(emailAddress.trim())
                ? "Ugyldig e-postadresse"
                : undefined,
            [emailAddress]
    );

    const isDisabled = !emailAddress || !!emailError || post.isPending;

    // One key per intended send. Reused when trying after an error,
    // so Notifications doesn't send the same email twice
    const [idempotencyId, setIdempotencyId] = useState<string>(() => crypto.randomUUID());

    const handleSend = async () => {
        if(isDisabled) return;

        try {
            const result = await post.mutateAsync({
                environment,
                request: { emailAddress: emailAddress.trim(), idempotencyId},
            });
            setResponse(result);
            // requestBody contains the recipient's email – keep it in memory only
            sessionStorage.setItem(
                RESPONSE_STORAGE_KEY,
                JSON.stringify({ ...result, requestBody: "" })
            );

            // Sent: the next click is a new deliberate send
            if (result.result) {
                setIdempotencyId(crypto.randomUUID());
            }
        } catch {
            // Keep the key, so retrying returns the original order if it was accepted
        }
    };

    return (
        <div>
            <Heading className={classes.heading} level={1} data-size="sm">
                Send test e-post
                <TestFlaskIcon/>
            </Heading>

            <div className={classes.container}>
                <div className={classes.formContainer}>
                    <MessageInputField 
                        className={classes.messageField}
                        labelText="E-postadresse"
                        multiline={false}
                        value={emailAddress}
                        onChange={(value) => {
                            setEmailAddress(value);
                            setIdempotencyId(crypto.randomUUID());
                        }}
                    />
                    {emailError && <Alert data-color="danger">{emailError}</Alert>}
                    <div>
                        <Paragraph><strong>Meldings tittel:</strong></Paragraph>
                        <Paragraph>{EMAIL_SUBJECT}</Paragraph>

                        <Paragraph><strong>Meldingstekst:</strong></Paragraph>
                        <Paragraph style={{ whiteSpace: "pre-line" }}>{EMAIL_BODY}</Paragraph>
                    </div>

                    <Alert data-color="warning">
                        Du kommer til å sende denne mailen til en ekte mottaker hvis mailen eksisterer
                    </Alert>

                    <Button onClick={handleSend} disabled={isDisabled}>
                        Send e-post
                    </Button>
                </div>

                <div className={classes.responseContainer}>
                    {response && (
                        <div>
                            <ResponseStatusCode
                                statuscode={response.statusCode}
                            />
                            <NotificationSendSummary response={response} />
                            <CorrespondenceResponseField responseData={response} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};