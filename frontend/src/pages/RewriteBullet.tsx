import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';

export function RewriteBullet() {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const { showToast } = useToast();

  const handleRewrite = async () => {
    if (!text.trim()) {
      showToast('error', 'Please enter a bullet');
      return;
    }
    try {
      const res = await api.rewriteBullet(text.trim());
      setSuggestions(res.alternatives);
      setSelected('');
    } catch {
      showToast('error', 'Failed to rewrite bullet');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rewrite Bullet</h1>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a resume bullet"
      />
      <button
        onClick={handleRewrite}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Get Suggestions
      </button>
      {suggestions.length > 0 && (
        <ul className="mt-4 space-y-2">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                className="w-full text-left border rounded p-2 hover:bg-gray-100"
                onClick={() => setSelected(s)}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Selected rewrite</h2>
          <p className="p-2 border rounded bg-gray-50 dark:bg-gray-800">{selected}</p>
        </div>
      )}
    </div>
  );
}

export default RewriteBullet;
