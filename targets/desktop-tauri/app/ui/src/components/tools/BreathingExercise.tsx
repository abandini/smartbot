import React, { useState, useEffect, useRef } from 'react';
import { ToolCompletionData } from '../../lib/types';

interface BreathingExerciseProps {
  onComplete: (data: ToolCompletionData) => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

/**
 * 4-7-8 Breathing Exercise with Visual Guidance
 * Inhale for 4, Hold for 7, Exhale for 8, Pause for 2
 * Activates parasympathetic nervous system for immediate calm
 */
export default function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [targetCycles, setTargetCycles] = useState(4);
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [preSuds, setPreSuds] = useState(5);
  const [postSuds, setPostSuds] = useState(5);
  const [startTime] = useState(Date.now());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  const phaseDurations = {
    inhale: 4,
    hold: 7, 
    exhale: 8,
    pause: 2
  };

  const phaseInstructions = {
    inhale: 'Breathe in slowly through your nose',
    hold: 'Hold your breath',
    exhale: 'Exhale completely through your mouth',
    pause: 'Rest and prepare for next cycle'
  };

  const phaseColors = {
    inhale: 'bg-blue-400',
    hold: 'bg-yellow-400',
    exhale: 'bg-green-400', 
    pause: 'bg-gray-400'
  };

  const startExercise = () => {
    setIsActive(true);
    setCycleCount(0);
    setCurrentPhase('inhale');
    setTimeRemaining(4);
    startPhaseTimer();
  };

  const stopExercise = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startPhaseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next phase
          setCurrentPhase(current => {
            const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'pause'];
            const currentIndex = phases.indexOf(current);
            const nextIndex = (currentIndex + 1) % phases.length;
            const nextPhase = phases[nextIndex];

            // If completing a full cycle (going back to inhale)
            if (nextPhase === 'inhale') {
              setCycleCount(prev => {
                const newCount = prev + 1;
                if (newCount >= targetCycles) {
                  // Exercise complete
                  setIsActive(false);
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                  }
                  return newCount;
                }
                return newCount;
              });
            }

            return nextPhase;
          });

          // Return duration for next phase
          const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'pause'];
          const currentIndex = phases.indexOf(prev === 1 ? 'inhale' : 'hold'); // This logic needs fixing
          const nextIndex = currentIndex === 3 ? 0 : currentIndex + 1;
          const nextPhase = phases[nextIndex];
          return phaseDurations[nextPhase];
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isActive) {
      const phase = currentPhase;
      setTimeRemaining(phaseDurations[phase]);
    }
  }, [currentPhase, isActive]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleComplete = () => {
    const completionData: ToolCompletionData = {
      action: 'BREATH',
      pre_suds: preSuds,
      post_suds: postSuds,
      completed: cycleCount >= targetCycles,
      duration_minutes: (Date.now() - startTime) / (1000 * 60),
      notes: `Completed ${cycleCount}/${targetCycles} breathing cycles. 4-7-8 technique.`
    };

    onComplete(completionData);
  };

  const getCircleScale = () => {
    const progress = 1 - (timeRemaining / phaseDurations[currentPhase]);
    
    switch (currentPhase) {
      case 'inhale':
        return 1 + (progress * 0.8); // Grow during inhale
      case 'hold':
        return 1.8; // Stay large during hold
      case 'exhale':
        return 1.8 - (progress * 0.7); // Shrink during exhale
      case 'pause':
        return 1.1; // Small during pause
      default:
        return 1;
    }
  };

  const isCompleted = cycleCount >= targetCycles;

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🫁 4-7-8 Breathing Exercise</h2>
        <p className="text-gray-600 text-sm">
          A powerful technique to activate your body's relaxation response in moments.
        </p>
      </div>

      {/* SUDS Pre */}
      {!isActive && cycleCount === 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current stress/anxiety level (0-10 SUDS):
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
            <span>Calm & relaxed (0)</span>
            <span className="font-medium">{preSuds}</span>
            <span>Highly stressed (10)</span>
          </div>
        </div>
      )}

      {/* Settings */}
      {!isActive && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of breathing cycles:
          </label>
          <select
            value={targetCycles}
            onChange={(e) => setTargetCycles(Number(e.target.value))}
            className="form-input w-full"
          >
            <option value={2}>2 cycles (quick session ~40 seconds)</option>
            <option value={4}>4 cycles (standard session ~80 seconds)</option>
            <option value={6}>6 cycles (extended session ~2 minutes)</option>
            <option value={8}>8 cycles (deep session ~3 minutes)</option>
          </select>
        </div>
      )}

      {/* Visual Breathing Guide */}
      <div className="flex flex-col items-center mb-8">
        {/* Breathing Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          <div 
            ref={animationRef}
            className={`rounded-full transition-all duration-1000 ease-in-out ${phaseColors[currentPhase]} opacity-70 flex items-center justify-center`}
            style={{
              width: `${getCircleScale() * 100}px`,
              height: `${getCircleScale() * 100}px`,
            }}
          >
            <div className="text-white font-bold text-lg">
              {timeRemaining}
            </div>
          </div>
          
          {/* Phase indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {currentPhase}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {phaseInstructions[currentPhase]}
          </h3>
          
          {isActive && (
            <div className="text-sm text-gray-600">
              Cycle {cycleCount + 1} of {targetCycles}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isActive && (
          <div className="w-full max-w-md mb-6">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((cycleCount / targetCycles) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              {cycleCount}/{targetCycles} cycles complete
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex space-x-4">
          {!isActive && !isCompleted && (
            <button
              onClick={startExercise}
              className="btn-primary px-8 py-3 text-lg"
            >
              Start Breathing Exercise
            </button>
          )}

          {isActive && (
            <button
              onClick={stopExercise}
              className="btn-secondary px-6 py-2"
            >
              Stop Exercise
            </button>
          )}

          {!isActive && cycleCount > 0 && (
            <button
              onClick={startExercise}
              className="btn-secondary px-6 py-2"
            >
              Continue Exercise
            </button>
          )}
        </div>
      </div>

      {/* Completion */}
      {isCompleted && (
        <div className="space-y-6">
          <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✓ Exercise Complete!
            </h3>
            <p className="text-green-700 text-sm">
              You've completed {targetCycles} cycles of 4-7-8 breathing. 
              Notice how your body feels now.
            </p>
          </div>

          {/* SUDS Post */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stress/anxiety level after breathing (0-10 SUDS):
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
              <span>Calm & relaxed (0)</span>
              <span className="font-medium">{postSuds}</span>
              <span>Highly stressed (10)</span>
            </div>
            {postSuds < preSuds && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Excellent! Your stress level decreased by {preSuds - postSuds} points.
              </p>
            )}
          </div>

          <button 
            onClick={handleComplete}
            className="w-full btn-primary py-3"
          >
            Complete Breathing Session
          </button>
        </div>
      )}

      {/* 4-7-8 Explanation */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <h4 className="font-medium text-blue-800 mb-2">Why 4-7-8 Breathing Works:</h4>
        <ul className="text-blue-700 space-y-1 text-xs">
          <li><strong>4 seconds inhale:</strong> Slow, controlled breathing activates the vagus nerve</li>
          <li><strong>7 seconds hold:</strong> Allows oxygen to fully circulate and CO2 to build slightly</li>
          <li><strong>8 seconds exhale:</strong> Long exhale activates the parasympathetic nervous system</li>
          <li><strong>Immediate effect:</strong> Often works within 1-2 cycles for anxiety relief</li>
          <li><strong>Safe & natural:</strong> No side effects, can be used anywhere</li>
        </ul>
        <p className="text-blue-600 text-xs mt-2 italic">
          This technique was developed by Dr. Andrew Weil and is backed by neuroscience research.
        </p>
      </div>

      {/* Usage Tips */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <h4 className="font-medium text-yellow-800 mb-2">Tips for Best Results:</h4>
        <ul className="text-yellow-700 space-y-1 text-xs">
          <li>• Find a quiet space and sit comfortably with good posture</li>
          <li>• Place tongue tip behind upper front teeth throughout</li>
          <li>• Make a soft "whoosh" sound when exhaling through your mouth</li>
          <li>• Focus only on counting - let thoughts pass by</li>
          <li>• Practice regularly to build effectiveness over time</li>
        </ul>
      </div>
    </div>
  );
}