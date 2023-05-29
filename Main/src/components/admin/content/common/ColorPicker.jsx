import React, { useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

const ColorPicker = ({ ColumnPerRow = 3, label, name, value, changeBackgroundColor }) => {
  const [color, setColor] = useState("#2d8bf1");
  const [displayPicker, setDisplayPicker] = useState(false);

  useEffect(() => {
    setColor(
      value === "" || value === null || value === undefined ? "" : value
    );
  }, [value]);

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setDisplayPicker(false);
    }
  };

  const handleClick = () => {
    //console.log('d');
    setDisplayPicker(!displayPicker);
  };
  const handleChange = (color) => {
    setColor(color.hex);
    changeBackgroundColor(color);

  };

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background: `${color}`,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
        right: 0,
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });
  return (
    <>
      <div className="flex items-center">
        <div>
          <input
            id="colorSelected"
            type="text"
            placeholder="Pick a color"
            className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
            name={name}
            disabled={true}
            value={color}
            onChange={()=> changeBackgroundColor(color)}
           
          />
        </div>
        <div className="relative ml-3">
          <button
            type="button"
            ref={wrapperRef}
            onClick={() => setDisplayPicker(!displayPicker)}
            className="w-10 h-10 rounded-full focus:outline-none focus:shadow-outline inline-flex p-2 shadow"
            style={{
              background: `${color}`,
              color: "white",
            }}
          >
            <svg
              className="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                d="M15.584 10.001L13.998 8.417 5.903 16.512 5.374 18.626 7.488 18.097z"
              />
              <path d="M4.03,15.758l-1,4c-0.086,0.341,0.015,0.701,0.263,0.949C3.482,20.896,3.738,21,4,21c0.081,0,0.162-0.01,0.242-0.03l4-1 c0.176-0.044,0.337-0.135,0.465-0.263l8.292-8.292l1.294,1.292l1.414-1.414l-1.294-1.292L21,7.414 c0.378-0.378,0.586-0.88,0.586-1.414S21.378,4.964,21,4.586L19.414,3c-0.756-0.756-2.072-0.756-2.828,0l-2.589,2.589l-1.298-1.296 l-1.414,1.414l1.298,1.296l-8.29,8.29C4.165,15.421,4.074,15.582,4.03,15.758z M5.903,16.512l8.095-8.095l1.586,1.584 l-8.096,8.096l-2.114,0.529L5.903,16.512z" />
            </svg>
          </button>
          {displayPicker ? (
            <div style={styles.popover}>
              <div style={styles.cover} onClick={handleClick} />
              <SketchPicker color={color} onChange={handleChange} />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
