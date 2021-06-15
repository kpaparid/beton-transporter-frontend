import React, { useState, useEffect } from "react";
import { Form } from "@themesberg/react-bootstrap"

export default (props) => {
    const { label, values, id, defaultValue, minWidth = "100px", maxWidth = "150px" } = props
    // console.log(values)

    return (
        <Form>
            <Form.Group>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Select key={id}
                    style={{
                        width: "auto",
                        minWidth: minWidth,
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        textAlignLast: 'center',
                    }}
                >
                    <option defaultValue>{defaultValue}</option>
                    {
                        values.map((value, index) =>
                            <option key={`${id}-${index}`}>{value}
                            </option>)
                    }
                </Form.Select>
            </Form.Group>
        </Form>
    )
}

