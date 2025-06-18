
import React, { useState, useEffect } from "react";
import axios from "axios";

const GenesisPPR = () => {
  const [userPoints, setUserPoints] = useState("");
  const [totalPoints, setTotalPoints] = useState("");
  const [virtualPrice, setVirtualPrice] = useState("");
  const [estimatedFDV, setEstimatedFDV] = useState("");
  const [results, setResults] = useState(null);

  const TOTAL_SUPPLY = 1000000000;

  const handleCalculate = () => {
    const points = parseFloat(userPoints);
    const total = parseFloat(totalPoints);
    const price = parseFloat(virtualPrice);
    const fdv = parseFloat(estimatedFDV);

    if (isNaN(points) || isNaN(total) || isNaN(price) || isNaN(fdv)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const userTokenAmount = (points / total) * TOTAL_SUPPLY;
    const estimatedWorth = userTokenAmount * price;
    const ppr = estimatedWorth / points;

    setResults({
      userTokenAmount: userTokenAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      estimatedWorth: estimatedWorth.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      ppr: ppr.toFixed(4)
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-6 bg-white bg-opacity-10 rounded-2xl shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Genesis Point Calculator</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="font-semibold">📍 How many points will you enter?</span>
          <input
            type="number"
            className="w-full p-2 mt-1 rounded bg-white bg-opacity-20"
            value={userPoints}
            onChange={(e) => setUserPoints(e.target.value)}
            placeholder="e.g., 1000"
          />
        </label>
        <label className="block">
          <span className="font-semibold">📊 Total Points Pledged</span>
          <input
            type="number"
            className="w-full p-2 mt-1 rounded bg-white bg-opacity-20"
            value={totalPoints}
            onChange={(e) => setTotalPoints(e.target.value)}
            placeholder="e.g., 100000"
          />
        </label>
        <label className="block">
          <span className="font-semibold">💲 $VIRTUAL Price at Launch</span>
          <input
            type="number"
            className="w-full p-2 mt-1 rounded bg-white bg-opacity-20"
            value={virtualPrice}
            onChange={(e) => setVirtualPrice(e.target.value)}
            placeholder="e.g., 0.01"
          />
        </label>
        <label className="block">
          <span className="font-semibold">🏷️ Estimated FDV (USD)</span>
          <input
            type="number"
            className="w-full p-2 mt-1 rounded bg-white bg-opacity-20"
            value={estimatedFDV}
            onChange={(e) => setEstimatedFDV(e.target.value)}
            placeholder="e.g., 10000000"
          />
        </label>

        <div className="text-sm text-gray-300 mt-1">Total Token Supply: <strong>1,000,000,000</strong></div>

        <button
          onClick={handleCalculate}
          className="w-full p-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
        >
          🚀 Calculate
        </button>

        {results && (
          <div className="mt-6 p-4 bg-black bg-opacity-20 rounded-xl space-y-2">
            <p><strong>🧮 Your Share of Supply:</strong> {results.userTokenAmount} tokens</p>
            <p><strong>💰 Your Estimated Tokens Worth:</strong> ${results.estimatedWorth}</p>
            <p><strong>🎯 Genesis PPR:</strong> {results.ppr}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenesisPPR;
