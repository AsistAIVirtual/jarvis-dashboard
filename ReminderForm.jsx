import { useState } from 'react';

const tokenList = [
  {
    name: 'JARVIS',
    symbol: 'JVS',
    contractAddress: '0x1E562BF73369D1d5B7E547b8580039E1f05cCc56',
    unlockDate: '2025-06-30'
  },
  {
    name: 'VIRTUAL',
    symbol: 'VIR',
    contractAddress: '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b',
    unlockDate: '2025-07-15'
  }
];

export default function ReminderForm() {
  const [username, setUsername] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState(null);

  const checkStake = async (walletAddress) => {
    const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
    const tokenAddress = '0x1E562BF73369D1d5B7E547b8580039E1f05cCc56';
    const stakingContract = '0xa72fB1A92A1489a986fE1d27573F4F6a1bA83dBe';

    try {
      const res = await fetch(`https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${walletAddress}&tag=latest&apikey=${apiKey}`);
      const data = await res.json();
      const raw = data?.result;
      if (!raw || isNaN(raw)) return false;
      const amount = parseFloat(raw) / 1e18;
      return amount >= 100000;
    } catch (err) {
      console.error('Stake check failed', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Checking stake...');

    const stakedEnough = await checkStake(walletAddress);
    if (!stakedEnough) {
      setStatus("Sorry, you haven't staked enough $JARVIS to receive unlock alerts, Virgen.");
      return;
    }

    setStatus('Sending...');

    const response = await fetch('/api/tweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, tokenName: selectedToken }),
    });

    const data = await response.json();
    if (data.success) {
      setStatus('Tweet sent successfully ✅');
    } else {
      setStatus('Failed to send tweet ❌');
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <form onSubmit={handleSubmit}>
        <label>
          Select Token:
          <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)} required>
            <option value="">--Select a token--</option>
            {tokenList.map((token) => (
              <option key={token.contractAddress} value={token.name}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Enter X Username:
          <input
            type="text"
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Enter Wallet Address:
          <input
            type="text"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Subscribe</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
