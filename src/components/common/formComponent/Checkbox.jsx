import React from 'react';
import { useSelector } from 'react-redux';
const Checkbox = ({ className, name, label, disabled, ...res }) => {
  const permission = useSelector(store => store.permission);
  return (
    <>
      <input type="checkbox" name={name} {...res} className={`${className} form-checkbox inline-block`} disabled={disabled || (!permission?.isEdit && !permission?.isDelete)} />
      <label className="ml-2 inline-block" htmlFor={res.id}>{label}</label>
    </>
  )
}

export default Checkbox;