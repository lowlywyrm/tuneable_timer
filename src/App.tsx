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
  const [initialTime, setInitialTime] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashColor, setFlashColor] = useState("red");
  const [isPaused, setIsPaused] = useState(false);
  const [buttonState, setButtonState] = useState<"submit" | "pause" | "stop">(
    "submit"
  );

  useEffect(() => {
    let intervalId: number;
    let flashIntervalId: number;

    if (timeLeft !== null && timeLeft > 0 && !isPaused) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null) return null;
          if (prev === 1) {
            setIsFlashing(true);
            setButtonState("stop");
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (isFlashing) {
      flashIntervalId = setInterval(() => {
        setFlashColor((prev) => (prev === "red" ? "white" : "red"));
      }, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (flashIntervalId) {
        clearInterval(flashIntervalId);
      }
    };
  }, [timeLeft, isFlashing, isPaused]);

  const getBackgroundColor = () => {
    if (timeLeft === null || initialTime === null) return "white";
    if (isFlashing) return flashColor;

    const progress = timeLeft / initialTime;
    if (progress > 0.5) {
      // From green to white (100% to 50%)
      const greenIntensity = Math.floor(255 * ((progress - 0.5) * 2));
      return `rgb(${255 - greenIntensity}, 255, ${255 - greenIntensity})`;
    } else {
      // From white to red (50% to 0%)
      const redIntensity = Math.floor(255 * (1 - progress * 2));
      const whiteIntensity = Math.floor(255 * (progress * 2));
      return `rgb(255, ${whiteIntensity}, ${whiteIntensity})`;
    }
  };

  const handleButtonClick = () => {
    if (buttonState === "submit") {
      submitTime();
    } else if (buttonState === "pause") {
      setIsPaused(!isPaused);
    } else if (buttonState === "stop") {
      resetTimer();
    }
  };

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
    setInitialTime(time);
    setIsFlashing(false);
    setFlashColor("red");
    setIsPaused(false);
    setButtonState("pause");
  };

  const resetTimer = () => {
    setTimeLeft(null);
    setInitialTime(null);
    setIsFlashing(false);
    setFlashColor("red");
    setIsPaused(false);
    setButtonState("submit");

    const hourInput: HTMLInputElement = document.getElementById(
      "hourInput"
    ) as HTMLInputElement;
    const minuteInput: HTMLInputElement = document.getElementById(
      "minuteInput"
    ) as HTMLInputElement;
    const secondInput: HTMLInputElement = document.getElementById(
      "secondInput"
    ) as HTMLInputElement;

    hourInput.value = "0";
    minuteInput.value = "0";
    secondInput.value = "0";
  };

  return (
    <>
      <div
        className="app-container"
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <div className="time-input-container">
          <input id="hourInput" defaultValue="0" type="text" />
          <input id="minuteInput" defaultValue="0" type="text" />
          <input id="secondInput" defaultValue="0" type="text" />
        </div>
        <button onClick={handleButtonClick}>
          {buttonState === "submit"
            ? "Start"
            : buttonState === "pause"
            ? isPaused
              ? "Resume"
              : "Pause"
            : "Stop"}
        </button>
        {timeLeft !== null && (
          <div className="countdown-display">
            <h2>{formatTime(timeLeft)}</h2>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
