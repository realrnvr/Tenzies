import React from "react";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Die from "./components/Die.jsx";
import "./App.css";

function App() {
  // states
  const [dice, setDice] = useState(randomAllDice());
  const [tenzies, setTenzies] = useState(false);
  const [roll, setRoll] = useState(0);
  const [moves, setMoves] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [sec, setSec] = useState(0);
  const [bestTime, setBestTime] = useState([]);
  const [currentMoves, setCurrentMoves] = useState([]);
  const [currentTime, setCurrentTime] = useState([]);
  // // // // // // // //
  const [resize, setResize] = useState(window.innerWidth);

  // handle the resize so that,
  // confetti gets render on the full resized window
  function handelResize() {
    setResize(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handelResize);
    return () => window.removeEventListener("resize", handelResize);
  }, []);

  // Gives the current time
  function giveCurrentTime() {
    const currentTimeNow = currentTime[currentTime.length - 1];
    return currentTimeNow;
  }

  // Gives the current Moves
  function giveCurrentMove() {
    const currentMovesNow = currentMoves[currentMoves.length - 1];
    return currentMovesNow;
  }

  // To get the best time to win
  function timer() {
    setIsShow(true);
  }

  useEffect(() => {
    let intervalId;
    if (isShow) {
      intervalId = setInterval(() => {
        setSec((prevSec) => prevSec + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isShow]);

  // Gives the best time out of available times
  function bestMoveTime() {
    const bestTimeArray = bestTime.sort((a, b) => a - b);
    return bestTimeArray[0];
  }

  // useEffect hook to check the win condition for every render
  useEffect(() => {
    const isWin = dice.every((die, idx, array) => {
      return die.isHeld && die.value === array[0].value;
    });
    if (isWin) {
      setTenzies(true);
      setIsShow(false);
      setMoves((prevCount) => [...prevCount, roll]);
      setCurrentMoves((prevCurrentMoves) => [...prevCurrentMoves, roll]);
      setRoll(0);
      setBestTime((prevSec) => [...prevSec, sec]);
      setCurrentTime((prevCurrentTime) => [...prevCurrentTime, sec]);
      setSec(0);
    }
  }, [dice]);

  // function to return array obj
  function dieInfo() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  // Returns an random number array
  function randomAllDice() {
    const randomNum = [];
    for (let i = 0; i < 10; i++) {
      randomNum.push(dieInfo());
    }
    return randomNum;
  }

  // Handel Click function (hold effect)
  function handelClick(id) {
    setDice((prevDice) => {
      return prevDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      );
    });
  }

  // onclick for roll btn
  function refreshDice() {
    if (tenzies) {
      setDice(randomAllDice());
      setTenzies(false);
    } else {
      setDice((prevDice) =>
        prevDice.map((die) => (die.isHeld ? die : dieInfo()))
      );
    }
  }

  // Creates each die El with some props
  const dieEl = dice.map((die) => {
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        handelClick={() => handelClick(die.id)}
        timer={timer}
        countMoves={countMoves}
      />
    );
  });

  // Track of Moves btw Wins
  function countMoves() {
    if (!tenzies) {
      setRoll((prevRoll) => prevRoll + 1);
    }
  }

  // Gives the best Moves out of the available moves
  function bestMove() {
    const moveArray = moves.sort((a, b) => a - b);
    return moveArray[0];
  }

  return (
    <>
      <main>
        {tenzies && <Confetti width={resize} />}
        <div className="tenzies-container">
          <div className="head-section | mg-top ">
            <h1>tenzies</h1>
            <p>
              Tenzies is a quick and lively dice game where players roll ten
              dice, aiming to match specific combinations or patterns. It's a
              mix of luck and strategy, perfect for all ages.
            </p>
          </div>
          <div className="stats-container">
            <div className="best-complexity | mg-top ">
              <p>Best Moves: {bestMove() || roll}</p>
              <p>
                Best Time: {bestMoveTime() || sec} Second
                {sec || bestMoveTime() > 1 ? "s" : ""}
              </p>
            </div>
            <div className="current-complexity | mg-top ">
              <p>Current Moves: {tenzies ? giveCurrentMove() : roll}</p>
              <p>
                Current Time: {tenzies ? giveCurrentTime() : sec} Second
                {sec || giveCurrentTime() > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="mid-section | pd-200 ">{dieEl}</div>
          <div className="bottom-section | mg-top ">
            <button
              onClick={() => {
                refreshDice();
                timer();
                countMoves();
              }}
            >
              {tenzies ? "New game" : "Roll"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
