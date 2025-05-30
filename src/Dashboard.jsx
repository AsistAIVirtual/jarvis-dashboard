import { useState } from 'react';

export default function Dashboard() {
  const [wallet, setWallet] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [volumeData, setVolumeData] = useState(null);
  const [search, setSearch] = useState('');

  const handleVolumeFetch = async () => {
    if (!wallet || !startDate || !endDate) {
      alert('Please enter wallet and date range.');
      return;
    }

    const virtualTokenAddress = '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b';
    const apiKey = 'MA9MEETHKKBPXMBKSGRYE4E6CBIERXS3EJ';

    try {
      const res = await fetch(`https://api.basescan.org/api?module=account&action=tokentx&address=${wallet}&sort=desc&apikey=${apiKey}`);
      const data = await res.json();

      if (data.status !== "1") {
        setVolumeData({ error: "No transactions found or invalid address." });
        return;
      }

      const start = new Date(startDate).getTime() / 1000;
      const end = new Date(endDate).getTime() / 1000;

      const txInRange = data.result.filter(tx =>
        tx.contractAddress.toLowerCase() === virtualTokenAddress.toLowerCase() &&
        (wallet.toLowerCase() === tx.from.toLowerCase() || wallet.toLowerCase() === tx.to.toLowerCase()) &&
        parseInt(tx.timeStamp) >= start &&
        parseInt(tx.timeStamp) <= end
      );

      const totalVirtual = txInRange.reduce((sum, tx) => {
        return sum + parseFloat(tx.value) / Math.pow(10, tx.tokenDecimal);
      }, 0);

      // VIRTUAL Token USD fiyatı (CoinGecko)
      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=${virtualTokenAddress}&vs_currencies=usd`);
      const priceData = await priceRes.json();
      const usdPrice = priceData[virtualTokenAddress.toLowerCase()]?.usd || 0;
      const totalUsd = totalVirtual * usdPrice;

      setVolumeData({
        volume: `${totalVirtual.toFixed(4)} VIRTUAL`,
        usd: `$${totalUsd.toFixed(2)} USD`,
        transactions: txInRange.length,
      });

    } catch (err) {
      console.error(err);
      setVolumeData({ error: "API error — Calm down Virgen you can't Jeet the button Please wait a moment and try again." });
    }
  };

  const fakeTokens = [
    { name: 'Token A', unlockTime: '2 days' },
    { name: 'Token B', unlockTime: '5 days' },
    { name: 'Token C', unlockTime: '10 days' },
  ];

  const filteredTokens = fakeTokens
    .filter((token) => token.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => parseInt(a.unlockTime) - parseInt(b.unlockTime));

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Jarvis Dashboard</h1>

      <div className="max-w-xl mx-auto space-y-8">
        {/* DAILY VOLUME */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Daily Volume</h2>

          <input
            className="w-full p-2 rounded text-black mb-2"
            placeholder="Enter Wallet Address"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />

          <div className="flex gap-2 mb-2">
            <div className="flex flex-col flex-1">
              <label className="text-sm">Start Date</label>
              <input
                type="date"
                className="p-2 text-black rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm">End Date</label>
              <input
                type="date"
                className="p-2 text-black rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleVolumeFetch}
            className="mt-2 bg-blue-600 px-4 py-2 rounded text-white"
          >
            Check Volume
          </button>

          {volumeData && (
            <div className="mt-4 space-y-1">
              {volumeData.error ? (
                <p className="text-red-400">{volumeData.error}</p>
              ) : (
                <>
                  <p>Transactions: <strong>{volumeData.transactions}</strong></p>
                  <p>Volume: <strong>{volumeData.volume}</strong></p>
                  <p>USD Value: <strong>{volumeData.usd}</strong></p>
                </>
              )}
            </div>
          )}
        </div>

        {/* GREEN LOCK PERIOD */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Green Lock Period</h2>
          <input
            className="w-full p-2 rounded text-black"
            placeholder="Search Token"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="mt-2 space-y-1">
            {filteredTokens.map((token, index) => (
              <li key={index} className="flex justify-between">
                <span>{token.name}</span>
                <span>{token.unlockTime}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
