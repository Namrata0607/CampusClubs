import './App.css'
import React, { useState, createContext, useContext } from "react";
import Navbar from "./components/Navbar";
import ThemeCustomizer from "./components/ThemeCustomizer";

// Create context to store theme data
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#1f2937");
  const [fontSize, setFontSize] = useState(16);
  const [borderRadius, setBorderRadius] = useState(8);
  const [fontFamily, setFontFamily] = useState("Inter");

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      setBackgroundColor("#111827");
      setTextColor("#f9fafb");
    } else {
      setBackgroundColor("#ffffff");
      setTextColor("#1f2937");
    }
  };

  const themeValue = {
    darkMode,
    toggleTheme,
    accentColor,
    setAccentColor,
    backgroundColor,
    setBackgroundColor,
    textColor,
    setTextColor,
    fontSize,
    setFontSize,
    borderRadius,
    setBorderRadius,
    fontFamily,
    setFontFamily
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <div
        style={{
          backgroundColor: darkMode ? "#111827" : backgroundColor,
          color: darkMode ? "#f9fafb" : textColor,
          fontSize: `${fontSize}px`,
          fontFamily: fontFamily,
          minHeight: "100vh",
          transition: "all 0.3s ease"
        }}
      >
        <Navbar />
        <main className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                style={{ fontSize: `${fontSize + 20}px` }}
              >
                🎨 Advanced Theme Studio
              </h1>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Create your perfect theme with our interactive customizer. 
                Change colors, fonts, sizes, and see live preview!
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <ThemeCustomizer />
              
              {/* Live Preview Section */}
              <div 
                className="p-8 rounded-lg border-2 shadow-lg"
                style={{ 
                  borderColor: accentColor,
                  borderRadius: `${borderRadius}px`,
                  backgroundColor: darkMode ? "#1f2937" : "#f9fafb"
                }}
              >
                <h3 
                  className="text-2xl font-bold mb-6"
                  style={{ color: accentColor }}
                >
                  Live Preview
                </h3>
                
                <div className="space-y-4">
                  <button 
                    className="px-6 py-3 text-white font-medium transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: accentColor,
                      borderRadius: `${borderRadius}px`
                    }}
                  >
                    Primary Button
                  </button>
                  
                  <div 
                    className="p-4 border"
                    style={{ 
                      borderRadius: `${borderRadius}px`,
                      borderColor: accentColor + "40",
                      backgroundColor: accentColor + "10"
                    }}
                  >
                    <h4 className="font-semibold mb-2">Sample Card</h4>
                    <p className="opacity-70">This is how your content will look with the current theme settings.</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {['Tag 1', 'Tag 2', 'Tag 3'].map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 text-sm font-medium"
                        style={{ 
                          backgroundColor: accentColor + "20",
                          color: accentColor,
                          borderRadius: `${borderRadius / 2}px`
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
