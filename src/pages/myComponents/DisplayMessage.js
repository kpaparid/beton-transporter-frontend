import React from 'react';
import { Form, Card, Button } from '@themesberg/react-bootstrap';

export default (props) => {
    const clearData = props.data.clearData;
    const { from, to, title, date, mail } = props.data.message;

    return (
        <>
            <Card border="light" className="shadow-sm flex-fill my-2 d-flex">
                <div className="px-4 d-flex flex-fill flex-wrap flex-lg-nowrap align-items-center justify-content-center w-100">
                    <h3 className="m-4 ms-6  text-center container-fluid">{title}</h3>
                    <div className="text-right m-3 ms-0">
                        <Button onClick={clearData} variant="danger">x</Button>
                    </div>
                </div>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>An</Form.Label>
                            <Form.Control required type="text" readOnly value={to} style={{ width: "auto" }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Von</Form.Label>
                            <Form.Control required type="text" readOnly value={from} style={{ width: "auto" }} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Nachricht</Form.Label>
                            <Form.Control as="textarea" readOnly value={mail} rows={20} />
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
};
