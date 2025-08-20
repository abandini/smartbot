import React, { useState, useEffect, useMemo } from 'react';
import { useMachine } from '@xstate/react';

// Components
import ModeBanner from './components/ModeBanner';
import CheckIn from './components/CheckIn';
import Journal from './components/Journal';
import UrgeLog from './components/UrgeLog';
import VACIForm from './components/tools/VACIForm';
import CBAForm from './components/tools/CBAForm';
import ABCDForm from './components/tools/ABCDForm';
import IfThenForm from './components/tools/IfThenForm';
import BreathingExercise from './components/tools/BreathingExercise';

// State & Logic
import { modeMachine } from './state/machine';
import { buildFeatures, getCurrentUserState, updateUserState } from './lib/features';
import { choose, learn } from './lib/api';

// Types
import { ActionType, ToolCompletionData, UserState, ChooseResponse } from './lib/types';

function App() {
  // UI Mode State Machine
  const [modeState, send] = useMachine(modeMachine);
  
  // Application State
  const [userState, setUserState] = useState<UserState>(getCurrentUserState());
  const [recommendation, setRecommendation] = useState<ChooseResponse | null>(null);
  const [activeComponent, setActiveComponent] = useState<ActionType | 'checkin' | null>('checkin');
  const [isLoading, setIsLoading] = useState(false);

  // Update machine context when user state changes
  useEffect(() => {
    send({ type: 'UPDATE_USER_STATE', userState });
    send({ type: 'CHECK_MODE_TRANSITION' });
  }, [userState, send]);

  // Get recommendation when user state changes significantly
  const features = useMemo(() => buildFeatures(userState), [userState]);

  const getRecommendation = async () => {
    setIsLoading(true);
    try {
      const response = await choose(features);
      setRecommendation(response);
      
      // If UI mode differs from machine state, update machine
      if (response.ui_mode !== modeState.context.currentMode) {
        send({ 
          type: 'FORCE_MODE', 
          mode: response.ui_mode, 
          reason: response.rationale 
        });
      }
    } catch (error) {
      console.error('Failed to get recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle check-in completion
  const handleCheckInComplete = (newState: Partial<UserState>) => {
    const updated = updateUserState(userState, newState);
    setUserState(updated);
    getRecommendation();
    setActiveComponent(null); // Will show recommendation
  };

  // Handle tool completion
  const handleToolComplete = async (data: ToolCompletionData) => {
    // Send feedback to learning system
    const learnRequest = {
      features,
      action: data.action,
      delta_suds: data.pre_suds - data.post_suds,
      completed: data.completed,
      regret: data.regret
    };

    await learn(learnRequest);

    // Update user state based on completion
    const stressReduction = Math.max(0, (data.pre_suds - data.post_suds) / 10);
    const updatedState = updateUserState(userState, {
      stress: Math.max(0, userState.stress - stressReduction * 0.3),
      mood: Math.min(1, userState.mood + stressReduction * 0.2)
    });
    
    setUserState(updatedState);
    setActiveComponent(null);
    
    // Get new recommendation after completion
    setTimeout(() => {
      getRecommendation();
    }, 500);
  };

  // Component selection based on recommendation or manual choice
  const selectComponent = (component: ActionType | 'checkin') => {
    setActiveComponent(component);
  };

  // Render active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'checkin':
        return (
          <CheckIn 
            onComplete={handleCheckInComplete}
            currentState={userState}
          />
        );
      case 'JOURNAL':
        return <Journal onComplete={handleToolComplete} />;
      case 'URGELOG':
        return <UrgeLog onComplete={handleToolComplete} />;
      case 'VACI':
        return <VACIForm onComplete={handleToolComplete} />;
      case 'CBA':
        return <CBAForm onComplete={handleToolComplete} />;
      case 'ABCD':
        return <ABCDForm onComplete={handleToolComplete} />;
      case 'IFTHENT':
        return <IfThenForm onComplete={handleToolComplete} />;
      case 'BREATH':
        return <BreathingExercise onComplete={handleToolComplete} />;
      default:
        return null;
    }
  };

  // Get available tools based on current mode
  const getAvailableTools = (): ActionType[] => {
    const mode = modeState.context.currentMode;
    
    if (mode === 'Crisis') {
      return ['BREATH', 'URGELOG', 'IFTHENT', 'JOURNAL'];
    } else if (mode === 'Flow') {
      return ['JOURNAL', 'VACI', 'BREATH'];
    } else {
      return ['JOURNAL', 'URGELOG', 'VACI', 'CBA', 'ABCD', 'IFTHENT', 'BREATH'];
    }
  };

  const availableTools = getAvailableTools();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 Smartbot Desktop
          </h1>
          <p className="text-gray-600">
            Your local-first SMART Recovery companion
          </p>
        </header>

        {/* Mode Banner */}
        <ModeBanner 
          mode={modeState.context.currentMode}
          rationale={modeState.context.modeChangeReason}
        />

        {/* Main Content */}
        {activeComponent ? (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => setActiveComponent(null)}
              className="btn-secondary mb-4"
            >
              ← Back to Dashboard
            </button>
            
            {renderActiveComponent()}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recommendation Card */}
            {recommendation && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  💡 Recommended Action
                </h2>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-medium text-primary-800">
                      {recommendation.action}
                    </span>
                    <span className="text-sm text-primary-600">
                      Confidence: {recommendation.confidence.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-primary-700 text-sm mb-3">
                    {recommendation.rationale}
                  </p>
                  <button
                    onClick={() => selectComponent(recommendation.action)}
                    className="btn-primary"
                  >
                    Start {recommendation.action}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🛠️ Available Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => selectComponent('checkin')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="text-lg mb-1">📊 Check-In</div>
                  <div className="text-sm text-gray-600">
                    Update your current state
                  </div>
                </button>

                {availableTools.map((tool) => {
                  const toolInfo = {
                    JOURNAL: { icon: '📝', name: 'Journal', desc: 'Express thoughts and feelings' },
                    URGELOG: { icon: '📊', name: 'Urge Log', desc: 'Track and understand urges' },
                    VACI: { icon: '🎯', name: 'VACI Planner', desc: 'Connect values to actions' },
                    CBA: { icon: '⚖️', name: 'Cost-Benefit', desc: 'Weigh pros and cons' },
                    ABCD: { icon: '🧠', name: 'ABCD Worksheet', desc: 'Challenge unhelpful thoughts' },
                    BREATH: { icon: '🫁', name: 'Breathing', desc: '4-7-8 breathing exercise' },
                    IFTHENT: { icon: '🔄', name: 'If-Then Plan', desc: 'Prepare coping strategies' }
                  }[tool] || { icon: '🔧', name: tool, desc: 'Recovery tool' };

                  return (
                    <button
                      key={tool}
                      onClick={() => selectComponent(tool)}
                      className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                      <div className="text-lg mb-1">
                        {toolInfo.icon} {toolInfo.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {toolInfo.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-3">Current State</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Mood</div>
                  <div className="font-medium">{(userState.mood * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-gray-500">Stress</div>
                  <div className="font-medium">{(userState.stress * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-gray-500">Streak</div>
                  <div className="font-medium">{userState.streak_days} days</div>
                </div>
                <div>
                  <div className="text-gray-500">Mode</div>
                  <div className="font-medium">{modeState.context.currentMode}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={getRecommendation}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Getting recommendation...' : '🎯 Get Recommendation'}
              </button>
              
              <button
                onClick={() => selectComponent('checkin')}
                className="btn-secondary"
              >
                📊 Quick Check-In
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Smartbot Desktop v0.1.0 - Local-first SMART Recovery companion</p>
          <p>Your data stays private and secure on your device</p>
        </footer>
      </div>
    </div>
  );
}

export default App;