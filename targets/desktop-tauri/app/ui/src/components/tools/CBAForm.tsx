import React, { useState } from 'react';
import { ToolCompletionData } from '../../lib/types';

interface CBAFormProps {
  onComplete: (data: ToolCompletionData) => void;
}

interface CBAItem {
  id: string;
  text: string;
  importance: number; // 1-5 scale
}

/**
 * Cost-Benefit Analysis (CBA) Tool
 * Helps users make informed decisions by weighing pros and cons with importance ratings
 */
export default function CBAForm({ onComplete }: CBAFormProps) {
  const [decision, setDecision] = useState('');
  const [pros, setPros] = useState<CBAItem[]>([]);
  const [cons, setCons] = useState<CBAItem[]>([]);
  const [preSuds, setPreSuds] = useState(5);
  const [postSuds, setPostSuds] = useState(5);
  const [startTime] = useState(Date.now());

  const addPro = () => {
    const newPro: CBAItem = {
      id: Date.now().toString(),
      text: '',
      importance: 3
    };
    setPros([...pros, newPro]);
  };

  const addCon = () => {
    const newCon: CBAItem = {
      id: Date.now().toString(),
      text: '',
      importance: 3
    };
    setCons([...cons, newCon]);
  };

  const updatePro = (id: string, field: keyof CBAItem, value: string | number) => {
    setPros(pros.map(pro => 
      pro.id === id ? { ...pro, [field]: value } : pro
    ));
  };

  const updateCon = (id: string, field: keyof CBAItem, value: string | number) => {
    setCons(cons.map(con => 
      con.id === id ? { ...con, [field]: value } : con
    ));
  };

  const removePro = (id: string) => {
    setPros(pros.filter(pro => pro.id !== id));
  };

  const removeCon = (id: string) => {
    setCons(cons.filter(con => con.id !== id));
  };

  // Calculate weighted scores
  const prosScore = pros.reduce((sum, pro) => 
    pro.text.trim() ? sum + pro.importance : sum, 0
  );
  const consScore = cons.reduce((sum, con) => 
    con.text.trim() ? sum + con.importance : sum, 0
  );

  const getRecommendation = () => {
    if (prosScore === consScore) return 'neutral';
    return prosScore > consScore ? 'proceed' : 'reconsider';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!decision.trim()) {
      alert('Please describe the decision you\'re analyzing.');
      return;
    }

    if (pros.filter(p => p.text.trim()).length === 0 || 
        cons.filter(c => c.text.trim()).length === 0) {
      alert('Please add at least one pro and one con to get a meaningful analysis.');
      return;
    }

    const completionData: ToolCompletionData = {
      action: 'CBA',
      pre_suds: preSuds,
      post_suds: postSuds,
      completed: true,
      duration_minutes: (Date.now() - startTime) / (1000 * 60),
      notes: `Decision: ${decision}. Pros: ${prosScore}, Cons: ${consScore}. Recommendation: ${getRecommendation()}`
    };

    onComplete(completionData);
  };

  const CBAItemComponent = ({ 
    item, 
    type, 
    onUpdate, 
    onRemove 
  }: { 
    item: CBAItem; 
    type: 'pro' | 'con';
    onUpdate: (id: string, field: keyof CBAItem, value: string | number) => void;
    onRemove: (id: string) => void;
  }) => (
    <div className={`p-3 border rounded-lg ${type === 'pro' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <div className="flex items-start space-x-3">
        <textarea
          value={item.text}
          onChange={(e) => onUpdate(item.id, 'text', e.target.value)}
          placeholder={type === 'pro' ? 'What\'s a benefit or positive aspect?' : 'What\'s a cost or negative aspect?'}
          className="flex-1 bg-white border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={2}
        />
        <div className="flex flex-col items-center space-y-1">
          <label className="text-xs text-gray-600">Importance</label>
          <select
            value={item.importance}
            onChange={(e) => onUpdate(item.id, 'importance', Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 text-sm p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );

  const recommendation = getRecommendation();

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">⚖️ Cost-Benefit Analysis</h2>
        <p className="text-gray-600 text-sm">
          Make informed decisions by weighing the pros and cons with importance ratings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SUDS Pre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current decision stress level (0-10 SUDS):
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
            <span>Clear & confident (0)</span>
            <span className="font-medium">{preSuds}</span>
            <span>Overwhelmed & confused (10)</span>
          </div>
        </div>

        {/* Decision Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What decision are you analyzing? *
          </label>
          <textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            placeholder="Describe the decision you're considering... (e.g., 'Should I change jobs?', 'Should I end this relationship?')"
            rows={3}
            className="form-input"
            required
          />
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-700 flex items-center">
                <span className="mr-2">✓</span>
                Pros (Benefits)
              </h3>
              <button
                type="button"
                onClick={addPro}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors"
              >
                + Add Pro
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {pros.map(pro => (
                <CBAItemComponent
                  key={pro.id}
                  item={pro}
                  type="pro"
                  onUpdate={updatePro}
                  onRemove={removePro}
                />
              ))}
              {pros.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="mb-2">No pros added yet</p>
                  <button
                    type="button"
                    onClick={addPro}
                    className="text-green-600 hover:text-green-700"
                  >
                    Add your first pro
                  </button>
                </div>
              )}
            </div>

            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="text-sm text-green-700">Total Pros Score</div>
              <div className="text-2xl font-bold text-green-800">{prosScore}</div>
            </div>
          </div>

          {/* Cons Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center">
                <span className="mr-2">✗</span>
                Cons (Costs)
              </h3>
              <button
                type="button"
                onClick={addCon}
                className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
              >
                + Add Con
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {cons.map(con => (
                <CBAItemComponent
                  key={con.id}
                  item={con}
                  type="con"
                  onUpdate={updateCon}
                  onRemove={removeCon}
                />
              ))}
              {cons.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="mb-2">No cons added yet</p>
                  <button
                    type="button"
                    onClick={addCon}
                    className="text-red-600 hover:text-red-700"
                  >
                    Add your first con
                  </button>
                </div>
              )}
            </div>

            <div className="text-center p-3 bg-red-100 rounded-lg">
              <div className="text-sm text-red-700">Total Cons Score</div>
              <div className="text-2xl font-bold text-red-800">{consScore}</div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {(pros.some(p => p.text.trim()) || cons.some(c => c.text.trim())) && (
          <div className={`p-4 rounded-lg border-2 ${
            recommendation === 'proceed' ? 'bg-green-50 border-green-200' :
            recommendation === 'reconsider' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <h4 className="font-semibold mb-2">Analysis Results:</h4>
            <div className="grid grid-cols-3 gap-4 text-center mb-3">
              <div>
                <div className="text-sm text-gray-600">Pros Score</div>
                <div className="text-xl font-bold text-green-600">{prosScore}</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl">
                  {recommendation === 'proceed' ? '→' : 
                   recommendation === 'reconsider' ? '←' : '⚖️'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Cons Score</div>
                <div className="text-xl font-bold text-red-600">{consScore}</div>
              </div>
            </div>
            <div className={`text-center font-medium ${
              recommendation === 'proceed' ? 'text-green-700' :
              recommendation === 'reconsider' ? 'text-red-700' :
              'text-yellow-700'
            }`}>
              {recommendation === 'proceed' && '✓ Analysis suggests proceeding may be beneficial'}
              {recommendation === 'reconsider' && '⚠ Analysis suggests reconsidering this decision'}
              {recommendation === 'neutral' && '⚖️ Analysis shows balanced pros and cons - trust your values'}
            </div>
          </div>
        )}

        {/* SUDS Post */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decision clarity level after analysis (0-10 SUDS):
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
            <span>Clear & confident (0)</span>
            <span className="font-medium">{postSuds}</span>
            <span>Overwhelmed & confused (10)</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full btn-primary py-3"
        >
          Complete Cost-Benefit Analysis
        </button>
      </form>

      {/* CBA explanation */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <h4 className="font-medium text-blue-800 mb-2">How to use Cost-Benefit Analysis:</h4>
        <ul className="text-blue-700 space-y-1 text-xs">
          <li><strong>1. Brainstorm:</strong> List all pros and cons without judgment</li>
          <li><strong>2. Rate importance:</strong> Use 1-5 scale (5 = very important)</li>
          <li><strong>3. Compare scores:</strong> Higher total suggests better option</li>
          <li><strong>4. Consider values:</strong> Numbers inform, but your values decide</li>
          <li><strong>5. Trust the process:</strong> Structured analysis reduces emotional decision-making</li>
        </ul>
      </div>
    </div>
  );
}