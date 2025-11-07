# 🥋 PomoDojo

**Train your focus, defeat procrastination**

PomoDojo is a gamified Pomodoro timer that transforms your productivity sessions into epic battles against procrastination. Fight enemies, complete missions, and build your focus discipline in a beautiful dojo-themed environment.

![PomoDojo Banner](https://img.shields.io/badge/version-1.0.0-gold?style=for-the-badge)
![Svelte](https://img.shields.io/badge/Svelte-4.2.0-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

### 🎮 Gamified Experience
- **Fighting Game Theme**: Transform your work sessions into epic battles
- **Animated Characters**: Pixel-art hero and enemy sprites with smooth animations
- **3 Unique Enemies**: Face different procrastination foes each session
- **Victory/Defeat Animations**: Celebrate wins or face consequences

### ⏱️ Pomodoro Timer
- **Flexible Sessions**: Customize focus time, session length, and break duration
- **Focus/Break Cycles**: Automatic transitions between work and rest periods
- **Visual Progress**: Fighting game-style HUD with timer and progress bars
- **Timer Extension**: Get defeated? Extend your timer and keep fighting!

### 📊 Task Management
- **Task Creation**: Set clear goals with titles and descriptions
- **Real-time Tracking**: Monitor your progress with visual indicators
- **Multiple Outcomes**: Complete, abort, or extend your missions
- **Smart Status**: Tasks can be completed, aborted, or failed

### 📜 History & Stats
- **Persistent History**: All tasks saved to localStorage
- **Beautiful History View**: Scrollable modal with all past tasks
- **Color-coded Status**: Instantly see completed, aborted, and failed tasks
- **Statistics Dashboard**: Track total tasks, victories, and defeats
- **Detailed Records**: View task duration, timestamps, and configurations

### 🎨 Beautiful UI
- **Dojo Background**: Immersive martial arts training environment
- **Frosted Glass Effects**: Modern, elegant UI components
- **Responsive Design**: Smooth animations and transitions
- **Arcade-Style Buttons**: Satisfying interactions throughout

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm, yarn, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd pomodojo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎯 How to Use

### Starting a Task
1. Click the **⚔️ Start New Task** button
2. Fill in your task details:
   - **Task Title**: What you'll be working on
   - **Description** (optional): Additional details
   - **Total Focus Time**: Overall mission duration
   - **Focus Session Length**: Individual work session time
   - **Break Duration**: Rest time between sessions
3. Click **Start Mission** to begin

### During a Task
- **Focus Sessions**: Work while the timer counts down
- **Break Sessions**: Automatic breaks between focus periods
- **Complete**: Click ✓ when you finish your task (victory animation!)
- **Abort**: Click ✕ to forfeit the mission
- **Extend**: If time runs out, add more time to keep going

### Viewing History
1. Click the **📜 scroll icon** in the top-right corner
2. Browse all your past tasks
3. See detailed stats and success rates

## 🛠️ Tech Stack

- **Frontend Framework**: Svelte 4.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Custom CSS with modern effects
- **State Management**: Svelte stores and reactive statements
- **Data Persistence**: localStorage API
- **Assets**: Pixel-art sprite sheets

## 📁 Project Structure

```
pomodojo/
├── assets/
│   ├── bg.jpg                  # Dojo background
│   ├── hero/sprites/           # Hero character animations
│   └── enemy1-3/sprites/       # Enemy character animations
├── src/
│   ├── components/
│   │   ├── HomePage.svelte     # Main game view
│   │   ├── TaskModal.svelte    # Task creation dialog
│   │   └── HistoryView.svelte  # History modal
│   ├── App.svelte              # Root component & state management
│   ├── main.js                 # Entry point
│   └── app.css                 # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Development

### Build for Production
```bash
npm run build
# Output will be in the dist/ directory
```

### Preview Production Build
```bash
npm run preview
```

### Customize Configuration
Edit `vite.config.js` to modify build settings, plugins, or optimization options.

## 🌐 Deployment

### Deploy to GitHub Pages
1. Create a repository on GitHub
2. Add the remote:
   ```bash
   git remote add origin https://github.com/yourusername/pomodojo.git
   ```
3. Push your code:
   ```bash
   git push -u origin master
   ```
4. Configure GitHub Pages in repository settings

### Deploy to Vercel/Netlify
1. Import your Git repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy!

## 🎨 Customization Ideas

- **Add More Enemies**: Create new enemy sprites and expand variety
- **Sound Effects**: Add audio for attacks, victories, and defeats
- **Difficulty Levels**: Adjust enemy strength based on task difficulty
- **Power-ups**: Bonus features for completing streaks
- **Leaderboard**: Compare stats with friends
- **Dark/Light Modes**: Additional theme options
- **Mobile Support**: Optimize for touch interfaces

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Pixel art sprites for creating the fighting game aesthetic
- Pomodoro Technique by Francesco Cirillo
- Svelte team for the amazing framework

## 📞 Contact

Created by [Your Name] - Feel free to reach out!

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

**Ready to train your focus?** Start your first mission and defeat procrastination! 🥋⚔️

