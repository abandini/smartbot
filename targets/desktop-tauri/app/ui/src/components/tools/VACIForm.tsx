import React, { useState } from 'react';
import { ToolCompletionData } from '../../lib/types';

interface VACIFormProps {
  onComplete: (data: ToolCompletionData) => void;
}

/**
 * VACI (Values, Actions, Commitment, Implementation) Planner
 * SMART Recovery tool for building motivation and planning behavioral change
 */
export default function VACIForm({ onComplete }: VACIFormProps) {
  const [values, setValues] = useState('');
  const [actions, setActions] = useState('');
  const [commitment, setCommitment] = useState('');
  const [implementation, setImplementation] = useState('');
  const [timeframe, setTimeframe] = useState('this-week');
  const [preSuds, setPreSuds] = useState(5);
  const [postSuds, setPostSuds] = useState(5);
  const [startTime] = useState(Date.now());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!values.trim() || !actions.trim()) {
      alert('Please fill in your values and actions to create an effective plan.');
      return;
    }

    const completionData: ToolCompletionData = {
      action: 'VACI',
      pre_suds: preSuds,
      post_suds: postSuds,
      completed: true,
      duration_minutes: (Date.now() - startTime) / (1000 * 60),
      notes: `Timeframe: ${timeframe}. Values focus: ${values.substring(0, 50)}...`
    };

    onComplete(completionData);
  };

  const valuePrompts = [
    'Health and physical well-being',
    'Family relationships',
    'Friendship and social connections', 
    'Career and financial security',
    'Personal growth and learning',
    'Creativity and self-expression',
    'Community involvement',
    'Spiritual or philosophical beliefs',
    'Adventure and new experiences',
    'Peace and tranquility'
  ];

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎯 VACI Planner</h2>
        <p className="text-gray-600 text-sm">
          Build motivation by connecting your actions to your values. Plan specific steps toward a balanced life.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SUDS Pre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current stress/uncertainty level (0-10 SUDS):
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
            <span>Clear & calm (0)</span>
            <span className="font-medium">{preSuds}</span>
            <span>Confused & stressed (10)</span>
          </div>
        </div>

        {/* Values */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-primary-600 font-semibold">V</span>alues: What matters most to you? *
          </label>
          <textarea
            value={values}
            onChange={(e) => setValues(e.target.value)}
            placeholder="What do you value most in life? What gives your life meaning and purpose?"
            rows={3}
            className="form-input mb-3"
            required
          />
          <div className="bg-primary-50 rounded-lg p-3">
            <p className="text-sm text-primary-700 mb-2">Common values (click to add):</p>
            <div className="flex flex-wrap gap-2">
              {valuePrompts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValues(prev => prev + (prev ? ', ' : '') + value)}
                  className="text-xs px-2 py-1 bg-white border border-primary-300 text-primary-700 rounded hover:bg-primary-100 transition-colors"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-primary-600 font-semibold">A</span>ctions: What specific actions align with these values? *
          </label>
          <textarea
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            placeholder="List specific actions and behaviors that honor your values..."
            rows={3}
            className="form-input"
            required
          />
          <p className="text-xs text-gray-600 mt-1">
            Examples: "Spend quality time with family," "Exercise 3 times per week," "Learn a new skill"
          </p>
        </div>

        {/* Commitment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-primary-600 font-semibold">C</span>ommitment: What are you willing to commit to?
          </label>
          <textarea
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            placeholder="What specific commitment can you make? Be realistic and achievable..."
            rows={3}
            className="form-input"
          />
          <p className="text-xs text-gray-600 mt-1">
            Make it specific, measurable, and time-bound (SMART goal format)
          </p>
        </div>

        {/* Implementation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-primary-600 font-semibold">I</span>mplementation: How will you make this happen?
          </label>
          <textarea
            value={implementation}
            onChange={(e) => setImplementation(e.target.value)}
            placeholder="What specific steps will you take? When? What resources do you need?"
            rows={3}
            className="form-input"
          />
          <p className="text-xs text-gray-600 mt-1">
            Include when, where, how, and what support you might need
          </p>
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeframe for this plan:
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="form-input"
          >
            <option value="today">Today</option>
            <option value="this-week">This week</option>
            <option value="this-month">This month</option>
            <option value="three-months">Next 3 months</option>
          </select>
        </div>

        {/* SUDS Post */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stress/uncertainty level after planning (0-10 SUDS):
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
            <span>Clear & calm (0)</span>
            <span className="font-medium">{postSuds}</span>
            <span>Confused & stressed (10)</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full btn-primary py-3"
        >
          Complete VACI Plan
        </button>
      </form>

      {/* VACI explanation */}
      <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg text-sm">
        <h4 className="font-medium text-primary-800 mb-2">The VACI Process:</h4>
        <ul className="text-primary-700 space-y-1 text-xs">
          <li><strong>Values:</strong> Identify what truly matters to you</li>
          <li><strong>Actions:</strong> Connect behaviors to your values</li>
          <li><strong>Commitment:</strong> Make realistic, specific commitments</li>
          <li><strong>Implementation:</strong> Create concrete steps and timelines</li>
        </ul>
      </div>
    </div>
  );
}