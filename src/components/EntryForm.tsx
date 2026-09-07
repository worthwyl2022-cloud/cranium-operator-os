import { useState, FormEvent } from 'react';
import { Bot, Save } from 'lucide-react';

export default function EntryForm() {
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [emotion, setEmotion] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ situation, thought, emotion });
    // TODO: Connect to database/core
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Bot className="w-5 h-5" />
        New Reflection
      </h2>
      <input 
        type="text" 
        placeholder="Situation..." 
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        className="w-full p-3 rounded-lg border border-neutral-200"
      />
      <textarea 
        placeholder="Thought..." 
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        className="w-full p-3 rounded-lg border border-neutral-200 h-24"
      />
      <input 
        type="text" 
        placeholder="Emotion..." 
        value={emotion}
        onChange={(e) => setEmotion(e.target.value)}
        className="w-full p-3 rounded-lg border border-neutral-200"
      />
      <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition">
        <Save className="w-4 h-4" />
        Log Entry
      </button>
    </form>
  );
}
