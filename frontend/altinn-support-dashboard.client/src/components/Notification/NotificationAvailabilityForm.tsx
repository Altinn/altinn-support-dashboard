import React from "react";
import { Button, Label, Select, Textfield } from "@digdir/designsystemet-react";
import style from "./styles/NotificationAvailabilityForm.module.css";

const DEFAULT_ACTIONS = ["read", "write"];

type NotificationAvailabilityFormProps = {
  nin: string;
  setNin: (value: string) => void;
  orgNumber: string;
  setOrgNumber: (value: string) => void;
  resourceId: string;
  setResourceId: (value: string) => void;
  action: string;
  setAction: (value: string) => void;
  actionOptions: string[];
  isSubmitting: boolean;
  onSubmit: () => void;
};

const NotificationAvailabilityForm: React.FC<
  NotificationAvailabilityFormProps
> = ({
  nin,
  setNin,
  orgNumber,
  setOrgNumber,
  resourceId,
  setResourceId,
  action,
  setAction,
  actionOptions,
  isSubmitting,
  onSubmit,
}) => {
  const options = actionOptions.length > 0 ? actionOptions : DEFAULT_ACTIONS;
  const canSubmit = !!nin && !!orgNumber && !!resourceId && !!action;

  return (
    <div className={style.container}>
      <div className={style.row}>
        <Textfield
          label="Fødselsnummer"
          value={nin}
          onChange={(e) => setNin(e.target.value)}
          className={style.field}
        />
        <Textfield
          label="Organisasjonsnummer"
          value={orgNumber}
          onChange={(e) => setOrgNumber(e.target.value)}
          className={style.field}
        />
        <Textfield
          label="Ressurs-Id"
          value={resourceId}
          onChange={(e) => setResourceId(e.target.value)}
          className={style.field}
        />
        <div className={style.field}>
          <Label>Handling</Label>
          <Select
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            {options.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <Button
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className={style.submitButton}
      >
        Sjekk
      </Button>
    </div>
  );
};

export default NotificationAvailabilityForm;
