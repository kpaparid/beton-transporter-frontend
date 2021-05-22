import React from 'react';
import { Button, Modal } from '@themesberg/react-bootstrap';

export default (props) => {
    const { date, from, id, mail, status, title, to } = props.message;
    const { show, onClose } = props;
    return (
        <>
            <Modal as={Modal.Dialog} centered show={show} onHide={onClose}>
                <Modal.Header>
                    <Modal.Title className="h6">Terms of Service</Modal.Title>
                    <Button variant="close" aria-label="Close" onClick={onClose} />
                </Modal.Header>
                <Modal.Body>
                    <p>Mail: {mail}</p>
                    <p>Receiver: {to}</p>
                    <p>Title: {title}</p>
                    <p>Date: {date}</p>
                    <p>From: {from}</p>
                    <p>ID: {id}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        I Got It
                        </Button>
                    <Button variant="link" className="text-gray ms-auto" onClick={onClose}>
                        Close
                        </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
