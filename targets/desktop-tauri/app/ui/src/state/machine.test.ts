import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { modeMachine, getModeCharacteristics } from './machine';

describe('Mode Machine', () => {
  it('starts in growth mode', () => {
    const actor = createActor(modeMachine);
    actor.start();
    
    expect(actor.getSnapshot().context.currentMode).toBe('Growth');
  });

  it('transitions to crisis mode when stress is high', () => {
    const actor = createActor(modeMachine);
    actor.start();
    
    // Update user state with high stress
    actor.send({
      type: 'UPDATE_USER_STATE',
      userState: { stress: 0.8, urge_level: 0.2 }
    });
    
    actor.send({ type: 'CHECK_MODE_TRANSITION' });
    
    expect(actor.getSnapshot().context.currentMode).toBe('Crisis');
  });

  it('transitions to crisis mode when urge level is high', () => {
    const actor = createActor(modeMachine);
    actor.start();
    
    // Update user state with high urge
    actor.send({
      type: 'UPDATE_USER_STATE', 
      userState: { stress: 0.3, urge_level: 0.8 }
    });
    
    actor.send({ type: 'CHECK_MODE_TRANSITION' });
    
    expect(actor.getSnapshot().context.currentMode).toBe('Crisis');
  });

  it('transitions to flow mode when conditions are good', () => {
    const actor = createActor(modeMachine);
    actor.start();
    
    // Update user state for flow conditions
    actor.send({
      type: 'UPDATE_USER_STATE',
      userState: { 
        stress: 0.2, 
        urge_level: 0.1, 
        mood: 0.8,
        streak_days: 20
      }
    });
    
    actor.send({ type: 'CHECK_MODE_TRANSITION' });
    
    expect(actor.getSnapshot().context.currentMode).toBe('Flow');
  });

  it('allows forced mode transitions', () => {
    const actor = createActor(modeMachine);
    actor.start();
    
    actor.send({
      type: 'FORCE_MODE',
      mode: 'Crisis',
      reason: 'User requested crisis mode'
    });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.currentMode).toBe('Crisis');
    expect(snapshot.context.modeChangeReason).toBe('User requested crisis mode');
  });

  it('updates user state in context', () => {
    const actor = createActor(modeMachine);
    actor.start();
    
    const newState = { mood: 0.8, stress: 0.2 };
    actor.send({
      type: 'UPDATE_USER_STATE',
      userState: newState
    });
    
    const context = actor.getSnapshot().context;
    expect(context.userState.mood).toBe(0.8);
    expect(context.userState.stress).toBe(0.2);
  });
});

describe('getModeCharacteristics', () => {
  it('returns correct characteristics for Crisis mode', () => {
    const characteristics = getModeCharacteristics('Crisis');
    
    expect(characteristics.priority).toBe('immediate_relief');
    expect(characteristics.tools).toContain('BREATH');
    expect(characteristics.tools).toContain('URGELOG');
    expect(characteristics.layout).toBe('minimal');
  });

  it('returns correct characteristics for Growth mode', () => {
    const characteristics = getModeCharacteristics('Growth');
    
    expect(characteristics.priority).toBe('learning_development');
    expect(characteristics.tools).toContain('CBA');
    expect(characteristics.tools).toContain('ABCD');
    expect(characteristics.layout).toBe('full_featured');
  });

  it('returns correct characteristics for Flow mode', () => {
    const characteristics = getModeCharacteristics('Flow');
    
    expect(characteristics.priority).toBe('maintenance_nudges');
    expect(characteristics.tools).toContain('JOURNAL');
    expect(characteristics.layout).toBe('ambient');
  });
});