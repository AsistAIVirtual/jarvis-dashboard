import { useState } from 'react';

export default function ReminderForm() {
  const [username, setUsername] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const response = await fetch('/api/tweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, tokenName }),
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
        <input
          type="text"
          placeholder="@username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Token name (optional)"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
        <button type="submit">Send Reminder</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
