import React, { useState } from 'react';
import { ToolCompletionData } from '../../lib/types';

interface ABCDFormProps {
  onComplete: (data: ToolCompletionData) => void;
}

/**
 * ABCD Worksheet for Cognitive Restructuring
 * A - Adversity (What happened?)
 * B - Beliefs (What thoughts did you have?)  
 * C - Consequences (How did you feel/behave?)
 * D - Disputation (How can you challenge these thoughts?)
 */
export default function ABCDForm({ onComplete }: ABCDFormProps) {
  const [adversity, setAdversity] = useState('');
  const [beliefs, setBeliefs] = useState('');
  const [consequences, setConsequences] = useState('');
  const [disputation, setDisputation] = useState('');
  const [alternativeBeliefs, setAlternativeBeliefs] = useState('');
  const [preSuds, setPreSuds] = useState(5);
  const [postSuds, setPostSuds] = useState(5);
  const [startTime] = useState(Date.now());

  const beliefPrompts = [
    "I always mess things up",
    "Nobody likes me",
    "I can't handle this",
    "It's all my fault",
    "Nothing will ever change", 
    "I'm not good enough",
    "This is terrible",
    "I should be perfect",
    "Everyone is judging me",
    "I have no control"
  ];

  const disputationQuestions = [
    "Is this thought realistic and helpful?",
    "What evidence supports or contradicts this belief?",
    "What would I tell a friend in this situation?",
    "Am I catastrophizing or thinking in black-and-white?",
    "What's the worst, best, and most likely outcome?",
    "How important will this be in 5 years?",
    "What are alternative explanations?",
    "Am I focusing on what I can't control?",
    "What skills or strengths can help me cope?",
    "How would a wise, compassionate person see this?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!adversity.trim() || !beliefs.trim() || !consequences.trim()) {
      alert('Please complete the Adversity, Beliefs, and Consequences sections to identify the thought pattern.');
      return;
    }

    const completionData: ToolCompletionData = {
      action: 'ABCD',
      pre_suds: preSuds,
      post_suds: postSuds,
      completed: true,
      duration_minutes: (Date.now() - startTime) / (1000 * 60),
      notes: `Adversity: ${adversity.substring(0, 50)}... Beliefs challenged: ${beliefs.substring(0, 50)}...`
    };

    onComplete(completionData);
  };

  const insertPrompt = (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(prev => prev + (prev ? '\n\n' : '') + text + '\n');
  };

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🧠 ABCD Worksheet</h2>
        <p className="text-gray-600 text-sm">
          Challenge unhelpful thoughts and develop more balanced perspectives using cognitive restructuring.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SUDS Pre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current emotional intensity (0-10 SUDS):
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
            <span>Intense distress (10)</span>
          </div>
        </div>

        {/* A - Adversity */}
        <div className="p-4 border-l-4 border-red-400 bg-red-50 rounded-r-lg">
          <label className="block text-lg font-semibold text-red-700 mb-2">
            <span className="bg-red-100 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2 text-red-800">A</span>
            Adversity: What happened?
          </label>
          <textarea
            value={adversity}
            onChange={(e) => setAdversity(e.target.value)}
            placeholder="Describe the situation, event, or trigger that led to difficult thoughts or feelings..."
            rows={3}
            className="form-input"
            required
          />
          <p className="text-xs text-red-600 mt-1">
            Focus on facts, not interpretations. What actually happened?
          </p>
        </div>

        {/* B - Beliefs */}
        <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg">
          <label className="block text-lg font-semibold text-yellow-700 mb-2">
            <span className="bg-yellow-100 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2 text-yellow-800">B</span>
            Beliefs: What thoughts did you have?
          </label>
          <textarea
            value={beliefs}
            onChange={(e) => setBeliefs(e.target.value)}
            placeholder="What went through your mind? What did you tell yourself about the situation?"
            rows={3}
            className="form-input mb-3"
            required
          />
          <div className="bg-yellow-100 rounded-lg p-3">
            <p className="text-sm text-yellow-700 mb-2">Common unhelpful thoughts (click to add):</p>
            <div className="flex flex-wrap gap-2">
              {beliefPrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertPrompt(`"${prompt}"`, setBeliefs)}
                  className="text-xs px-2 py-1 bg-white border border-yellow-300 text-yellow-700 rounded hover:bg-yellow-50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* C - Consequences */}
        <div className="p-4 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
          <label className="block text-lg font-semibold text-blue-700 mb-2">
            <span className="bg-blue-100 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2 text-blue-800">C</span>
            Consequences: How did you feel and behave?
          </label>
          <textarea
            value={consequences}
            onChange={(e) => setConsequences(e.target.value)}
            placeholder="What emotions did you experience? How did you behave? What actions did you take or avoid?"
            rows={3}
            className="form-input"
            required
          />
          <p className="text-xs text-blue-600 mt-1">
            Include both emotions (sad, angry, anxious) and behaviors (avoided, lashed out, withdrew)
          </p>
        </div>

        {/* D - Disputation */}
        <div className="p-4 border-l-4 border-green-400 bg-green-50 rounded-r-lg">
          <label className="block text-lg font-semibold text-green-700 mb-2">
            <span className="bg-green-100 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2 text-green-800">D</span>
            Disputation: How can you challenge these thoughts?
          </label>
          <textarea
            value={disputation}
            onChange={(e) => setDisputation(e.target.value)}
            placeholder="Question your beliefs. What evidence supports or contradicts them? Are there alternative explanations?"
            rows={4}
            className="form-input mb-3"
          />
          <div className="bg-green-100 rounded-lg p-3">
            <p className="text-sm text-green-700 mb-2">Helpful questions to challenge thoughts (click to add):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {disputationQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertPrompt(question, setDisputation)}
                  className="text-xs px-2 py-2 bg-white border border-green-300 text-green-700 rounded hover:bg-green-50 transition-colors text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alternative Beliefs */}
        <div className="p-4 border-l-4 border-purple-400 bg-purple-50 rounded-r-lg">
          <label className="block text-lg font-semibold text-purple-700 mb-2">
            <span className="bg-purple-100 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2 text-purple-800">E</span>
            Effective New Beliefs: What's a more balanced perspective?
          </label>
          <textarea
            value={alternativeBeliefs}
            onChange={(e) => setAlternativeBeliefs(e.target.value)}
            placeholder="Based on your disputation, what's a more realistic and helpful way to think about this situation?"
            rows={3}
            className="form-input"
          />
          <p className="text-xs text-purple-600 mt-1">
            Create balanced thoughts that acknowledge reality while being kind to yourself
          </p>
        </div>

        {/* Progress Check */}
        {beliefs.trim() && disputation.trim() && (
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Thought Transformation Summary:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-yellow-700">Original Thought:</span>
                <p className="text-gray-600 italic pl-4">"{beliefs.substring(0, 100)}{beliefs.length > 100 ? '...' : ''}"</p>
              </div>
              {alternativeBeliefs.trim() && (
                <div>
                  <span className="font-medium text-purple-700">New Perspective:</span>
                  <p className="text-gray-600 italic pl-4">"{alternativeBeliefs.substring(0, 100)}{alternativeBeliefs.length > 100 ? '...' : ''}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUDS Post */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emotional intensity after thought challenging (0-10 SUDS):
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
            <span>Intense distress (10)</span>
          </div>
          {postSuds < preSuds && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Great! Your emotional intensity decreased by {preSuds - postSuds} points through thought challenging.
            </p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full btn-primary py-3"
        >
          Complete ABCD Worksheet
        </button>
      </form>

      {/* ABCD explanation */}
      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-sm">
        <h4 className="font-medium text-indigo-800 mb-2">How ABCD Works:</h4>
        <ul className="text-indigo-700 space-y-1 text-xs">
          <li><strong>A - Adversity:</strong> Identify the triggering event (facts only)</li>
          <li><strong>B - Beliefs:</strong> Notice the thoughts and interpretations</li>
          <li><strong>C - Consequences:</strong> Recognize resulting emotions and behaviors</li>
          <li><strong>D - Disputation:</strong> Challenge thoughts with evidence and questions</li>
          <li><strong>E - Effective Beliefs:</strong> Develop balanced, realistic alternatives</li>
        </ul>
        <p className="text-indigo-600 text-xs mt-2 italic">
          Remember: The goal isn't positive thinking, but realistic and helpful thinking.
        </p>
      </div>
    </div>
  );
}