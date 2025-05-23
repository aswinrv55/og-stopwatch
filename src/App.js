import React, { useState, useEffect } from "react";

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (t) => {
    const ms = `0${(t % 1000) / 10}`.slice(-2);
    const seconds = Math.floor(t / 1000);
    const s = `0${seconds % 60}`.slice(-2);
    const m = `0${Math.floor(seconds / 60)}`.slice(-2);
    return `${m}:${s}.${ms}`;
  };

  const addLap = () => {
    if (laps.length > 0) {
      const last = laps[0];
      const diff = time - last.time;
      setLaps([{ id: laps.length + 1, time, diff }, ...laps]);
    } else {
      setLaps([{ id: 1, time, diff: time }]);
    }
  };

  const reset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div
      style={{
        //minHeight: '100vh',
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: 24 }}>STOPWATCH</h1>
      <div style={{ fontSize: 48, margin: "20px 0" }}>{formatTime(time)}</div>

      <div>
        <button onClick={() => setRunning(!running)}>
          {running ? "⏸" : "▶️"}
        </button>
        <button onClick={addLap} disabled={!running}>
        🚩
        </button>
        <button onClick={reset}>🔁</button>
      </div>

      <div className="lap-list">
        {laps.map((lap) => (
          <div key={lap.id} className="lap">
            <span>{lap.id.toString().padStart(2, "0")}</span>
            <span>+ {formatTime(lap.diff)}</span>
            <span>{formatTime(lap.time)}</span>
          </div>
        ))}
      </div>

      <div
        onClick={() => setShowHistory(true)}
        style={{
          marginTop: 30,
          padding: 20,
          backgroundColor: "#111",
          borderRadius: 12,
          width: "300%",
          maxWidth: 200,
          margin: "20px auto",
          textAlign: "center",
        }}
      >
        ⏱ Activity History
      </div>

      {showHistory && (
        <div
          style={{
            //position: "fixed",
            top: "20%",
            left: "10%",
            right: "10%",
            backgroundColor: "#111",
            border: "1px solid #444",
            borderRadius: 12,
            padding: 20,
            color: "white",
          }}
        >
          <h2>Activity History</h2>
          {laps.length === 0 ? (
            <p>No history recorded</p>
          ) : (
            <ul>
              {laps.map((lap) => (
                <li key={lap.id} style={{ marginBottom: "20px" }}>
                  Lap {lap.id}: {formatTime(lap.diff)} at {formatTime(lap.time)}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => setShowHistory(false)}
            style={{ borderRadius: 10 }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
