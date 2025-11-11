import { useTheme } from "../App";

export default function Navbar() {
  const { darkMode, toggleTheme, accentColor, borderRadius } = useTheme();

  return (
    <nav
      className="flex justify-between items-center px-8 py-4 border-b backdrop-blur-sm sticky top-0 z-10"
      style={{ 
        borderColor: accentColor + "30",
        backgroundColor: darkMode ? "#111827dd" : "#ffffffdd"
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: accentColor }}
        >
          T
        </div>
        <h2 className="font-bold text-xl">Theme Studio</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm opacity-70">
          <span>Current Mode:</span>
          <span className="font-medium">{darkMode ? "Dark" : "Light"}</span>
        </div>
        
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 font-medium transition-all hover:scale-105 active:scale-95"
          style={{ 
            backgroundColor: accentColor,
            color: "white",
            borderRadius: `${borderRadius}px`
          }}
        >
          <span className="text-lg">
            {darkMode ? "☀️" : "🌙"}
          </span>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
