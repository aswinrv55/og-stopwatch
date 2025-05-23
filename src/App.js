import React, { useState, useEffect } from "react";

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(storedHistory);
  }, []);

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
    const newLap = {
      id: laps.length + 1,
      time,
      diff: laps.length > 0 ? time - laps[0].time : time,
    };
    setLaps([newLap, ...laps]);
  };

  const reset = () => {
    const session = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      laps,
    };
    const updatedHistory = [session, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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

      <div
        className="lap-list"
        style={{ maxHeight: 300, overflowY: "auto", marginTop: 20 }}
      >
        {laps.map((lap) => (
          <div key={lap.id} className="lap">
            <span>{lap.id.toString().padStart(2, "0")}</span>
            <span>+ {formatTime(lap.diff)}</span>
            <span>{formatTime(lap.time)}</span>
          </div>
        ))}
      </div>

      <div
        onClick={() => setShowHistory(!showHistory)}
        style={{
          marginTop: 30,
          padding: 20,
          backgroundColor: "#111",
          borderRadius: 12,
          width: "300%",
          maxWidth: 200,
          textAlign: "center",
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        {" "}
        ⏱ ACTIVITY HISTORY{" "}
      </div>

      {showHistory && (
        <div
          style={{
            marginTop: 20,
            backgroundColor: "#111",
            border: "1px solid #444",
            borderRadius: 12,
            padding: 20,
            color: "white",
            maxWidth: 400,
            width: "90%",
          }}
        >
          <h2>Activity History</h2>

          {history.length === 0 && laps.length === 0 ? (
            <p>No history recorded</p>
          ) : (
            <ul style={{ padding: 0 }}>
              {laps.length > 0 && (
                <li style={{ marginBottom: 10 }}>
                  <strong>
                    Current Session ({new Date().toLocaleString()}):
                  </strong>
                  <ul>
                    {laps.map((lap) => (
                      <li key={lap.id}>
                        Lap {lap.id}: {formatTime(lap.diff)} at{" "}
                        {formatTime(lap.time)}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {history.map((session) => (
                <li key={session.id} style={{ marginBottom: 10 }}>
                  <strong>{session.date}</strong>
                  <ul>
                    {session.laps.map((lap) => (
                      <li key={lap.id}>
                        Lap {lap.id}: {formatTime(lap.diff)} at{" "}
                        {formatTime(lap.time)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
