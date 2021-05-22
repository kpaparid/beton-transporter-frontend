import React from "react";
import { useLayoutEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Form, ButtonGroup, Dropdown } from '@themesberg/react-bootstrap';
import transactions from "../../data/transactions";


export const DropdownRow = (props) => {
    const { left, right } = props;

    return (
        <div className="container px-2">
            <div className="row flex-wrap">
                <p className="col-md-4 col-xs-4 text-wrap text-left " >{left}</p>

                <div className="g-0 ps-md-8 ps-xs-1 d-flex col-md-8 col-xs-8">
                    <p className="col-11 px-3 text-right text-truncate">{right}</p>
                    <div className="col-1 dropdown-arrow text-right pe-3"><FontAwesomeIcon icon={faAngleRight} className="dropdown-arrow" /></div>

                </div>
            </div>
        </div>
    )
};
  
    
export const SelectRow =(props) => {
    return (<div>
        
    </div>)
    
};
export const DropdownFilter = (props) => {

    function useWindowSize() {
        const [size, setSize] = useState(0);
        useLayoutEffect(() => {
            function updateSize() {
                setSize(window.innerWidth);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        });
        return size;
    }
    const currentWidth = useWindowSize();
    const data = [
        { "label": "datum", "text": "Datum" },
        { "label": "wagen", "text": "Wagen" },
        { "label": "werk", "text": "Werk" },
        { "label": "cbm", "text": "Cbm" },
        { "label": "abfahrt", "text": "Abfahrt" },
        { "label": "kmAbfahrt", "text": "Km Stand bei Abfahrt" },
        { "label": "ankunft", "text": "Ankunft" },
        { "label": "kmAnkunft", "text": "Km Stand bei Ankunft" },
        { "label": "lieferscheinNr", "text": "Lieferschein Nr." },
        { "label": "baustelle", "text": "Baustelle" },
        { "label": "entladeBeginn", "text": "EntladeBeginn" },
        { "label": "entladeEnde", "text": "EntladeEnde" },
        { "label": "entladeTyp", "text": "EntladeTyp" },
        { "label": "wartezeit", "text": "Wartezeit" },
        { "label": "sonstiges", "text": "Sonstiges" }
    ]


    return (
        <div>
            {data.map((d, index) =>
                <div key={d.label.toString()}>
                    <SelectRow></SelectRow>
                    <Dropdown drop={(currentWidth > 1000) ? "right" : "down"} as={ButtonGroup} className="d-flex">
                        <Dropdown.Toggle split variant="white" className="d-flex  shadow-none">
                            <DropdownRow left={d.text} right={[...new Set(transactions.map(t => t[d.label.toString()]))].join(" , ")}></DropdownRow>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdown-menu-right">
                            <Form className="container-fluid px-3">
                                <Form.Check className="d-flex row g-0" id={`checkbox-all-${index}`} htmlFor={`checkbox-all-${index}`}>
                                    <Form.Check.Label className="col-10">Select All</Form.Check.Label>
                                    <div className="col-1 flex-fill text-right">
                                        <Form.Check.Input type='checkbox' />
                                    </div>

                                </Form.Check>
                            </Form>
                            <Dropdown.Divider></Dropdown.Divider>
                            {[...new Set(transactions.map(t => t[d.label.toString()]))].map((t, index) =>
                            
                                <Form className="container-fluid px-3" key={index}>
                                    <Form.Check className="d-flex row g-0" id={`checkbox-${d.label.toString()}-${index}`} htmlFor={`checkbox-${d.label.toString()}-${index}`}>
                                        <Form.Check.Label className="col-10">{t}</Form.Check.Label>
                                        <div className="col-1 flex-fill text-right">
                                            <Form.Check.Input type='checkbox' />
                                        </div>

                                    </Form.Check>
                                </Form>
                                
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown.Divider></Dropdown.Divider>
                </div>
            )}
        </div>

    )
};