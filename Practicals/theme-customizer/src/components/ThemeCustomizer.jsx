import { useTheme } from "../App";

export default function ThemeCustomizer() {
  const { 
    darkMode,
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
  } = useTheme();

  const presetColors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", 
    "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
  ];

  const fontOptions = [
    "Inter", "Roboto", "Poppins", "Open Sans", 
    "Montserrat", "Lato", "Source Sans Pro", "Nunito"
  ];

  return (
    <div 
      className="p-8 rounded-lg border shadow-lg space-y-8"
      style={{ 
        borderRadius: `${borderRadius}px`,
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        borderColor: accentColor + "40"
      }}
    >
      <h3 
        className="text-2xl font-bold text-center"
        style={{ color: accentColor }}
      >
        ⚙️ Theme Controls
      </h3>

      {/* Color Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">🎨 Colors</h4>
        
        <div>
          <label className="block text-sm font-medium mb-2">Accent Color</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-12 h-12 border-none cursor-pointer rounded-lg"
            />
            <span className="text-sm font-mono">{accentColor}</span>
          </div>
          
          <div className="flex gap-2 mt-3">
            {presetColors.map(color => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className="w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform"
                style={{ 
                  backgroundColor: color,
                  borderColor: accentColor === color ? "#000" : "transparent"
                }}
              />
            ))}
          </div>
        </div>

        {!darkMode && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-12 border-none cursor-pointer rounded-lg"
                />
                <span className="text-sm font-mono">{backgroundColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-12 border-none cursor-pointer rounded-lg"
                />
                <span className="text-sm font-mono">{textColor}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Typography Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">📝 Typography</h4>
        
        <div>
          <label className="block text-sm font-medium mb-2">Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full p-3 border rounded-lg bg-transparent"
            style={{ borderColor: accentColor + "40" }}
          >
            {fontOptions.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Font Size: {fontSize}px</label>
          <input
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${((fontSize - 12) / 12) * 100}%, #e5e7eb ${((fontSize - 12) / 12) * 100}%, #e5e7eb 100%)`
            }}
          />
        </div>
      </div>

      {/* Layout Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">📐 Layout</h4>
        
        <div>
          <label className="block text-sm font-medium mb-2">Border Radius: {borderRadius}px</label>
          <input
            type="range"
            min="0"
            max="24"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${(borderRadius / 24) * 100}%, #e5e7eb ${(borderRadius / 24) * 100}%, #e5e7eb 100%)`
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">⚡ Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setAccentColor("#3b82f6");
              setFontSize(16);
              setBorderRadius(8);
              setFontFamily("Inter");
            }}
            className="p-3 border rounded-lg hover:opacity-80 transition-opacity"
            style={{ 
              borderColor: accentColor + "40",
              backgroundColor: accentColor + "10"
            }}
          >
            🔄 Reset
          </button>
          
          <button
            onClick={() => {
              setAccentColor("#ec4899");
              setFontSize(18);
              setBorderRadius(16);
              setFontFamily("Poppins");
            }}
            className="p-3 border rounded-lg hover:opacity-80 transition-opacity"
            style={{ 
              borderColor: accentColor + "40",
              backgroundColor: accentColor + "10"
            }}
          >
            💖 Cute Theme
          </button>
          
          <button
            onClick={() => {
              setAccentColor("#10b981");
              setFontSize(16);
              setBorderRadius(4);
              setFontFamily("Roboto");
            }}
            className="p-3 border rounded-lg hover:opacity-80 transition-opacity"
            style={{ 
              borderColor: accentColor + "40",
              backgroundColor: accentColor + "10"
            }}
          >
            💼 Professional
          </button>
          
          <button
            onClick={() => {
              setAccentColor("#f59e0b");
              setFontSize(20);
              setBorderRadius(12);
              setFontFamily("Montserrat");
            }}
            className="p-3 border rounded-lg hover:opacity-80 transition-opacity"
            style={{ 
              borderColor: accentColor + "40",
              backgroundColor: accentColor + "10"
            }}
          >
            🎨 Creative
          </button>
        </div>
      </div>
    </div>
  );
}
