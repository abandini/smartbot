import React, { useState } from 'react';
import { ToolCompletionData } from '../../lib/types';

interface IfThenFormProps {
  onComplete: (data: ToolCompletionData) => void;
}

interface IfThenPlan {
  id: string;
  situation: string;
  response: string;
  confidence: number; // 1-5 scale
}

/**
 * If-Then Planning Tool
 * Creates implementation intentions for high-risk situations
 * Format: "If [situation], then I will [response]"
 */
export default function IfThenForm({ onComplete }: IfThenFormProps) {
  const [plans, setPlans] = useState<IfThenPlan[]>([]);
  const [preSuds, setPreSuds] = useState(5);
  const [postSuds, setPostSuds] = useState(5);
  const [startTime] = useState(Date.now());

  const commonSituations = [
    'I feel a strong urge to use',
    'I\'m at a party where others are using',
    'I have a conflict with someone close to me',
    'I feel overwhelmed with stress',
    'I\'m feeling lonely or isolated',
    'Someone offers me substances',
    'I\'m celebrating good news',
    'I\'m dealing with physical pain',
    'I see triggers in my environment',
    'I\'m feeling bored with nothing to do',
    'I receive bad news or face disappointment',
    'I\'m in a familiar using location'
  ];

  const commonResponses = [
    'call my sponsor or support person',
    'leave the situation immediately',
    'use my breathing exercises',
    'go for a walk or exercise',
    'write in my journal',
    'attend a support group meeting',
    'practice mindfulness meditation',
    'engage in a healthy distraction activity',
    'remind myself of my goals and values',
    'use positive self-talk',
    'reach out to a trusted friend',
    'review my reasons for recovery'
  ];

  const addPlan = () => {
    const newPlan: IfThenPlan = {
      id: Date.now().toString(),
      situation: '',
      response: '',
      confidence: 3
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, field: keyof IfThenPlan, value: string | number) => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, [field]: value } : plan
    ));
  };

  const removePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const completedPlans = plans.filter(p => p.situation.trim() && p.response.trim());
    
    if (completedPlans.length === 0) {
      alert('Please create at least one complete If-Then plan with both situation and response.');
      return;
    }

    const avgConfidence = completedPlans.reduce((sum, plan) => sum + plan.confidence, 0) / completedPlans.length;

    const completionData: ToolCompletionData = {
      action: 'IFTHENT',
      pre_suds: preSuds,
      post_suds: postSuds,
      completed: true,
      duration_minutes: (Date.now() - startTime) / (1000 * 60),
      notes: `Created ${completedPlans.length} If-Then plans. Average confidence: ${avgConfidence.toFixed(1)}`
    };

    onComplete(completionData);
  };

  const PlanComponent = ({ plan }: { plan: IfThenPlan }) => (
    <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-700">If-Then Plan</h4>
        <button
          type="button"
          onClick={() => removePlan(plan.id)}
          className="text-red-500 hover:text-red-700 text-sm p-1"
        >
          ✕
        </button>
      </div>

      {/* Situation */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-blue-700 mb-2">
          <span className="bg-blue-100 px-2 py-1 rounded text-xs mr-2">IF</span>
          What situation or trigger might occur?
        </label>
        <textarea
          value={plan.situation}
          onChange={(e) => updatePlan(plan.id, 'situation', e.target.value)}
          placeholder="Describe a specific high-risk situation..."
          rows={2}
          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {commonSituations.slice(0, 6).map((situation, index) => (
            <button
              key={index}
              type="button"
              onClick={() => updatePlan(plan.id, 'situation', situation)}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              {situation}
            </button>
          ))}
        </div>
      </div>

      {/* Response */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-green-700 mb-2">
          <span className="bg-green-100 px-2 py-1 rounded text-xs mr-2">THEN</span>
          What will you do in response?
        </label>
        <textarea
          value={plan.response}
          onChange={(e) => updatePlan(plan.id, 'response', e.target.value)}
          placeholder="Describe your specific coping response..."
          rows={2}
          className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {commonResponses.slice(0, 6).map((response, index) => (
            <button
              key={index}
              type="button"
              onClick={() => updatePlan(plan.id, 'response', response)}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* Confidence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How confident are you that you'll follow through? (1-5)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={plan.confidence}
            onChange={(e) => updatePlan(plan.id, 'confidence', Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-12 text-center font-medium text-gray-700">
            {plan.confidence}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Not confident (1)</span>
          <span>Very confident (5)</span>
        </div>
      </div>

      {/* Preview */}
      {plan.situation.trim() && plan.response.trim() && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Your If-Then Statement:</h5>
          <p className="text-sm text-gray-600 italic">
            "<span className="text-blue-600 font-medium">If {plan.situation.toLowerCase()}</span>, 
            <span className="text-green-600 font-medium"> then I will {plan.response.toLowerCase()}</span>."
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🔄 If-Then Planning</h2>
        <p className="text-gray-600 text-sm">
          Prepare for high-risk situations by creating specific implementation intentions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SUDS Pre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current anxiety about future challenges (0-10 SUDS):
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
            <span>Confident & prepared (0)</span>
            <span className="font-medium">{preSuds}</span>
            <span>Worried & unprepared (10)</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-medium text-indigo-800 mb-2">How If-Then Planning Works:</h3>
          <p className="text-indigo-700 text-sm mb-3">
            Implementation intentions help you respond automatically to challenging situations. 
            By planning ahead, you reduce the mental effort needed to make good decisions in the moment.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded mr-2 text-xs font-medium">IF</span>
              <span className="text-indigo-700">Trigger situation</span>
            </div>
            <span className="text-indigo-500">→</span>
            <div className="flex items-center">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded mr-2 text-xs font-medium">THEN</span>
              <span className="text-indigo-700">Planned response</span>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-4">
          {plans.map(plan => (
            <PlanComponent key={plan.id} plan={plan} />
          ))}

          {plans.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-gray-500 mb-4">
                <h3 className="text-lg font-medium mb-2">No If-Then plans created yet</h3>
                <p className="text-sm">Start by identifying a challenging situation you might face</p>
              </div>
              <button
                type="button"
                onClick={addPlan}
                className="btn-primary"
              >
                Create Your First Plan
              </button>
            </div>
          )}

          {plans.length > 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={addPlan}
                className="btn-secondary"
              >
                + Add Another Plan
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        {plans.some(p => p.situation.trim() && p.response.trim()) && (
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Your If-Then Plans Summary:</h4>
            <div className="space-y-2 text-sm">
              {plans.filter(p => p.situation.trim() && p.response.trim()).map((plan, index) => (
                <div key={plan.id} className="flex items-start space-x-2">
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium min-w-max">
                    Plan {index + 1}
                  </span>
                  <p className="text-gray-600">
                    If <span className="font-medium">{plan.situation.toLowerCase()}</span>, 
                    then I will <span className="font-medium">{plan.response.toLowerCase()}</span>.
                    <span className="text-gray-500 ml-2">(Confidence: {plan.confidence}/5)</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUDS Post */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anxiety about future challenges after planning (0-10 SUDS):
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
            <span>Confident & prepared (0)</span>
            <span className="font-medium">{postSuds}</span>
            <span>Worried & unprepared (10)</span>
          </div>
          {postSuds < preSuds && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Great! Your anxiety about future challenges decreased by {preSuds - postSuds} points.
            </p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full btn-primary py-3"
          disabled={plans.filter(p => p.situation.trim() && p.response.trim()).length === 0}
        >
          Complete If-Then Planning
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <h4 className="font-medium text-yellow-800 mb-2">Tips for Effective If-Then Plans:</h4>
        <ul className="text-yellow-700 space-y-1 text-xs">
          <li><strong>Be specific:</strong> Vague plans are less effective than detailed ones</li>
          <li><strong>Make it actionable:</strong> Choose responses you can actually do</li>
          <li><strong>Practice mentally:</strong> Visualize following through on your plans</li>
          <li><strong>Start simple:</strong> Begin with easier situations to build confidence</li>
          <li><strong>Review regularly:</strong> Update plans based on what works</li>
        </ul>
      </div>
    </div>
  );
}