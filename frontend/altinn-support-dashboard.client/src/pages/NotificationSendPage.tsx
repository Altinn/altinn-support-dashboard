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
const EMAIL_BODY = "Test varsel fra Altinn.\nDenne mailen kan ikke besvares."

export const NotificationSendPage = () => {
    const  post = useSendTestEmail();
    const environment = useAppStore((state) => state.environment);

    // The recipient's email is personal data, so it is never stored.
    const [emailAddress, setEmailAddress] = useState<string>("");

    const [response, setResponse] = useState<NotificationSendResponse | undefined>(
        () => {
            const item = sessionStorage.getItem("notifSendResponse");
            return item ? JSON.parse(item) :undefined;
        }
    );

    const emailError = useMemo(
        () =>
            emailAddress && !EMAIL_REGEX.test(emailAddress.trim())
                ? "Ugyldig e-postadresse"
                : undefined,
            [emailAddress]
    );

    const isDisabled = !emailAddress || !!emailError || post.isPending;

    const handleSend = async () => {
        if(isDisabled) return;

        try {
            const result = await post.mutateAsync({
                environment,
                request: { emailAddress: emailAddress.trim() },
            });
            setResponse(result);
            // requestBody contains the recipient's email – keep it in memory only
            sessionStorage.setItem(
                "notifSendResponse",
                JSON.stringify({ ...result, requestBody: "" })
            );
        } catch {
            // The hook's onError already shows a toast
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
                        labelText="E-mail address"
                        multiline={false}
                        value={emailAddress}
                        onChange={(value) => {
                            setEmailAddress(value);
                        }}
                    />
                    {emailError && <Alert data-color="danger">{emailError}</Alert>}
                    <div>
                        <Paragraph><strong>Subject:</strong></Paragraph>
                        <Paragraph>{EMAIL_SUBJECT}</Paragraph>

                        <Paragraph><strong>Body:</strong></Paragraph>
                        <Paragraph style={{ whiteSpace: "pre-line" }}>{EMAIL_BODY}</Paragraph>
                    </div>

                    <Alert data-color="warning">
                        Du kommer til å sende denne mailen til en ekte mottaker hvis mailen eksisterer
                    </Alert>

                    <Button onClick={handleSend} disabled={isDisabled}>
                        Send e-mail
                    </Button>
                </div>

                <div className={classes.responseContainer}>
                    {response && (
                        <div>
                            <ResponseStatusCode
                                statuscode={Number.parseInt(response.statusCode)}
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