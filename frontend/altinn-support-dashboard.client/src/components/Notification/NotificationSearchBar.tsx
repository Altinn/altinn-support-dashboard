import { useState } from "react";
import { Button, Search, Textfield } from '@digdir/designsystemet-react';
import style from './styles/NotificationSearchBar.module.css';

type NotificationSearchBarProps = {
    orderId: string;
    setOrderId: (value: string) => void;
}


const NotificationSearchBar: React.FC<NotificationSearchBarProps> = ({
    orderId,
    setOrderId,
}) => {
    const [inputValue, setInputValue] = useState(orderId ?? "");

    const handleSearch = () => {
        setOrderId(inputValue);
    }

    return (
        <div className={style.container}>
            <Textfield
                label="Order ID"
                placeholder="Skriv inn ordre-id"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
                className = {style.textfield}
            />
            <Button
                onClick={handleSearch}
                variant="secondary"
                className={style.searchButton}
            >
                <Search/>
            </Button>
            <Button
                onClick={() => {
                    setInputValue("")
                    setOrderId("")
                }}
                className={style.removeButton}
            >
                x
            </Button>
        </div>
    )
}

export default NotificationSearchBar;