import { useEffect, useState } from 'react'
import './App.css'
import beep from './assets/beep.mp3'
import { FaPlay, FaPause, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { TfiReload } from 'react-icons/tfi'

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio(beep));
  let interval;


  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) + " : " + (seconds < 10 ? "0" + seconds : seconds)
    )
  }

  function changeTime(time, type) {
    if (type === "break") {
      if (breakTime <= 60 && time < 0) {
        return;
      }
      setBreakTime(prev => prev + time);
    } else {
      if (sessionTime <= 60 && time < 0) {
        return;
      }
      setSessionTime(prev => prev + time);
      if (!timerOn) {
        setDisplayTime(sessionTime + time)
      }
    }
  }

  function playBreakAudio() {
    breakAudio.currentTime = 0;
    breakAudio.play();

  }

  function controlTime() {
    if (timerOn) {
      setTimerOn(false);
    } else {
      setTimerOn(true);
    }
  }

  useEffect(() => {
    let time = 0;
    let c = onBreak;
    if (timerOn === true) {
      interval = setInterval(() => {
        setDisplayTime((prev) => {
          if (prev <= 0) {
            if (!c) {
              setOnBreak(true);
              playBreakAudio();
              c = true;
              time = breakTime;
            } else {
              setOnBreak(false);
              playBreakAudio();
              c = false;
              console.log(c)
              time = sessionTime;
            }
            return time;
          } else {
            return prev - 1
          }
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval)
    };
  }, [timerOn]);


  function resetTime() {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setTimerOn(false);
    setOnBreak(false);
  }

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <div className='length-container'>
        <Length
          title="Break Length"
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />
        <Length
          title="Session length"
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
      </div>
      <div>
        <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
        <h3 id="time-left">{formatTime(displayTime)}</h3>
      </div>
      <div className='actions'>
        <button
          onClick={() => { controlTime() }}
          id="start_stop">
          {timerOn ? <FaPause className='start_stop'/> : <FaPlay className='start_stop'/>}
        </button>
        <button
          id="reset"
          onClick={resetTime}>
          <TfiReload  className='reset'/>
        </button>
      </div>

    </div>
  )
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h3 id={type === "break" ? "break-label" : "session-label"}>{title}</h3>
      <div className='time-sets'>
        <button onClick={() => changeTime(-60, type)}
          id={type === "break" ? "break-decrement" : "session-decrement"}>
          <FaArrowUp className='arrow' />
        </button>
        <h3 id={type === "break" ? "break-length" : "session-length"}>{formatTime(time)}</h3>
        <button onClick={() => changeTime(60, type)}
          id={type === "break" ? "break-increment" : "session-increment"}>
          <FaArrowDown className='arrow' />
        </button>
      </div>
    </div>
  );
}


export default App
