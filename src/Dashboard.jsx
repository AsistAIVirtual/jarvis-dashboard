
import { useState, useEffect } from 'react';
import GenesisPPR from './components/GenesisPPR';

export default function Dashboard() {
  const [showSection, setShowSection] = useState('');

  return (
    <div className="min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: 'url(/images/nwbckgrnd.png)' }}>
      <div className="flex justify-center space-x-2 mb-10">
        <button onClick={() => setShowSection('Genesis Point Calculator')} className={`px-4 py-2 rounded ${showSection === 'Genesis Point Calculator' ? 'bg-blue-600' : 'bg-gray-600'}`}>Genesis Point Calculator</button>
      </div>

      {showSection === 'Genesis Point Calculator' && <GenesisPPR />}
    </div>
  );
}
