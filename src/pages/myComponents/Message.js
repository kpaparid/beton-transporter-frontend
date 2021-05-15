
import React, { useState } from 'react';
import { Card, Button } from '@themesberg/react-bootstrap';

export default (props) => {
    const { data, messageFromTable } = props;
    const { setVisible, setMessage } = data
    const title = messageFromTable.title;

    const [color, setColor] = useState("white");

    const handleOpenMessageClick = () => {
        setVisible(2)
        setMessage(messageFromTable);
    }
    const handleDeleteClick = () => {
        console.log("click delete");
    }
    const changeColor = () => {
        color === "white" ? setColor("aliceblue") : setColor("white");
    }

    return (
        <div className="d-flex" >
            <Card border="light" style={{ backgroundColor: color }} onMouseEnter={changeColor} onMouseLeave={changeColor} className="shadow-sm flex-fill">
                <Card.Body onClick={handleOpenMessageClick} className="py-1 d-flex">
                    <div className="d-flex flex-fill flex-wrap flex-lg-nowrap align-items-center justify-content-between w-100">
                        <div className="container-fluid p-0">
                            <span className="pe-3 flex-fill"
                                style={{
                                    display: "block",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >{title}</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <Button className="ms-1 my-2" variant="danger" onClick={handleDeleteClick} >x</Button>
        </div>
    )
};