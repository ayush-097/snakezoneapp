# Snake Zone - Mobile App

A responsive web-based Snake game built with HTML5, CSS3, and JavaScript, featuring a hardware-accelerated canvas engine, offline support, and modern UI.

## 🚀 Features

### Core Gameplay
- **Hardware-Accelerated Canvas**: Ultra-smooth 60fps gameplay using `OffscreenCanvas` and Web Workers
- **Multiplayer Support**: Real-time online multiplayer with [Socket.IO](https://socket.io)
- **Energy System**: Drain energy while moving, recharge when stationary
- **Boost Mode**: Temporary speed and score multiplier
- **AI Snakes**: Smart bot opponents with realistic behavior

### UI & UX
- **Modern Design**: Glassmorphism with smooth gradients and animations
- **Responsive Layout**: Adapts to desktop, tablet, and mobile devices
- **Mobile Controls**: Intuitive touch joystick and boost button
- **Game Center**: Leaderboard, session management, and player stats
- **Keyboard Shortcuts**: WASD/Arrow keys for movement, Space for boost

### Technical Features
- **Offline Support**: Service Worker for Progressive Web App (PWA) capabilities
- **Modular Architecture**: Organized into reusable components and modules
- **Performance Optimized**: Minimal DOM manipulation, efficient resource management
- **Theme Support**: Dark mode with customizable color schemes

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup and Canvas API
- **CSS3**: Custom properties, flexbox, grid, animations
- **JavaScript (ES6+)**: Modern language features
- **Web Workers**: Offload game loop for smoother performance
- **Service Workers**: Offline caching and PWA functionality

### Backend & Real-time
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for API and routing
- **Socket.IO**: Real-time event handling and multiplayer

### Tools
- **Vite**: Build tool and development server
- **Webpack**: Bundling and optimization (for non-React build)
- **Babel**: JavaScript transpilation
- **PostCSS**: CSS preprocessing and autoprefixing

## 📂 Project Structure

```
snakezoneapp/
├── dist/                  # Compiled production build
├── src/
│   ├── components/        # Reusable UI components (React)
│   ├── modules/           # Game logic modules
│   ├── pages/             # Page components (React)
│   ├── App.js             # Main application component (React)
│   └── gameHtml.js        # Game canvas engine (HTML/JS)
├── public/                # Static assets
│   ├── index.html         # Main HTML entry point
│   ├── styles.css         # Main CSS styles
│   └── assets/           # Images, fonts, etc.
├── server.js              # Express.js server
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd snakezoneapp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development
Run the development server:
```bash
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5173` (or configured port)

### Production Build
Build the project for production:
```bash
npm run build
# or
yarn build
```
Production files will be generated in the `dist/` directory

### Running the Server
Start the Node.js backend:
```bash
npm run start
# or
yarn start
```

## 🎮 How to Play

### Keyboard Controls (Desktop)
- **WASD** or **Arrow Keys**: Move snake
- **Space Bar**: Boost (temporary speed increase)
- **P**: Pause/Resume game
- **M**: Toggle sound
- **R**: Restart game

### Touch Controls (Mobile)
- **Joystick**: Swipe in desired direction to move
- **Boost Button**: Tap to activate boost mode
- **Tap Center**: Pause/Resume
- **Long Press**: Toggle sound

### Game Rules
- Eat glowing pellets to grow longer
- Avoid colliding with walls or your own body
- Avoid colliding with other snakes
- Boost temporarily increases speed but drains energy
- Recharge energy by staying still
- Reach the top of the leaderboard to earn points

## 📱 Mobile App

To run this as a native mobile app:

1. Install Expo CLI:
   ```bash
   npm install -g expo-cli
   ```

2. Run the app:
   ```bash
   npm run mobile:ios  # For iOS
   # or
   npm run mobile:android # For Android
   ```
   Alternatively, use `expo start` to run in development mode.

3. Scan the QR code with Expo Go app on your device or use simulators.

## 🌐 Online Multiplayer

To enable online multiplayer, the backend server must be accessible from the internet. The app automatically uses the backend URL defined in `.env` (default: `http://localhost:3000`).

For public access, you can use:
- **ngrok** for temporary public URLs
- **Heroku/Render** for persistent deployment
- **Cloudflare Tunnel** for secure remote access

## 📁 Customization

### Configuration
Update `.env` file for environment-specific settings:
```env
# Server settings
PORT=3000
BACKEND_URL=http://localhost:3000

# Socket.IO settings
SOCKET_IO_PORT=3001

# Database (optional)
DATABASE_URL=mongodb://localhost:27017/snakezone
```

### Theme Customization
Modify colors in `src/styles/theme.js` (React) or `public/styles.css`:
```javascript
// src/styles/theme.js
export const theme = {
  primary: '#00d4ff',
  secondary: '#3a0ca3',
  accent: '#ff0055',
  background: '#0f0029',
  text: '#ffffff'
};
```

### Game Parameters
Adjust game settings in `src/modules/gameEngine.js`:
```javascript
// Constants for game parameters
const INITIAL_SNAKE_LENGTH = 3;
const MAX_SNAKE_LENGTH = 500;
const ENERGY_RECHARGE_RATE = 2;
const ENERGY_DRAIN_RATE = 1;
const BOOST_MULTIPLIER = 2;
```

## 🧪 Testing

Run unit tests (if available):
```bash
npm test
# or
yarn test

# or

npx expo start
```

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ using **React** and **Node.js**