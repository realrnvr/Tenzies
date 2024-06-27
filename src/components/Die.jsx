import React from "react";
import "./Die.css";

function Die(props) {
  return (
    <>
      <div
        className={props.isHeld ? "Die-container holdEffect" : "Die-container"}
        onClick={() => {
          props.handelClick();
          props.timer();
          props.countMoves();
        }}
      >
        <img src={`/d${props.value}.png`} alt="Dice image" />
      </div>
    </>
  );
}

export default Die;
