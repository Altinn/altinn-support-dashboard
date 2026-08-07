import { Checkbox, Dropdown } from "@digdir/designsystemet-react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { useState } from "react";
import style from "./styles/NotificationFilterDropdown.module.css";



type NotificationFilterDropdownProps = {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
}

const NotificationFilterDropdown: React.FC<NotificationFilterDropdownProps> = ({
    label,
    options,
    selected,
    onToggle,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <Dropdown.TriggerContext>
            <Dropdown.Trigger>
                {label}
                {selected.length > 0 ? ` (${selected.length})` : ""}
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Dropdown.Trigger>
            <Dropdown
                data-size="sm"
                placement="bottom-start"
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                className={style.dropdown}
            >
                <Dropdown.List className={style.list}>
                    {options.map((option) => (
                        <Dropdown.Item key={option} className={style.item}>
                            <Checkbox
                                label={option}
                                checked={selected.includes(option)}
                                onChange={() => onToggle(option)}
                            />
                        </Dropdown.Item>
                    ))}
                </Dropdown.List>
            </Dropdown>
        </Dropdown.TriggerContext>
    );
}

export default NotificationFilterDropdown;