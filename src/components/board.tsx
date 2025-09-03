import React, { ReactElement, useContext } from "react";
import { Row } from "./row";
import { GameContext } from "../contexts/game";
import { Cell } from "../interfaces/IBoard";

interface AlertProps {
  tie: boolean;
  winner: Cell;
}

function RenderResetButton(dispatch: (action: any) => void) {
  return (
    <button
      className="cursor-pointer text-green-300 hover:text-green-200"
      onClick={() => {
        dispatch({ type: "RESET", data: null });
      }}
    >
      New game
    </button>
  );
}

function Alert({ tie, winner }: AlertProps) {
  const { dispatch } = useContext(GameContext);
  if (winner) {
    return (
      <div className="flex gap-x-4 justify-between bg-green-950 rounded-md p-4 mb-4">
        <div className="text-white">
          <strong className="font-normal py-1">Winner:</strong> {winner}
        </div>
        {RenderResetButton(dispatch)}
      </div>
    );
  }

  if (tie) {
    return (
      <div className="flex gap-x-4 justify-between bg-green-950 rounded-md p-4 mb-4">
        <strong className="font-normal text-white">Tied game</strong>
        {RenderResetButton(dispatch)}
      </div>
    );
  }

  return null;
}

export function Board() {
  const {
    state: {
      data: { board, winner, tie },
    },
  } = useContext(GameContext);

  const rows: ReactElement[] = [];

  for (let i = 0; i < board.length; i++) {
    rows.push(<Row key={i} row={board[i]} rowCount={i} />);
  }

  return (
    <>
      <Alert winner={winner} tie={tie} />

      <div className="grid grid-cols-3 grid-rows-3 text-center max-h-[calc(100vh-10rem)] min-h-[calc(100vh-10rem)]">
        {rows.map((r) => r)}
      </div>
    </>
  );
}
