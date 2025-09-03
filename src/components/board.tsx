import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Row } from "./row";
import { GameContext } from "../contexts/game";
import { Cell } from "../interfaces/IBoard";
import { savedResults } from "@/utils/results";
import { getResults } from "@/utils/results";

interface AlertProps {
  tie: boolean;
  winner: Cell;
  symbol: string;
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

function RenderResults(array: { results: Array<string> }) {
  if (!array.results || array.results.length === 0) return null;
  return (
    <div className="m-4">
      <h3 className="font-bold mb-2">Results</h3>
      {array.results.map((result, i) => {
        return (
          <p
            className="bg-gray-200 border-b-gray-300 border-b-1 p-2"
            key={result[i]}
          >
            {result}
          </p>
        );
      })}
    </div>
  );
}

function Alert({ tie, winner, symbol }: AlertProps) {
  const {
    dispatch,
    state: {
      data: { gameType },
    },
  } = useContext(GameContext);

  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const [computerName, setComputerName] = useState("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPlayerOne = localStorage.getItem("player1");
      const savedPlayerTwo = localStorage.getItem("player2");
      const savedComputer = localStorage.getItem("computer");
      setPlayerOneName(savedPlayerOne || "Player 1");
      setPlayerTwoName(savedPlayerTwo || "Player 2");
      setComputerName(savedComputer || "Computer");
    }
  }, []);

  useEffect(() => {
    if (winner) {
      let personalizedWinner = "";
      if (gameType === "PVC") {
        personalizedWinner = winner === symbol ? computerName : playerOneName;
      } else {
        personalizedWinner = winner === symbol ? playerOneName : playerTwoName;
      }
      setResults(savedResults(personalizedWinner) || []);
    } else if (tie) {
      setResults(savedResults("Tied game") || []);
    }
  }, [
    winner,
    tie,
    gameType,
    symbol,
    playerOneName,
    playerTwoName,
    computerName,
  ]);

  if (winner) {
    let personalizedWinner = "";
    if (gameType === "PVC") {
      // BUG: incorrect name showing sometimes
      personalizedWinner = winner === symbol ? computerName : playerOneName;
    } else {
      personalizedWinner = winner === symbol ? playerOneName : playerTwoName;
    }
    return (
      <div className="flex gap-x-4 justify-between bg-green-950 rounded-md p-4 mb-4">
        <div className="text-white">
          <strong className="font-normal py-1">Winner:</strong>{" "}
          {personalizedWinner}
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

function GameTypeToggle() {
  const {
    dispatch,
    state: {
      data: { gameType },
    },
  } = useContext(GameContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferredGameMode");
      if (saved === "PVP" || saved === "PVC") {
        dispatch({ type: "SET_GAME_TYPE", data: saved });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferredGameMode");
      if (saved && saved !== gameType) {
        localStorage.removeItem("results");
      }
      localStorage.setItem("preferredGameMode", gameType);
    }
  }, [gameType]);

  return (
    <div>
      <label htmlFor="">PVC</label>
      <label>
        <input
          type="checkbox"
          checked={gameType === "PVP"}
          onChange={() => {
            const nextType = gameType === "PVC" ? "PVP" : "PVC";
            dispatch({ type: "SET_GAME_TYPE", data: nextType });
          }}
        />
      </label>
      <label htmlFor="">PVP</label>
    </div>
  );
}

export function Board() {
  const {
    state: {
      data: { board, winner, tie, player },
    },
  } = useContext(GameContext);

  const [startingPlayerSymbol, setStartingPlayerSymbol] = useState("");
  const [scoreBoard, setScoreBoard] = useState<{
    results: Array<string>;
  } | null>(null);

  useEffect(() => {
    setStartingPlayerSymbol(player);
    const results = getResults();
    setScoreBoard(results);
  }, []);

  useEffect(() => {
    const results = getResults();
    setScoreBoard(results);
  }, [winner, tie]);

  const rows: ReactElement[] = [];

  for (let i = 0; i < board.length; i++) {
    rows.push(<Row key={i} row={board[i]} rowCount={i} />);
  }

  return (
    <>
      <Alert winner={winner} tie={tie} symbol={startingPlayerSymbol} />

      <GameTypeToggle />

      <div>{scoreBoard && RenderResults(scoreBoard)}</div>

      <div className="grid grid-cols-3 grid-rows-3 text-center max-h-[calc(100vh-10rem)] min-h-[calc(100vh-10rem)]">
        {rows.map((r) => r)}
      </div>
    </>
  );
}
