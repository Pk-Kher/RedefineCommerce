/*Component Name: Rating.jsx
Component Functional Details: 5 Star Rating Component
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Shrey Patel
Modified Date: June/27/2022 */

import React, { useState } from "react";

const Star = ({ marked, starId, width }) => {
  return (
    // <span data-star-id={starId} className="star text-2xl" role="button" >
    //   {marked ? '\u2605' : '\u2606'}
    // </span>
    <div className="star-wrap" style={{ position: "relative", margin: "2px" }}>
      <i
        className="icon icon-star"
        style={{ color: "#D8DBE3", fontStyle: "normal" }}
      >
        ★
      </i>
      <i
        className="icon icon-star"
        style={{
          // color: "#F4D10A",
          position: "absolute",
          left: "0px",
          top: "0px",
          width: `${width * 100}%`,
          overflow: "hidden",
          fontStyle: "normal"
        }}
      >
        ★
      </i>
    </div>
  );
};

const Ratingcomponent = ({ value, avgRating, size }) => {
  const [rating, setRating] = React.useState(parseInt(value) || 0);
  const [selection, setSelection] = React.useState(0);

  // const hoverOver = event => {
  //   let val = 0;
  //   if (event && event.target && event.target.getAttribute('data-star-id'))
  //     val = event.target.getAttribute('data-star-id');
  //   setSelection(val);
  // };
  return (
    <div
      disabled={true}
    // onMouseOut={() => hoverOver(null)}
    // onClick={e => setRating(e.target.getAttribute('data-star-id') || rating)}
    // onMouseOver={hoverOver}
    >
      {/* {Array.from({ length: 5 }, (v, i) => (
        <Star
          starId={i + 1}
          key={`star_${i + 1}`}
          marked={selection ? selection >= i + 1 : rating >= i + 1}
        />
      ))} */}

      <div
        className="star-rating-wrap"
        style={{ display: "flex", fontSize: size, lineHeight: size }}
      >
        <Star width={avgRating >= 1 ? 1 : avgRating < 0 ? 0 : avgRating % 1} />
        <Star width={avgRating >= 2 ? 1 : avgRating < 1 ? 0 : avgRating % 1} />
        <Star width={avgRating >= 3 ? 1 : avgRating < 2 ? 0 : avgRating % 1} />
        <Star width={avgRating >= 4 ? 1 : avgRating < 3 ? 0 : avgRating % 1} />
        <Star width={avgRating >= 5 ? 1 : avgRating < 4 ? 0 : avgRating % 1} />
      </div>

      <p>
        {value} of {5} stars
      </p>
    </div>
  );
};

export default Ratingcomponent;
