import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import greenLockData from './data/greenLockData.json';
import stakedDataRaw from './data/stakedData.json';
import { FaTwitter } from 'react-icons/fa';

export default function Dashboard() {
  const [wallet, setWallet] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [volumeData, setVolumeData] = useState(null);
  const [search, setSearch] = useState('');
  const [showSection, setShowSection] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [Xusername, setXusername] = useState('');
  const [agreeToNotify, setAgreeToNotify] = useState(false);
  const [userWallet, setUserWallet] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [reminderDays, setReminderDays] = useState('');
  const [eligibility, setEligibility] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15;
  const YOUR_TOKEN_ADDRESS = '0xa72fB1A92A1489a986fE1d27573F4F6a1bA83dBe';
  const TOKEN_THRESHOLD_SINGLE = 200000;
  const TOKEN_THRESHOLD_MULTIPLE = 500000;
  const apiKey = 'MA9MEETHKKBPXMBKSGRYE4E6CBIERXS3EJ';

  const checkEligibility = async () => {
    if (!userWallet) return;
    try {
      const res = await fetch(`https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=${YOUR_TOKEN_ADDRESS}&address=${userWallet}&tag=latest&apikey=${apiKey}`);
      const data = await res.json();
      if (data.status !== "1") {
        setEligibility('API error');
        return;
      }
      const tokenBalance = parseFloat(data.result) / 1e18;
      if (tokenBalance >= TOKEN_THRESHOLD_MULTIPLE) {
        setEligibility('Eligible for up to 3 reminders');
      } else if (tokenBalance >= TOKEN_THRESHOLD_SINGLE) {
        setEligibility('Eligible for 1 reminder');
      } else {
        setEligibility('Not eligible — requires 50,000+ tokens');
      }
    } catch (err) {
      setEligibility('API error');
    }
  };

  const today = new Date();
  const daysSince = (dateString) => {
    const past = new Date(dateString);
    const diffTime = Math.abs(today - past);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const tokens = greenLockData.map(token => ({ ...token, unlockTime: Math.max(0, token.baseUnlock - daysSince(token.date)) }));
  const filteredBySearch = tokens.filter(token =>
    token.name.toLowerCase().includes(search.toLowerCase()) ||
    token.ticker.toLowerCase().includes(search.toLowerCase())
  );
  const filteredByDays = filteredBySearch.filter(token => {
    if (filterOption === 'under7') return token.unlockTime <= 7;
    if (filterOption === 'under22') return token.unlockTime <= 22;
    return true;
  });
  const sortedTokens = [...filteredByDays].sort((a, b) => sortOrder === 'asc' ? a.unlockTime - b.unlockTime : b.unlockTime - a.unlockTime);

  const handleVolumeFetch = async () => {
    if (!wallet || !startDate || !endDate) {
      alert('Please enter wallet and date range.');
      return;
    }
    const virtualTokenAddress = '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b';
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
      setVolumeData({ error: "API error — Please wait and try again." });
    }
  };

  const tokenOptions = [...new Set(greenLockData.map(token => token.name))];
  const stakedData = stakedDataRaw.sort((a, b) => b.total_staked - a.total_staked);
  const totalPages = Math.ceil(stakedData.length / itemsPerPage);
  const paginatedData = stakedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: 'url(/images/nwbckgrnd.png)' }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl italic font-bold">Virgenscan</h1>
        </div>
        <div className="text-center mx-auto">
          <p className="text-lg italic">$JARVIS is live.</p>
          <p className="text-sm italic mt-1">Official CA: 0x1E562BF73369D1d5B7E547b8580039E1f05cCc56</p>
          <a href="https://app.virtuals.io/virtuals/28325" target="_blank" rel="noopener noreferrer">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow mt-2">TRADE $JARVIS</button>
          </a>
        </div>
        <div>
          <a href="https://x.com/JarvisAgentAi" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-2xl hover:text-blue-500" />
          </a>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mb-10">
        <button onClick={() => setShowSection('volume')} className={`px-4 py-2 rounded ${showSection === 'volume' ? 'bg-blue-600' : 'bg-gray-600'}`}>Daily Volume</button>
        <button onClick={() => setShowSection('greenlock')} className={`px-4 py-2 rounded ${showSection === 'greenlock' ? 'bg-blue-600' : 'bg-gray-600'}`}>Green Lock Period</button>
        <button onClick={() => setShowSection('subscribe')} className={`px-4 py-2 rounded ${showSection === 'subscribe' ? 'bg-blue-600' : 'bg-gray-600'}`}>Subscribe Unlock Period</button>
        <button onClick={() => setShowSection('agents')} className={`px-4 py-2 rounded ${showSection === 'agents' ? 'bg-blue-600' : 'bg-gray-600'}`}>Agent Market (coming soon)</button>
        <button onClick={() => setShowSection('staked')} className={`px-4 py-2 rounded ${showSection === 'staked' ? 'bg-blue-600' : 'bg-gray-600'}`}>Total Staked Agents</button>
      </div>

      {showSection === 'volume' && (
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Daily Volume</h2>
          <input className="w-full p-2 rounded text-black mb-2" placeholder="Enter Wallet Address" value={wallet} onChange={(e) => setWallet(e.target.value)} />
          <div className="flex gap-2 mb-2">
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd.MM.yyyy" className="p-2 text-black rounded w-full" placeholderText="Start Date" />
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd.MM.yyyy" className="p-2 text-black rounded w-full" placeholderText="End Date" />
          </div>
          <button onClick={handleVolumeFetch} className="bg-blue-600 px-4 py-2 rounded">Check Volume</button>
          {volumeData && (
            <div className="mt-4">
              {volumeData.error ? (
                <p className="text-red-400">{volumeData.error}</p>
              ) : (
                <div>
                  <p>Transactions: {volumeData.transactions}</p>
                  <p>Volume: {volumeData.volume}</p>
                  <p>USD Value: {volumeData.usd}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showSection === 'greenlock' && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Green Lock Tokens</h2>
          <input className="w-full p-2 rounded text-black mb-4" placeholder="Search Token" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex space-x-2 mb-4">
            <button onClick={() => setFilterOption('all')} className={`px-3 py-1 rounded ${filterOption === 'all' ? 'bg-blue-500' : 'bg-gray-600'}`}>All</button>
            <button onClick={() => setFilterOption('under7')} className={`px-3 py-1 rounded ${filterOption === 'under7' ? 'bg-blue-500' : 'bg-gray-600'}`}>Under 7 Days</button>
            <button onClick={() => setFilterOption('under22')} className={`px-3 py-1 rounded ${filterOption === 'under22' ? 'bg-blue-500' : 'bg-gray-600'}`}>Under 22 Days</button>
            <button onClick={() => setSortOrder('asc')} className={`px-3 py-1 rounded ${sortOrder === 'asc' ? 'bg-green-500' : 'bg-gray-600'}`}>Sort ↑</button>
            <button onClick={() => setSortOrder('desc')} className={`px-3 py-1 rounded ${sortOrder === 'desc' ? 'bg-green-500' : 'bg-gray-600'}`}>Sort ↓</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sortedTokens.map((token, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                <img src={token.image} alt={token.name} className="w-16 h-16 mx-auto rounded-full mb-2 object-cover" />
                <h3 className="text-lg font-semibold">{token.name}</h3>
                <p className="text-sm text-gray-400">${token.ticker}</p>
                <p className="text-2xl font-bold my-2">{token.unlockTime}</p>
                <p className="text-sm">Days to Unlock</p>
                <p className="mt-2 text-green-400 text-sm">{token.participants} participants</p>
                <p className="text-green-400 text-sm">{token.oversub} Sub</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSection === 'subscribe' && (
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Subscribe to Unlock Reminder</h2>
          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Enter Token Name" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} list="tokenList" />
          <datalist id="tokenList">
            {tokenOptions.map((token, index) => (
              <option key={index} value={token} />
            ))}
          </datalist>
          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Enter Xusername" value={Xusername} onChange={(e) => setXusername(e.target.value)} />
          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Enter Your Wallet Address" value={userWallet} onChange={(e) => setUserWallet(e.target.value)} onBlur={checkEligibility} />
          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Reminder Days Before Unlock" value={reminderDays} onChange={(e) => setReminderDays(e.target.value)} />
          {eligibility && <p className="mb-2 text-green-400">{eligibility}</p>}
          <div className="mb-2">
            <label>
              <input type="checkbox" checked={agreeToNotify} onChange={(e) => setAgreeToNotify(e.target.checked)} className="mr-2" />
              I agree to be notified before unlock date
            </label>
          </div>
          <button className="bg-blue-600 px-4 py-2 rounded">Subscribe</button>
        </div>
      )}

      {showSection === 'staked' && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Total Staked Agents</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 border">Agent</th>
                <th className="p-2 border">Total Staked</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="odd:bg-gray-800 even:bg-gray-900">
                  <td className="p-2 border">{item.agent}</td>
                  <td className="p-2 border">{item.total_staked.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
