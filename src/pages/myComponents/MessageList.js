import React from 'react';
import { Card, Button } from '@themesberg/react-bootstrap';
import Message from './Message';

export default (props) => {
    const data = props.data
    const { setVisible, clearData } = data
    const messages = props.table;

    const handleComposeClick = () => {
        clearData();
        setVisible(1);
    }
    return (
        <>
            <Card border="light" className="shadow-sm flex-fill my-2">
                <h3 className=" m-4 text-center">Versendete Nachrichten</h3>
                <div className="px-4">
                    <Button onClick={handleComposeClick}>Compose</Button>
                </div>

                <Card.Body>
                    {messages.map(m => <Message key={`message-${m.id}`} messageFromTable={m} data={data} />)}
                </Card.Body>
            </Card>
        </>
    );
};
