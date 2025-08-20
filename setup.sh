#!/bin/bash

# Smartbot Desktop Setup Script
# Automates the setup process for development

set -e

echo "🤖 Setting up Smartbot Desktop development environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js ≥ 20"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js ≥ 20"
    exit 1
fi
echo "✅ Node.js $(node -v) found"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python ≥ 3.11"
    exit 1
fi

PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 11 ]); then
    echo "❌ Python version $PYTHON_VERSION is too old. Please install Python ≥ 3.11"
    exit 1
fi
echo "✅ Python $PYTHON_VERSION found"

# Check Rust (for Tauri)
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust not found. Please install Rust from https://rustup.rs"
    exit 1
fi
echo "✅ Rust $(rustc --version | cut -d' ' -f2) found"

# Set up Python virtual environment
echo "🐍 Setting up Python backend..."
cd template

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "✅ Created Python virtual environment"
fi

source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Installed Python dependencies"

cd ..

# Set up Node.js frontend
echo "⚛️  Setting up React frontend..."
cd targets/desktop-tauri/app/ui

if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Installed Node.js dependencies"
else
    echo "✅ Node.js dependencies already installed"
fi

# Run tests to verify setup
echo "🧪 Running tests to verify setup..."
npm run test -- --run
echo "✅ Tests passed!"

cd ../../../../

# Create launch scripts
echo "🚀 Creating launch scripts..."

# Backend launch script
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd template
source .venv/bin/activate
echo "🚀 Starting Smartbot FastAPI backend on http://localhost:8000"
uvicorn template.core.main:app --reload --host 127.0.0.1 --port 8000
EOF
chmod +x start-backend.sh

# Frontend launch script  
cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd targets/desktop-tauri/app/ui
echo "🚀 Starting Smartbot React frontend on http://localhost:5173"
npm run dev
EOF
chmod +x start-frontend.sh

# Combined launch script
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🤖 Starting Smartbot Desktop development servers..."
echo "📍 Backend: http://localhost:8000"
echo "📍 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Start backend in background
./start-backend.sh &
BACKEND_PID=$!

# Start frontend in foreground
./start-frontend.sh

# Clean up background process when frontend exits
kill $BACKEND_PID 2>/dev/null || true
EOF
chmod +x start-dev.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Start development: ./start-dev.sh"
echo "  2. Or start components separately:"
echo "     - Backend: ./start-backend.sh"
echo "     - Frontend: ./start-frontend.sh"
echo "  3. Run tests: cd targets/desktop-tauri/app/ui && npm run test"
echo "  4. Build desktop app: cd targets/desktop-tauri/app/ui && npm run tauri:build"
echo ""
echo "📖 Read the full documentation in README.md"
echo "🤝 Contributing guide: smartbot_contributor_onboarding_workflow.md"
echo ""
echo "Happy building! 🚀"