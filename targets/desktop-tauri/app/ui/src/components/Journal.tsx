import React, { useState } from 'react';
import { ToolCompletionData } from '../lib/types';

interface JournalProps {
  onComplete: (data: ToolCompletionData) => void;
}

export default function Journal({ onComplete }: JournalProps) {
  const [entry, setEntry] = useState('');
  const [preSuds, setPreSuds] = useState(5);
  const [postSuds, setPostSuds] = useState(5);
  const [startTime] = useState(Date.now());

  const promptQuestions = [
    "What am I feeling right now?",
    "What triggered this feeling or situation?", 
    "What would I tell a friend in this situation?",
    "What am I grateful for today?",
    "What did I learn about myself today?",
    "How can I practice self-compassion right now?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (entry.trim().length < 10) {
      alert('Please write at least a few sentences to get the most benefit from journaling.');
      return;
    }

    const completionData: ToolCompletionData = {
      action: 'JOURNAL',
      pre_suds: preSuds,
      post_suds: postSuds,
      completed: true,
      duration_minutes: (Date.now() - startTime) / (1000 * 60),
      notes: `Entry length: ${entry.length} characters`
    };

    onComplete(completionData);
  };

  const insertPrompt = (question: string) => {
    const newText = entry + (entry ? '\n\n' : '') + question + '\n';
    setEntry(newText);
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📝 Journal</h2>
        <p className="text-gray-600 text-sm">
          Express your thoughts and feelings. Writing helps process emotions and gain clarity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SUDS Rating - Pre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current distress level (0-10 SUDS):
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={preSuds}
            onChange={(e) => setPreSuds(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Calm (0)</span>
            <span className="font-medium">{preSuds}</span>
            <span>Extreme distress (10)</span>
          </div>
        </div>

        {/* Prompt Questions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-3">Journal prompts (click to add):</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {promptQuestions.map((question, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertPrompt(question)}
                className="text-left text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-2 rounded transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Journal Entry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your thoughts:
          </label>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Start writing about your thoughts, feelings, or experiences..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {entry.length} characters
          </div>
        </div>

        {/* SUDS Rating - Post */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distress level after writing (0-10 SUDS):
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={postSuds}
            onChange={(e) => setPostSuds(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Calm (0)</span>
            <span className="font-medium">{postSuds}</span>
            <span>Extreme distress (10)</span>
          </div>
        </div>

        {/* Completion */}
        <div className="flex space-x-4">
          <button 
            type="submit"
            className="flex-1 btn-primary py-3"
            disabled={entry.trim().length < 10}
          >
            Complete Journal Entry
          </button>
        </div>
      </form>

      {/* Benefits reminder */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <h4 className="font-medium text-blue-800 mb-2">Why journaling helps:</h4>
        <ul className="text-blue-700 space-y-1 text-xs">
          <li>• Processes difficult emotions and experiences</li>
          <li>• Identifies patterns in thoughts and behaviors</li>
          <li>• Reduces stress and improves mental clarity</li>
          <li>• Tracks personal growth and recovery progress</li>
        </ul>
      </div>
    </div>
  );
}