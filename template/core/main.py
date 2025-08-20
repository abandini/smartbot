"""
Smartbot Core FastAPI Backend
Implements contextual bandit for SMART Recovery tool recommendations
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Literal
import numpy as np
import json
import os
from pathlib import Path

app = FastAPI(
    title="Smartbot Core",
    description="Contextual bandit backend for SMART Recovery companion",
    version="0.1.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "tauri://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Types
ActionType = Literal["CBA", "ABCD", "VACI", "IFTHENT", "BREATH", "JOURNAL", "URGELOG"]
UIModeType = Literal["Crisis", "Growth", "Flow"]

class ChooseRequest(BaseModel):
    features: List[float]
    
class ChooseResponse(BaseModel):
    action: ActionType
    ui_mode: UIModeType
    confidence: float
    rationale: str

class LearnRequest(BaseModel):
    features: List[float]
    action: ActionType
    delta_suds: float  # Change in SUDS (0-10 scale)
    completed: bool
    regret: Optional[bool] = None

# LinUCB Contextual Bandit Implementation
class LinUCBBandit:
    """
    Linear Upper Confidence Bound bandit for SMART Recovery tool selection.
    Balances exploration vs exploitation based on user context and feedback.
    """
    def __init__(self, n_actions: int, n_features: int, alpha: float = 1.0):
        self.n_actions = n_actions
        self.n_features = n_features
        self.alpha = alpha  # Exploration parameter
        
        # Initialize A matrices and b vectors for each action
        self.A = [np.identity(n_features) for _ in range(n_actions)]
        self.b = [np.zeros(n_features) for _ in range(n_actions)]
        
        self.actions = ["CBA", "ABCD", "VACI", "IFTHENT", "BREATH", "JOURNAL", "URGELOG"]
        
    def choose_action(self, features: np.ndarray) -> tuple[int, float, str]:
        """
        Select action using LinUCB algorithm.
        Returns: (action_index, confidence, rationale)
        """
        ucb_values = []
        
        for a in range(self.n_actions):
            # Compute theta (parameter estimate)
            A_inv = np.linalg.inv(self.A[a])
            theta = A_inv @ self.b[a]
            
            # Compute confidence bound
            confidence_bound = self.alpha * np.sqrt(features.T @ A_inv @ features)
            
            # UCB value = expected reward + confidence bound
            ucb_value = theta.T @ features + confidence_bound
            ucb_values.append(ucb_value)
        
        # Select action with highest UCB value
        best_action = int(np.argmax(ucb_values))
        confidence = float(ucb_values[best_action])
        
        # Generate rationale based on feature interpretation
        rationale = self._generate_rationale(features, best_action, confidence)
        
        return best_action, confidence, rationale
    
    def update(self, features: np.ndarray, action: int, reward: float):
        """Update bandit parameters based on observed reward."""
        self.A[action] += np.outer(features, features)
        self.b[action] += reward * features
    
    def _generate_rationale(self, features: np.ndarray, action: int, confidence: float) -> str:
        """Generate human-readable rationale for action selection."""
        action_name = self.actions[action]
        
        # Feature interpretation (assumes specific feature encoding)
        mood = features[0] if len(features) > 0 else 0.5
        stress = features[1] if len(features) > 1 else 0.5
        urge_level = features[2] if len(features) > 2 else 0.5
        
        rationales = {
            "CBA": f"Cost-Benefit Analysis recommended due to decision-making context (confidence: {confidence:.2f})",
            "ABCD": f"ABCD worksheet suggested for thought restructuring (mood: {mood:.2f}, confidence: {confidence:.2f})",
            "VACI": f"Values & Commitment planning fits your growth context (confidence: {confidence:.2f})",
            "IFTHENT": f"If-Then planning recommended for urge management (urge level: {urge_level:.2f})",
            "BREATH": f"Breathing exercise suggested for immediate regulation (stress: {stress:.2f})",
            "JOURNAL": f"Journaling recommended for reflection and processing (confidence: {confidence:.2f})",
            "URGELOG": f"Urge logging suggested for pattern awareness (urge level: {urge_level:.2f})"
        }
        
        return rationales.get(action_name, f"{action_name} selected with confidence {confidence:.2f}")

# Global bandit instance
BANDIT_STATE_FILE = Path("bandit_state.json")
bandit = LinUCBBandit(n_actions=7, n_features=10, alpha=1.0)

def save_bandit_state():
    """Save bandit state to disk for persistence."""
    state = {
        "A": [A.tolist() for A in bandit.A],
        "b": [b.tolist() for b in bandit.b],
        "alpha": bandit.alpha
    }
    with open(BANDIT_STATE_FILE, "w") as f:
        json.dump(state, f)

def load_bandit_state():
    """Load bandit state from disk if it exists."""
    global bandit
    if BANDIT_STATE_FILE.exists():
        try:
            with open(BANDIT_STATE_FILE, "r") as f:
                state = json.load(f)
            
            bandit.A = [np.array(A) for A in state["A"]]
            bandit.b = [np.array(b) for b in state["b"]]
            bandit.alpha = state["alpha"]
        except Exception as e:
            print(f"Failed to load bandit state: {e}")

# Load state on startup
load_bandit_state()

def determine_ui_mode(features: np.ndarray) -> UIModeType:
    """
    Determine appropriate UI mode based on user context.
    Crisis: High stress/urges, minimal interface
    Growth: Learning focused, full toolkit
    Flow: Ambient, gentle nudges
    """
    if len(features) < 3:
        return "Growth"
        
    stress = features[1]
    urge_level = features[2]
    
    # Crisis mode for high stress or urges
    if stress > 0.7 or urge_level > 0.7:
        return "Crisis"
    
    # Flow mode for low stress, stable state
    if stress < 0.3 and urge_level < 0.3:
        return "Flow"
    
    # Default to Growth mode for learning/development
    return "Growth"

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Smartbot Core API", "status": "running"}

@app.post("/choose", response_model=ChooseResponse)
async def choose_action(request: ChooseRequest) -> ChooseResponse:
    """
    Select best SMART Recovery tool based on user context.
    Uses LinUCB contextual bandit for personalized recommendations.
    """
    features = np.array(request.features)
    
    # Get action recommendation from bandit
    action_idx, confidence, rationale = bandit.choose_action(features)
    action = bandit.actions[action_idx]
    
    # Determine UI mode
    ui_mode = determine_ui_mode(features)
    
    return ChooseResponse(
        action=action,
        ui_mode=ui_mode,
        confidence=confidence,
        rationale=rationale
    )

@app.post("/learn")
async def learn_from_feedback(request: LearnRequest):
    """
    Update bandit model based on user feedback.
    Reward is computed from SUDS improvement and completion.
    """
    features = np.array(request.features)
    action_idx = bandit.actions.index(request.action)
    
    # Compute reward from feedback
    # SUDS improvement (negative delta_suds is good)
    suds_reward = -request.delta_suds / 10.0  # Normalize to [-1, 1]
    
    # Completion bonus
    completion_reward = 1.0 if request.completed else -0.5
    
    # Regret penalty
    regret_penalty = -1.0 if request.regret else 0.0
    
    # Combined reward
    total_reward = suds_reward + completion_reward + regret_penalty
    
    # Update bandit
    bandit.update(features, action_idx, total_reward)
    
    # Save state for persistence
    save_bandit_state()
    
    return {
        "message": "Feedback received",
        "reward_breakdown": {
            "suds_reward": suds_reward,
            "completion_reward": completion_reward,
            "regret_penalty": regret_penalty,
            "total_reward": total_reward
        }
    }

@app.get("/stats")
async def get_stats():
    """Get bandit statistics for monitoring."""
    return {
        "actions": bandit.actions,
        "n_features": bandit.n_features,
        "alpha": bandit.alpha,
        "total_interactions": sum(np.trace(A) for A in bandit.A)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)