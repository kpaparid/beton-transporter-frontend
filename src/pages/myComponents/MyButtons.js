import React from "react";
import { Button } from '@themesberg/react-bootstrap';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';



const defaultVariant = "primary";

export const EditBtn = (props) => {
    const editMode = useSelector(state=>state.editMode)
    const { onClick, className = "", size, variant, text='Edit' } = props;
    return (
        <MyBtn className={`${className} ${editMode ? "disabled" : ""} `} 
        onClick={onClick} text={text} 
        variant={variant} size={size}></MyBtn>)
};
export const SaveBtn = (props) => {
    const editMode = useSelector(state=>state.editMode)
    const { onClick, className = "", size, variant, text='Save' } = props;
    return (
        <MyBtn 
        className={`${className} ${editMode ? "d-block" : "disabled d-none"} `} 
        onClick={onClick} text={text} 
        variant={variant} size={size}></MyBtn>)
};
export const BreakBtn = (props) => {
    const editMode = useSelector(state=>state.editMode)
    const { onClick, className = "", size, variant, text='Break' } = props;
    return (
        <MyBtn 
        className={`${className} ${editMode ? "d-block" : "disabled d-none"} `} 
        onClick={onClick} text={text} 
        variant={variant} size={size}></MyBtn>)
};
export const DownloadBtn = (props) => {
    const { onClick, className = "", size, variant, text='Download' } = props;
    return (
        <MyBtn 
        className={`${className} `} 
        onClick={onClick} text={text} 
        variant={variant} size={size}></MyBtn>)
};
export const MyBtn = (props) => {
    const { onClick = "", text = "", className = "", size = "", variant = defaultVariant } = props;
    return (
        <Button className={className} onClick={onClick} variant={variant} size={size}>{text}</Button>)
};