import { useEffect, useRef, useState } from "react";
// import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [buttons, setButtons] = useState([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const intervalRef = useRef(null);
  const [status, setStatus] = useState({
    title: "Let's Play",
    color: "text-black",
  });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      setCursor({
        x: e.clientX,
        y: e.clientY,
      });
      setShowCursor(true);
      setTimeout(() => {
        setShowCursor(false);
      }, 200);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
  const playGame = () => {
    if (count <= 0) return;

    clearValues();
    setStatus((prev) => ({
      ...prev,
      title: "Let's Play",
      color: "text-black",
    }));
    setIsPlay(true);
    generateButtons(count);
    startTime();
  };

  const generateButtons = (numButtons) => {
    const newButtons = Array.from({ length: numButtons }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 90).toFixed(2)}%`,
      top: `${(Math.random() * 90).toFixed(2)}%`,
      removing: false,
    }));
    setButtons(newButtons);
  };

  const startTime = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    intervalRef.current = setInterval(() => {
      setTime((timer) => timer + 10);
    }, 10);
  };

  const handleClickPoint = (id) => {
    if (id !== currentCount) {
      setStatus((prev) => ({
        ...prev,
        title: "GAME OVER",
        color: "text-red-500",
      }));
      clearValues();

      return;
    }

    setCurrentCount(currentCount + 1);
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, removing: true } : button
      )
    );

    setTimeout(() => {
      setButtons((prevButtons) =>
        prevButtons.filter((button) => button.id !== id)
      );
      if (buttons.length === 1) {
        setStatus((prev) => ({
          ...prev,
          title: "ALL CLEARED",
          color: "text-green-500",
        }));
        clearValues();
      }
    }, 500);
  };

  const clearValues = () => {
    clearInterval(intervalRef.current);
    setCurrentCount(0);
  };

  const formatTime = (timer) => {
    const milliseconds = Math.floor((timer % 1000) / 100);
    const seconds = Math.floor(timer / 1000)
      .toString()
      .slice(-2);

    return `${seconds}:${milliseconds}`;
  };

  return (
    <div className="px-4 sm:container sm:px-0 flex flex-col mx-auto py-6 gap-4 z-1">
      <h1 className={`font-bold text-2xl ${status.color}`}>{status.title}</h1>
      <div className="flex flex-row gap-4 -z-11">
        <h3>Points:</h3>
        <input
          className="border border-black rounded-md px-2  "
          value={count}
          onChange={(e) => setCount(e.target.value)}
          // type="number"
        />
      </div>
      <div className="flex flex-row gap-4">
        <h3>Time:</h3>
        <p>{formatTime(time)}s</p>
      </div>
      <button className="border w-1/4" onClick={playGame}>
        {!isPlay ? "Play" : "Reset"}
      </button>
      <div className="relative w-full border border-black h-[70vh]">
        {buttons.map((button) => (
          <button
            key={button.id}
            className={`border w-10 h-10 rounded-full absolute transition-all duration-500 ease-in-out  ${
              button.removing ? "focus:bg-red-400 focus:duration-1000" : ""
            }`}
            style={{ left: button.left, top: button.top }}
            onClick={() => handleClickPoint(button.id)}
          >
            {button.id + 1}
          </button>
        ))}
      </div>
      {showCursor && (
        <div
          className="bg-white w-12 h-12 rounded-full absolute border border-black -translate-x-1/2 -translate-y-1/2 animate-[scale-125] overflow-hidden -z-10"
          style={{
            left: cursor.x,
            top: cursor.y,
          }}
        ></div>
      )}
    </div>
  );
}

export default App;
