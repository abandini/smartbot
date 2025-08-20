import React, { useState } from 'react';
import { UserState } from '../lib/types';
import { getMoodDescription, getStressDescription, getUrgeDescription } from '../lib/features';

interface CheckInProps {
  onComplete: (state: Partial<UserState>) => void;
  currentState?: UserState;
}

export default function CheckIn({ onComplete, currentState }: CheckInProps) {
  const [mood, setMood] = useState(currentState?.mood ?? 0.5);
  const [stress, setStress] = useState(currentState?.stress ?? 0.5);
  const [urgeLevel, setUrgeLevel] = useState(currentState?.urge_level ?? 0.3);
  const [energy, setEnergy] = useState(currentState?.energy ?? 0.6);
  const [sleepQuality, setSleepQuality] = useState(currentState?.sleep_quality ?? 0.7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedState: Partial<UserState> = {
      mood,
      stress,
      urge_level: urgeLevel,
      energy,
      sleep_quality: sleepQuality
    };

    onComplete(updatedState);
  };

  const SliderInput = ({ 
    label, 
    value, 
    onChange, 
    description 
  }: { 
    label: string;
    value: number;
    onChange: (value: number) => void;
    description: string;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="w-20 text-right">
          <span className="text-sm font-medium text-gray-600">
            {description}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Check-In</h2>
        <p className="text-gray-600 text-sm">
          Help Smartbot understand your current state to provide better recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SliderInput
          label="Mood"
          value={mood}
          onChange={setMood}
          description={getMoodDescription(mood)}
        />

        <SliderInput
          label="Stress Level"
          value={stress}
          onChange={setStress}
          description={getStressDescription(stress)}
        />

        <SliderInput
          label="Urge Level"
          value={urgeLevel}
          onChange={setUrgeLevel}
          description={getUrgeDescription(urgeLevel)}
        />

        <SliderInput
          label="Energy"
          value={energy}
          onChange={setEnergy}
          description={energy < 0.3 ? 'Low' : energy < 0.7 ? 'Moderate' : 'High'}
        />

        <SliderInput
          label="Sleep Quality (last night)"
          value={sleepQuality}
          onChange={setSleepQuality}
          description={sleepQuality < 0.3 ? 'Poor' : sleepQuality < 0.7 ? 'Fair' : 'Good'}
        />

        <button 
          type="submit"
          className="w-full btn-primary py-3 text-lg"
        >
          Complete Check-In
        </button>
      </form>
    </div>
  );
}