import { useMemo, useState } from "react";
import { useSendTestEmail } from "../hooks/hooks";
import { useAppStore } from "../stores/Appstore";
import { getLocalStorageValue, setLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils";
import { NotificationSendResponse } from "../models/notificationSendModels";
import { Alert, Button, Heading } from "@digdir/designsystemet-react";
import { TestFlaskIcon } from "@navikt/aksel-icons";
import MessageInputField from "../components/Correspondence/MessageInputField";
import ResponseStatusCode from "../components/Correspondence/ResponseStatusCode";
import NotificationSendSummary from "../components/NotificationSend/NotificationSendSummary";
import CorrespondenceResponseField from "../components/Correspondence/CorrespondenceResponseField";
import classes from "./styles/CorrespondencePage.module.css";

 




const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NotificationSendPage = () => {
    const  post = useSendTestEmail();
    const environment = useAppStore((state) => state.environment);

    const [emailAddress, setEmailAddress] = useState<string>(
        getLocalStorageValue("notifSendEmail")
    );
    const [subject, setSubject] = useState<string>(
        getLocalStorageValue("notifSendSubject")
    );
    const[body,setBody] = useState<string>(
        getLocalStorageValue("notifSendBody")
    );
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

        const result = await post.mutateAsync({
            environment,
            request: {
                emailAddress: emailAddress.trim(),
                subject,
                body,
            },
        });
        setResponse(result);
        sessionStorage.setItem("notifSendResponse", JSON.stringify(result));
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
                            setLocalStorageValue("notifSendEmail", value);
                        }}
                    />
                    {emailError && <Alert data-color="danger">{emailError}</Alert>}

                    <MessageInputField
                        className={classes.messageField}
                        labelText="Subject"
                        multiline={false}
                        value={subject}
                        onChange={(value) => {
                            setSubject(value);
                            setLocalStorageValue("notifSendSubject", value);
                        }}
                    />
                    <MessageInputField 
                        className={classes.messageField}
                        labelText="Body"
                        value={body}
                        onChange={(value) => {
                            setBody(value)
                            setLocalStorageValue("notifSendBody", value)
                        }}
                    />

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