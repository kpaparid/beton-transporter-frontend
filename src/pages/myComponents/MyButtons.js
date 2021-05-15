import React from "react";
import { Button } from '@themesberg/react-bootstrap';

//

const defaultVariant = "primary";
export const EditBtn = (props) => {
    const { onClick, className = "", size, variant, editMode } = props;
    return (
        <MyBtn className={`${className} ${editMode ? "disabled" : ""} `} 
        onClick={onClick} text="Edit" 
        variant={variant} size={size}></MyBtn>)
};
export const SaveBtn = (props) => {
    const { onClick, className = "", size, variant, editMode } = props;
    return (
        <MyBtn 
        className={`${className} ${editMode ? "d-block" : "disabled d-none"} `} 
        onClick={onClick} text="Speichern" 
        variant={variant} size={size}></MyBtn>)
};
export const BreakBtn = (props) => {
    const { onClick, className = "", size, variant, editMode = false } = props;
    return (
        <MyBtn 
        className={`${className} ${editMode ? "d-block" : "disabled d-none"} `} 
        onClick={onClick} text="Abbruch" 
        variant={variant} size={size}></MyBtn>)
};
export const DownloadBtn = (props) => {
    const { onClick, className = "", size, variant, editMode = false } = props;
    return (
        <MyBtn 
        className={`${className} `} 
        onClick={onClick} text="Download" 
        variant={variant} size={size}></MyBtn>)
};
export const MyBtn = (props) => {
    const { onClick = "", text = "", className = "", size = "", variant = defaultVariant } = props;
    return (
        <Button className={className} onClick={onClick} variant={variant} size={size}>{text}</Button>)
};