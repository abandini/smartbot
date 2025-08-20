# Smartbot Desktop

**Local-first SMART Recovery companion with adaptive AI**

Smartbot Desktop is a compassionate, privacy-focused desktop application that helps users build sustainable recovery skills through personalized tool recommendations and adaptive interfaces. Built with SMART Recovery principles at its core, it uses contextual bandit algorithms to learn which tools are most effective for each user's unique situation.

## ✨ Key Features

- **🏠 Local-First**: All data stays on your device, encrypted and private
- **🧠 Adaptive AI**: Learns your patterns without compromising privacy
- **📱 Three UI Modes**: Crisis, Growth, and Flow modes adapt to your state
- **🛠️ SMART Recovery Tools**: Complete toolkit including VACI, CBA, ABCD, and more
- **📊 Contextual Recommendations**: AI suggests the right tool at the right time
- **🔒 Privacy-First**: No data leaves your device unless you choose to export

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS + Tauri
- **Backend**: FastAPI with LinUCB contextual bandit
- **State Management**: XState for adaptive UI modes
- **Testing**: Vitest for unit tests
- **Storage**: Local SQLite (SQLCipher planned for encryption)

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 20 
- **Python** ≥ 3.11
- **Rust** (for Tauri) → install via https://rustup.rs

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/abandini/smartbot.git
cd smartbot
```

2. **Set up the FastAPI backend**:
```bash
cd template
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

3. **Install frontend dependencies**:
```bash
cd ../targets/desktop-tauri/app/ui
npm install
```

4. **Start development servers**:

Terminal 1 - Backend:
```bash
cd template
source .venv/bin/activate
uvicorn template.core.main:app --reload
```

Terminal 2 - Frontend:
```bash
cd targets/desktop-tauri/app/ui
npm run dev
```

5. **Run tests**:
```bash
npm run test
```

6. **Build desktop app** (optional):
```bash
npm run tauri:build
```

## 🧭 Usage

### Daily Check-In
Start each session with a check-in to help Smartbot understand your current state:
- Mood, stress, and urge levels
- Energy and sleep quality
- Current circumstances

### AI Recommendations  
Smartbot uses contextual bandit learning to recommend the most helpful tool:
- **Crisis Mode**: Breathing exercises, urge logging, immediate support
- **Growth Mode**: Full toolkit including CBA, ABCD, VACI planning
- **Flow Mode**: Gentle maintenance with journaling and values work

### SMART Recovery Tools
- **📝 Journal**: Process thoughts and emotions
- **📊 Urge Log**: Track triggers and coping strategies  
- **🎯 VACI Planner**: Connect values to actions
- **⚖️ Cost-Benefit Analysis**: Weigh pros and cons
- **🧠 ABCD Worksheet**: Challenge unhelpful thoughts
- **🫁 Breathing Exercises**: 4-7-8 technique for immediate relief

## 🧪 Testing

Run the full test suite:
```bash
cd targets/desktop-tauri/app/ui
npm run test
```

Tests cover:
- Feature extraction and normalization
- API communication and error handling
- Component rendering and user interactions
- State machine transitions
- Contextual bandit learning

## 📁 Project Structure

```
smartbot/
├── template/                 # FastAPI backend
│   └── core/
│       └── main.py          # LinUCB contextual bandit
├── targets/desktop-tauri/    # Desktop application
│   ├── app/ui/              # React frontend
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── lib/         # Core logic & API
│   │   │   └── state/       # XState machines
│   │   └── package.json     # Frontend dependencies
│   └── src-tauri/           # Tauri backend
└── docs/                    # Documentation
```

## 🔒 Privacy & Ethics

Smartbot is built on the **Golden Rule++** principle - optimizing for sustainable flourishing rather than engagement metrics:

- **Local-First**: No data leaves your device without explicit consent
- **Transparent AI**: All recommendations include rationale
- **User Control**: Full data export and deletion capabilities
- **No Tracking**: No analytics, telemetry, or user profiling
- **Open Source**: Full transparency in how your data is used

## 🤝 Contributing

We welcome contributions! Please see our [contributor onboarding guide](smartbot_contributor_onboarding_workflow.md) for detailed setup instructions.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes with tests
4. Run the test suite: `npm run test`
5. Submit a pull request

### Code Style
- **TypeScript**: Explicit types, avoid `any`
- **React**: Functional components with hooks
- **Tailwind**: Semantic utility classes
- **Testing**: Unit tests for logic, smoke tests for UI

## 📈 Roadmap

### Phase 1 ✅ (Complete)
- Tauri + React + FastAPI foundation
- Core SMART Recovery tools
- Contextual bandit learning loop
- Adaptive UI modes
- Comprehensive test suite

### Phase 2 (Upcoming)
- Additional SMART tools (If-Then planning, Breathing exercises)
- SQLCipher encryption for local storage
- Weekly reflection and progress tracking
- Enhanced explainability features

### Phase 3 (Future)
- Mobile companion app
- Optional secure device sync
- Community features (anonymous, privacy-first)
- Advanced personalization with on-device LoRA

## 🆘 Support

- **Documentation**: Check our [project plan](smartbot_desktop_project_plan_thesis.md)
- **Issues**: [GitHub Issues](https://github.com/abandini/smartbot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/abandini/smartbot/discussions)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 💝 Acknowledgments

Built with inspiration from:
- **SMART Recovery**: Evidence-based addiction recovery program
- **Motivational Interviewing**: Client-centered counseling approach  
- **Humanistic Psychology**: Rogers, Adler, Sullivan principles
- **Local-First Software**: Privacy-respecting technology design

---

**Smartbot is more than software: it is a living companion that nudges toward self-directed growth, sustainable happiness, and ethical flourishing.**