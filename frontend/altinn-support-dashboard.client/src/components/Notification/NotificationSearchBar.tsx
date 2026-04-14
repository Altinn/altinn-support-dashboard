import { useState } from "react";
import { Button, Search, Textfield } from '@digdir/designsystemet-react';

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
        <div>
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
            />
            <Button
                onClick={() => {
                    setInputValue("")
                    setOrderId("")
                }}
            >
                x
            </Button>
            <Button
                onClick={handleSearch}
                variant="tertiary"
            >
                <Search/>
            </Button>
        </div>
    )
}

export default NotificationSearchBar;