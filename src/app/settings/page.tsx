"use client";

import { useEffect, useState } from "react";

export default function Settings() {
  const [playerOneName, setPlayerOneName] = useState("Player 1");
  const [playerTwoName, setPlayerTwoName] = useState("Player 2");
  const [computerName, setComputerName] = useState("Computer");

  // TODO: DRY this

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPlayerOne = localStorage.getItem("player1");
      const savedPlayerTwo = localStorage.getItem("player2");
      const savedComputer = localStorage.getItem("computer");
      // TODO: review the condition
      if (savedPlayerOne) setPlayerOneName(savedPlayerOne);
      if (savedPlayerTwo) setPlayerTwoName(savedPlayerTwo);
      if (savedComputer) setComputerName(savedComputer);
    }
  }, []);

  const save = () => {
    localStorage.setItem("player1", playerOneName);
    localStorage.setItem("player2", playerTwoName);
    localStorage.setItem("computer", computerName);
    alert("Saved!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Game Settings</h2>
        <input
          value={playerOneName}
          onChange={(e) => setPlayerOneName(e.target.value)}
          placeholder="Player 1 Name"
          className="border p-2 rounded"
        />
        <input
          value={playerTwoName}
          onChange={(e) => setPlayerTwoName(e.target.value)}
          placeholder="Player 2 Name"
          className="border p-2 rounded"
        />
        <input
          value={computerName}
          onChange={(e) => setComputerName(e.target.value)}
          placeholder="Computer Name"
          className="border p-2 rounded"
        />
        <button
          onClick={save}
          className="bg-blue-600 text-white py-2 rounded mt-2"
        >
          Save
        </button>
      </div>
    </div>
  );
}
