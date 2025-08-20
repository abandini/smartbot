import { createMachine, assign } from 'xstate';
import { UIModeType, UserState } from '../lib/types';

interface ModeContext {
  currentMode: UIModeType;
  userState: UserState;
  lastModeChange: Date;
  modeChangeReason: string;
}

type ModeEvent =
  | { type: 'UPDATE_USER_STATE'; userState: Partial<UserState> }
  | { type: 'FORCE_MODE'; mode: UIModeType; reason: string }
  | { type: 'CHECK_MODE_TRANSITION' };

/**
 * XState machine for managing adaptive UI modes.
 * Transitions between Crisis, Growth, and Flow modes based on user state.
 */
export const modeMachine = createMachine<ModeContext, ModeEvent>({
  id: 'uiMode',
  initial: 'growth',
  context: {
    currentMode: 'Growth',
    userState: {
      mood: 0.5,
      stress: 0.5,
      urge_level: 0.3,
      energy: 0.6,
      sleep_quality: 0.7,
      workload: 0.4,
      social_support: 0.8,
      streak_days: 7,
      time_of_day: 0.5,
      day_of_week: 1
    },
    lastModeChange: new Date(),
    modeChangeReason: 'Initial state'
  },
  states: {
    crisis: {
      entry: assign({
        currentMode: 'Crisis',
        lastModeChange: new Date(),
        modeChangeReason: 'High stress or urge detected'
      }),
      on: {
        UPDATE_USER_STATE: {
          actions: assign({
            userState: (context, event) => ({
              ...context.userState,
              ...event.userState
            })
          })
        },
        CHECK_MODE_TRANSITION: [
          {
            target: 'flow',
            cond: 'shouldTransitionToFlow'
          },
          {
            target: 'growth',
            cond: 'shouldTransitionToGrowth'
          }
        ],
        FORCE_MODE: [
          {
            target: 'crisis',
            cond: (_, event) => event.mode === 'Crisis',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          },
          {
            target: 'growth',
            cond: (_, event) => event.mode === 'Growth',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          },
          {
            target: 'flow',
            cond: (_, event) => event.mode === 'Flow',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          }
        ]
      }
    },
    growth: {
      entry: assign({
        currentMode: 'Growth',
        lastModeChange: new Date(),
        modeChangeReason: 'Optimal learning state'
      }),
      on: {
        UPDATE_USER_STATE: {
          actions: assign({
            userState: (context, event) => ({
              ...context.userState,
              ...event.userState
            })
          })
        },
        CHECK_MODE_TRANSITION: [
          {
            target: 'crisis',
            cond: 'shouldTransitionToCrisis'
          },
          {
            target: 'flow',
            cond: 'shouldTransitionToFlow'
          }
        ],
        FORCE_MODE: [
          {
            target: 'crisis',
            cond: (_, event) => event.mode === 'Crisis',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          },
          {
            target: 'growth',
            cond: (_, event) => event.mode === 'Growth',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          },
          {
            target: 'flow',
            cond: (_, event) => event.mode === 'Flow',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          }
        ]
      }
    },
    flow: {
      entry: assign({
        currentMode: 'Flow',
        lastModeChange: new Date(),
        modeChangeReason: 'Stable, thriving state'
      }),
      on: {
        UPDATE_USER_STATE: {
          actions: assign({
            userState: (context, event) => ({
              ...context.userState,
              ...event.userState
            })
          })
        },
        CHECK_MODE_TRANSITION: [
          {
            target: 'crisis',
            cond: 'shouldTransitionToCrisis'
          },
          {
            target: 'growth',
            cond: 'shouldTransitionToGrowth'
          }
        ],
        FORCE_MODE: [
          {
            target: 'crisis',
            cond: (_, event) => event.mode === 'Crisis',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          },
          {
            target: 'growth',
            cond: (_, event) => event.mode === 'Growth',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          },
          {
            target: 'flow',
            cond: (_, event) => event.mode === 'Flow',
            actions: assign({
              modeChangeReason: (_, event) => event.reason
            })
          }
        ]
      }
    }
  }
}, {
  guards: {
    shouldTransitionToCrisis: (context) => {
      const { stress, urge_level } = context.userState;
      return stress > 0.7 || urge_level > 0.7;
    },
    shouldTransitionToFlow: (context) => {
      const { stress, urge_level, mood, streak_days } = context.userState;
      return stress < 0.3 && urge_level < 0.3 && mood > 0.6 && streak_days > 14;
    },
    shouldTransitionToGrowth: (context) => {
      const { stress, urge_level } = context.userState;
      // Transition to growth if not in crisis or flow conditions
      return !(stress > 0.7 || urge_level > 0.7) && 
             !(stress < 0.3 && urge_level < 0.3 && context.userState.mood > 0.6);
    }
  }
});

/**
 * Get UI characteristics for each mode.
 */
export function getModeCharacteristics(mode: UIModeType) {
  const characteristics = {
    Crisis: {
      priority: 'immediate_relief',
      tools: ['BREATH', 'URGELOG', 'IFTHENT'],
      layout: 'minimal',
      colors: 'warm_urgent',
      description: 'Focused on immediate support and crisis intervention'
    },
    Growth: {
      priority: 'learning_development', 
      tools: ['CBA', 'ABCD', 'VACI', 'JOURNAL'],
      layout: 'full_featured',
      colors: 'calm_focused',
      description: 'Comprehensive toolkit for skill building and reflection'
    },
    Flow: {
      priority: 'maintenance_nudges',
      tools: ['JOURNAL', 'VACI'],
      layout: 'ambient',
      colors: 'gentle_success',
      description: 'Gentle maintenance and continued growth support'
    }
  };

  return characteristics[mode];
}