import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';

const ToggleButton = ({ on, off, onBackground, offBackground, name, onChange, defaultValue = false, id, size, disabled, ...rest }) => {
  const [toggle, setToggle] = useState(defaultValue);
  useEffect(() => {
    setToggle(defaultValue)
  }, [defaultValue]);
  const permission = useSelector(store => store.permission);
  const { setFieldValue, values } = useFormikContext();


  const onChangeHandler = (e) => {
    setToggle(!toggle);
    if (onChange instanceof Function) {
      onChange(e);
    } else if (setFieldValue instanceof Function) {
      setFieldValue(name, e.target.checked)
    }
  }
  return (
    <>
      <div className={`relative ${size === 'm' ? 'w-20' : 'w-16'}`}>
        <input
          type="checkbox"
          id={id ? id : name}
          className="sr-only"
          checked={toggle}
          // defaultChecked={toggle}
          onChange={onChangeHandler}
          name={name}
          disabled={(!permission?.isEdit && !permission?.isDelete) || disabled}
          {...rest}
        />
        <label className={`text-gray-500 lef text-center h-7 cursor-pointer flex items-center justify-center rounded leading-5 ${toggle ? (onBackground ? onBackground : 'bg-green-600') : (offBackground ? offBackground : 'bg-slate-600')}`} htmlFor={id}>
          <span className={`bg-white shadow-sm w-6 h-6 transition-all absolute rounded ${toggle ? (size === 'm' ? 'left-[54px]' : 'left-[38px]') : 'left-0.5'}`} aria-hidden="true" ></span>
          <span className={`text-white text-xs inline-block absolute right-2 ${toggle ? 'opacity-0' : 'opacity-100'}`} >{toggle ? (on ? on : 'ON') : (off ? off : 'OFF')}</span>
          <span className={`text-white text-xs inline-block absolute left-2 ${toggle ? 'opacity-1' : 'opacity-0'}`} >{toggle ? (on ? on : 'ON') : (off ? off : 'OFF')}</span>
        </label>
      </div>
    </>
  )
}

export default ToggleButton;
