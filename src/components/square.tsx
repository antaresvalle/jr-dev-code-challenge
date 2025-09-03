import React, { useContext, useMemo } from "react";
import { GameContext } from "../contexts/game";
import { Cell } from "../interfaces/IBoard";

interface SquareProps {
  value: Cell;
  rowCount: number;
  cellCount: number;
}

export function Square({
  value = Cell.empty,
  rowCount,
  cellCount,
}: SquareProps) {
  const {
    dispatch,
    state: {
      data: { winningCells, gameType, winner, tie },
    },
  } = useContext(GameContext);

  const backgroundColor = useMemo(() => {
    if (!value) {
      return "lightgray";
    }

    if (winningCells[rowCount]) {
      if (winningCells[rowCount].includes(cellCount)) {
        return "lightgreen";
      }
    }

    return value === "X" ? "lightblue" : "lightcoral";
  }, [value, winningCells, rowCount, cellCount]);

  return (
    <div
      className="square"
      onClick={() => {
        if (!value && !tie && !winner) {
          dispatch({ type: "CELL_CLICK", data: { x: rowCount, y: cellCount } });

          if (gameType === "PVC") {
            // timeout here so it's not too aggressive to the user
            setTimeout(() => {
              dispatch({ type: "COMPUTER_PLAY", data: null });
            }, 500);
          }
        }
      }}
      style={{
        cursor: `${!value && !tie && !winner ? "pointer" : "default"}`,
        backgroundColor,
      }}
    >
      {value}
    </div>
  );
}
