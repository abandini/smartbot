import React, { useState } from 'react';
import { ToolCompletionData } from '../lib/types';

interface UrgeLogProps {
  onComplete: (data: ToolCompletionData) => void;
}

export default function UrgeLog({ onComplete }: UrgeLogProps) {
  const [urgeIntensity, setUrgeIntensity] = useState(5);
  const [finalIntensity, setFinalIntensity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [location, setLocation] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [feelings, setFeelings] = useState('');
  const [behaviors, setBehaviors] = useState('');
  const [copingStrategy, setCopingStrategy] = useState('');
  const [startTime] = useState(Date.now());

  const commonTriggers = [
    'Stress at work', 'Relationship conflict', 'Boredom', 'Social pressure',
    'Physical pain', 'Loneliness', 'Celebration/good news', 'Financial worry',
    'Seeing others use', 'Certain locations', 'Specific people', 'Time of day'
  ];

  const copingStrategies = [
    'Deep breathing', 'Called support person', 'Exercise/movement', 'Distraction activity',
    'HALT check (Hungry/Angry/Lonely/Tired)', 'Played music', 'Went for walk',
    'Used grounding techniques', 'Positive self-talk', 'Removed myself from situation'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trigger.trim() || !thoughts.trim()) {
      alert('Please fill in the trigger and thoughts fields to track patterns effectively.');
      return;
    }

    const completionData: ToolCompletionData = {
      action: 'URGELOG',
      pre_suds: urgeIntensity,
      post_suds: finalIntensity,
      completed: true,
      duration_minutes: (Date.now() - startTime) / (1000 * 60),
      notes: `Trigger: ${trigger}. Strategy: ${copingStrategy || 'None recorded'}`
    };

    onComplete(completionData);
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Urge Log</h2>
        <p className="text-gray-600 text-sm">
          Track urges to identify patterns and effective coping strategies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Initial Urge Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urge intensity when it started (0-10):
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={urgeIntensity}
            onChange={(e) => setUrgeIntensity(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>No urge (0)</span>
            <span className="font-medium">{urgeIntensity}</span>
            <span>Overwhelming (10)</span>
          </div>
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What triggered this urge? *
          </label>
          <input
            type="text"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder="Describe the situation or event that triggered the urge..."
            className="form-input mb-3"
            required
          />
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-2">Common triggers (click to use):</p>
            <div className="flex flex-wrap gap-2">
              {commonTriggers.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrigger(t)}
                  className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where were you?
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Home, work, social event, etc."
            className="form-input"
          />
        </div>

        {/* Thoughts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What thoughts went through your mind? *
          </label>
          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="What were you thinking about? Any specific thoughts about using?"
            rows={3}
            className="form-input"
            required
          />
        </div>

        {/* Feelings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What emotions were you experiencing?
          </label>
          <textarea
            value={feelings}
            onChange={(e) => setFeelings(e.target.value)}
            placeholder="Angry, sad, anxious, excited, bored, etc."
            rows={2}
            className="form-input"
          />
        </div>

        {/* Behaviors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did you do in response?
          </label>
          <textarea
            value={behaviors}
            onChange={(e) => setBehaviors(e.target.value)}
            placeholder="Actions you took, how you responded to the urge..."
            rows={2}
            className="form-input"
          />
        </div>

        {/* Coping Strategy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What coping strategy did you use?
          </label>
          <input
            type="text"
            value={copingStrategy}
            onChange={(e) => setCopingStrategy(e.target.value)}
            placeholder="How did you cope with or manage the urge?"
            className="form-input mb-3"
          />
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-2">Healthy coping strategies:</p>
            <div className="flex flex-wrap gap-2">
              {copingStrategies.map((strategy) => (
                <button
                  key={strategy}
                  type="button"
                  onClick={() => setCopingStrategy(strategy)}
                  className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  {strategy}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Final Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urge intensity now (0-10):
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={finalIntensity}
            onChange={(e) => setFinalIntensity(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>No urge (0)</span>
            <span className="font-medium">{finalIntensity}</span>
            <span>Overwhelming (10)</span>
          </div>
          {finalIntensity < urgeIntensity && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Great job! Your urge intensity decreased by {urgeIntensity - finalIntensity} points.
            </p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full btn-primary py-3"
        >
          Save Urge Log
        </button>
      </form>

      {/* Learning reminder */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <h4 className="font-medium text-yellow-800 mb-2">Why track urges:</h4>
        <ul className="text-yellow-700 space-y-1 text-xs">
          <li>• Identify personal triggers and high-risk situations</li>
          <li>• Recognize patterns in thoughts, feelings, and behaviors</li>
          <li>• Discover which coping strategies work best for you</li>
          <li>• Build awareness that urges pass and can be managed</li>
        </ul>
      </div>
    </div>
  );
}