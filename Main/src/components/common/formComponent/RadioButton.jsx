import React from 'react';
import { useSelector } from 'react-redux';
const RadioButton = ({ className, name, onClick, label, id, disabled = false, ...res }) => {
  const permission = useSelector(store => store.permission);
  return (
    <>
      <label htmlFor={id ? id : ''}>
        <input type="radio" name={name} onClick={onClick} {...res} id={id} className={`${className} form-radio`} disabled={disabled || (!permission?.isEdit && !permission?.isDelete)} />
        <span className="ml-2">{label}</span>
      </label>
    </>
  )
}

export default RadioButton;