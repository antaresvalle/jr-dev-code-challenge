"use client";

export function savedResults(winner: string) {
  let updatedResults = null;

  if (typeof window !== "undefined") {
    const existingResults = localStorage.getItem("results");
    const parsedExistingResults =
      existingResults && JSON.parse(existingResults);

    if (
      Array.isArray(parsedExistingResults) &&
      parsedExistingResults.length > 0
    ) {
      parsedExistingResults.push(winner);
      updatedResults = parsedExistingResults;
      if (updatedResults.length > 5) {
        updatedResults.shift();
      }
      const resultsString = JSON.stringify(parsedExistingResults);
      localStorage.setItem("results", resultsString);
    } else {
      const initialResults = [winner];
      updatedResults = initialResults;
      const resultString = JSON.stringify(initialResults);
      localStorage.setItem("results", resultString);
    }
  }

  return updatedResults;
}
