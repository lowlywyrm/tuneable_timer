import "./App.css";
import { useState, useEffect } from "react";

const getTimeSeconds = (hour: number, minute: number, second: number) => {
  console.log("getTimeSeconds");
  console.log(hour, minute, second);
  return hour * 3600 + minute * 60 + second;
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const normalizeTimeInput = (input: HTMLInputElement) => {
  console.log(input.value);
  if (input.value === "") {
    input.value = "0";
  }
  if (/[^\d]/.test(input.value)) {
    input.value = "0";
  }
  console.log("normalizedInput");
  console.log(input.value);
};

function App() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: number;

    if (timeLeft !== null && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timeLeft]);

  const submitTime = () => {
    console.log("submit");
    const hourInput: HTMLInputElement = document.getElementById(
      "hourInput"
    ) as HTMLInputElement;
    const minuteInput: HTMLInputElement = document.getElementById(
      "minuteInput"
    ) as HTMLInputElement;
    const secondInput: HTMLInputElement = document.getElementById(
      "secondInput"
    ) as HTMLInputElement;
    normalizeTimeInput(hourInput);
    normalizeTimeInput(minuteInput);
    normalizeTimeInput(secondInput);
    console.log("after normalize");
    console.log(hourInput.value, minuteInput.value, secondInput.value);

    const time = getTimeSeconds(
      parseInt(hourInput.value),
      parseInt(minuteInput.value),
      parseInt(secondInput.value)
    );
    setTimeLeft(time);
  };

  return (
    <>
      <div className="time-input-container">
        <input id="hourInput" defaultValue="0" type="text" />
        <input id="minuteInput" defaultValue="0" type="text" />
        <input id="secondInput" defaultValue="0" type="text" />
      </div>
      <button onClick={submitTime}>Start</button>
      {timeLeft !== null && (
        <div className="countdown-display">
          <h2>{formatTime(timeLeft)}</h2>
        </div>
      )}
    </>
  );
}

export default App;
