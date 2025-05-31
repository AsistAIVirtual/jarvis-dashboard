import { useState } from 'react';
import DatePicker from 'react-datepicker';
import './styles/react-datepicker-fix.css';


export default function Dashboard() {
  const [wallet, setWallet] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [volumeData, setVolumeData] = useState(null);
  const [search, setSearch] = useState('');
  const [showVolume, setShowVolume] = useState(true);

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

  const realTokens = [
    { name: 'Verdant', ticker: 'VDNT', unlockTime: '29', image: '/images/verdant.png', participants: '6,557', oversub: '801.61%' },
    { name: 'Solace', ticker: 'SOLACE', unlockTime: '120', image: '/images/solace.png', participants: '12,579', oversub: '2,541.05%' },
    { name: 'artith', ticker: 'ART', unlockTime: '183', image: '/images/artith.png', participants: '2,078', oversub: '378.99%' },
    { name: 'Bookie AI', ticker: 'BOOKIE', unlockTime: '90', image: '/images/bookie.png', participants: '9,348', oversub: '1,435.17%' },
    { name: 'Magnus Opus', ticker: 'MAGNUS', unlockTime: '27', image: '/images/magnus.png', participants: '5,640', oversub: '827.45%' },
    { name: 'VirgenIQ', ticker: 'VIQ', unlockTime: '20', image: '/images/virgeniq.png', participants: '724', oversub: '136.27%' },
    { name: 'STAKE', ticker: 'STAKE', unlockTime: '189', image: '/images/stake.png', participants: '845', oversub: '196.35%' },
    { name: 'AInalyst', ticker: 'AIN', unlockTime: '26', image: '/images/ainalyst.png', participants: '3,809', oversub: '560.70%' },
    { name: 'MAKE VIRGEN GREAT AG...', ticker: 'MVGA', unlockTime: null, image: '/images/mvga.png', participants: '843', oversub: '204.19%' },
    { name: 'Hello AI', ticker: 'HELLO', unlockTime: '24', image: '/images/helloai.png', participants: '1,893', oversub: '326.32%' },
    { name: 'NOTHING', ticker: 'NOTHING', unlockTime: '7884', image: '/images/nothing.png', participants: '1,138', oversub: '247.16%' },
    { name: 'XOE', ticker: 'XOE', unlockTime: '177', image: '/images/xoe.png', participants: '2,363', oversub: '388.15%' },
    { name: 'RoboStack', ticker: 'ROBOT', unlockTime: '23', image: '/images/robostack.png', participants: '5,147', oversub: '1,238.45%' },
    { name: 'MindYaps', ticker: 'MNY', unlockTime: '182', image: '/images/mindyaps.png', participants: '810', oversub: '185.41%' },
    { name: 'Capminal', ticker: 'CAP', unlockTime: '23', image: '/images/capminal.png', participants: '1,897', oversub: '356.09%' },
    { name: 'nAIncy', ticker: 'NAINCY', unlockTime: '23', image: '/images/naincy.png', participants: '6,664', oversub: '1,584.40%' },
    { name: 'VIRGEN', ticker: 'VIRGEN', unlockTime: '23', image: '/images/virgen.png', participants: '5,904', oversub: '1,484.58%' },
    { name: 'Bizzy', ticker: 'BIZ', unlockTime: '82', image: '/images/bizzy.png', participants: '5,279', oversub: '1,345.95%' },
    { name: 'Maneki AI', ticker: 'MANEKI', unlockTime: '19', image: '/images/maneki.png', participants: '4,929', oversub: '938.98%' },
    { name: 'Arbus', ticker: 'ARBUS', unlockTime: '18', image: '/images/arbus.png', participants: '7,482', oversub: '1,808.19%' }
  ];

  const filteredTokens = realTokens.filter((token) => {
    const searchText = search.toLowerCase();
    return (
      token.name.toLowerCase().includes(searchText) ||
      token.ticker.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Jarvis Dashboard</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${showVolume ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setShowVolume(true)}
          >
            Daily Volume
          </button>
          <button
            className={`px-4 py-2 rounded ${!showVolume ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setShowVolume(false)}
          >
            Green Lock Period
          </button>
        </div>

        {showVolume && (
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
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd.MM.yyyy"
                  className="p-2 text-black rounded"
                  placeholderText="dd.mm.yyyy"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd.MM.yyyy"
                  className="p-2 text-black rounded"
                  placeholderText="dd.mm.yyyy"
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
        )}

        {!showVolume && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Green Lock Period</h2>
            <input
              className="w-full p-2 rounded text-black"
              placeholder="Search Token"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {filteredTokens.map((token, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                  <img src={token.image} alt={token.name} className="w-16 h-16 mx-auto rounded-full mb-2 object-cover" />
                  <h3 className="text-lg font-semibold">{token.name}</h3>
                  <p className="text-sm text-gray-400">${token.ticker}</p>
                  <p className="text-2xl font-bold my-2">{token.unlockTime ? `${token.unlockTime}` : 'N/A'}</p>
                  <p className="text-sm">Days to Unlock</p>
                  <p className="mt-2 text-green-400 text-sm">{token.participants} participants</p>
                  <p className="text-green-400 text-sm">{token.oversub} Sub</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
