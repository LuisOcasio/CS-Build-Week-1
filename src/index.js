import React, { useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import produce from "immer";
import "./index.css";

//create grid
const gridRows = 50;
const gridColumns = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const createGrid = () => {
  const rows = [];
  for (let i = 0; i < gridRows; i++) {
    rows.push(Array.from(Array(gridColumns), () => 0));
  }
  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return createGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < gridRows; i++) {
          for (let j = 0; j < gridColumns; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const generateI = i + x;
              const generateJ = j + y;
              if (
                generateI >= 0 &&
                generateI < gridRows &&
                generateJ >= 0 &&
                generateJ < gridColumns
              ) {
                neighbors += g[generateI][generateJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <section style={{ fontSize: "2rem", color: "white" }}>
        <h1 style={{ textDecoration: "underline" }}>Rules to the game</h1>
        <p>
          1. Any live cell with fewer than two live neighbours dies (referred to
          as underpopulation or exposure).{" "}
        </p>
        <p>
          2. Any live cell with more than three live neighbours dies (referred
          to as overpopulation or overcrowding).
        </p>
        <p>
          3. Any live cell with two or three live neighbours lives, unchanged,
          to the next generation.{" "}
        </p>
        <p>
          4. Any dead cell with exactly three live neighbours will come to life.
        </p>
      </section>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "25%",
        }}
      >
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "stop" : "start"}
        </button>

        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < gridRows; i++) {
              rows.push(
                Array.from(Array(gridColumns), () =>
                  Math.random() > 0.7 ? 1 : 0
                )
              );
            }
            setGrid(rows);
          }}
        >
          random
        </button>

        <button
          onClick={() => {
            setGrid(createGrid());
          }}
        >
          clear
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridColumns}, 20px)`,
          backgroundColor: "white",
          padding: "1rem",
          margin: "auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "red" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
