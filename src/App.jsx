import React, { useState } from 'react';
import chroma from 'chroma-js';

// Font configurations

const defaultColorPalette = {
  'White': '#FFFFFF',
  'Black': '#000000',
  'Grey': '#F3F4F6',
  'Accent 1': '#3B82F6',
  'Accent 2': '#10B981',
  'Accent 3': '#8B5CF6'
};

const allFonts = {
  display: [
    { name: 'Playfair Display', family: 'Playfair Display, serif', weight: '600', size: '2.5rem' },
    { name: 'Inter Display', family: 'Inter, sans-serif', weight: '600', size: '2.25rem' },
    { name: 'Roboto Display', family: 'Roboto, sans-serif', weight: '500', size: '2rem' },
    { name: 'Montserrat Display', family: 'Montserrat, sans-serif', weight: '600', size: '2.25rem' },
    { name: 'Raleway Display', family: 'Raleway, sans-serif', weight: '600', size: '2.25rem' },
    { name: 'Oswald Display', family: 'Oswald, sans-serif', weight: '500', size: '2.5rem' },
    { name: 'Lora Display', family: 'Lora, serif', weight: '600', size: '2.25rem' }
  ],
  body: [
    { name: 'Inter', family: 'Inter, sans-serif', weight: '400', size: '1rem' },
    { name: 'Roboto', family: 'Roboto, sans-serif', weight: '400', size: '1rem' },
    { name: 'Playfair', family: 'Playfair Display, serif', weight: '400', size: '1.125rem' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif', weight: '400', size: '1rem' },
    { name: 'Raleway', family: 'Raleway, sans-serif', weight: '400', size: '1rem' },
    { name: 'Open Sans', family: 'Open Sans, sans-serif', weight: '400', size: '1rem' },
    { name: 'Lora', family: 'Lora, serif', weight: '400', size: '1.125rem' }
  ]
};

// Function to get a random subset of fonts
const getRandomFonts = (fonts, count) => {
  const shuffled = [...fonts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateFontPair = (fonts) => {
  const displayFont = fonts.display[Math.floor(Math.random() * fonts.display.length)];
  const bodyFont = fonts.body[Math.floor(Math.random() * fonts.body.length)];
  
  // Avoid using the same font family for both
  if (displayFont.family === bodyFont.family) {
    const otherBodyFonts = fonts.body.filter(f => f.family !== displayFont.family);
    if (otherBodyFonts.length === 0) return { title: displayFont, body: bodyFont };
    return { title: displayFont, body: otherBodyFonts[0] };
  }

  return { title: displayFont, body: bodyFont };
};

let colorPalette = { ...defaultColorPalette };

function App() {
  const [backgroundColor, setBackgroundColor] = useState('Grey');
  const [optionsColor, setOptionsColor] = useState('Grey');
  const [checkAnswerColor, setCheckAnswerColor] = useState('Black');
  const [questionText, setQuestionText] = useState('Question');
  const [layout, setLayout] = useState('fullscreen');
  const [availableFonts, setAvailableFonts] = useState({
    display: getRandomFonts(allFonts.display, 3),
    body: getRandomFonts(allFonts.body, 3)
  });
  const [currentFontPair, setCurrentFontPair] = useState(() => ({
    title: availableFonts.display[0],
    body: availableFonts.body[0]
  }));

  const generateBrandKit = () => {
    // Generate new accent colors using triadic harmony
    const baseHue = Math.random() * 360; // Random base hue
    const accent1 = chroma.hsl(baseHue, 0.7, 0.5).hex();
    const accent2 = chroma.hsl((baseHue + 120) % 360, 0.7, 0.5).hex(); // +120 degrees
    const accent3 = chroma.hsl((baseHue + 240) % 360, 0.7, 0.5).hex(); // +240 degrees

    // Generate new neutral grey
    const h = Math.random() * 20; // Slight hue variation
    const s = 0.05 + Math.random() * 0.05; // 5-10% saturation
    const l = 0.3 + Math.random() * 0.4; // 30-70% lightness for better visibility
    const grey = chroma.hsl(h, s, l).hex();

    // Update color palette first
    colorPalette = {
      ...defaultColorPalette,
      'Grey': grey,
      'Accent 1': accent1,
      'Accent 2': accent2,
      'Accent 3': accent3
    };

    // Generate new set of available fonts
    const newFonts = {
      display: getRandomFonts(allFonts.display, 3),
      body: getRandomFonts(allFonts.body, 3)
    };
    setAvailableFonts(newFonts);

    // Generate and set new font pair from new available fonts
    setCurrentFontPair(generateFontPair(newFonts));

    // Define available colors
    const neutralColors = ['White', 'Grey', 'Black'];
    const accentColors = ['Accent 1', 'Accent 2', 'Accent 3'];

    // Set initial colors
    setBackgroundColor(neutralColors[Math.floor(Math.random() * neutralColors.length)]);
    setOptionsColor(neutralColors[Math.floor(Math.random() * neutralColors.length)]);
    setCheckAnswerColor(Math.random() < 0.7 ? 
      neutralColors[Math.floor(Math.random() * neutralColors.length)] : 
      accentColors[Math.floor(Math.random() * accentColors.length)]);
  };

  const randomizeStyle = () => {
    // Define background colors
    const lightBackgrounds = ['White', 'Grey'];
    const darkBackgrounds = ['Black'];
    
    // Function to get random item from array
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Select background color (alternating between light and dark)
    const currentBgLuminance = chroma(getColorValue(backgroundColor)).luminance();
    const isCurrentLight = currentBgLuminance > 0.5;
    const newBgColor = getRandomItem(isCurrentLight ? darkBackgrounds : lightBackgrounds);

    // Get available colors for options and check answer
    const neutralColors = ['White', 'Grey', 'Black'];
    const accentColors = ['Accent 1', 'Accent 2', 'Accent 3'];

    // Select options color (only neutral colors)
    const newOptionsColor = getRandomItem(neutralColors);

    // Select check answer color (30% chance for accent color)
    const newCheckAnswerColor = Math.random() < 0.7 ? 
      getRandomItem(neutralColors) : 
      getRandomItem(accentColors);

    // Update all states
    setBackgroundColor(newBgColor);
    setOptionsColor(newOptionsColor);
    setCheckAnswerColor(newCheckAnswerColor);
  };

  const calculateTextColor = (bgColor) => {
    const whiteContrast = chroma.contrast(bgColor, '#FFFFFF');
    const blackContrast = chroma.contrast(bgColor, '#000000');
    return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
  };

  const adjustColor = (color, isLight) => {
    return isLight 
      ? chroma(color).darken(0.2).hex()  // Light color -> slightly darker
      : chroma(color).brighten(0.8).hex(); // Dark color -> much lighter
  };

  const getColorValue = (colorName) => {
    switch(colorName) {
      case 'White': return '#FFFFFF';
      case 'Black': return '#000000';
      case 'Grey': return '#F3F4F6';

      case 'Accent 1': return colorPalette['Accent 1'];
      case 'Accent 2': return colorPalette['Accent 2'];
      case 'Accent 3': return colorPalette['Accent 3'];
      default: return colorName;
    }
  };

  const bgColor = getColorValue(backgroundColor);
  const optColor = getColorValue(optionsColor);
  const checkColor = getColorValue(checkAnswerColor);
  
  const questionTextColor = calculateTextColor(bgColor);
  const optionsTextColor = calculateTextColor(optColor);
  const checkAnswerTextColor = calculateTextColor(checkColor);

  const isLightOptions = chroma(optColor).luminance() > 0.5;
  const isLightCheckAnswer = chroma(checkColor).luminance() > 0.5;
  
  const optionsHoverColor = adjustColor(optColor, isLightOptions);
  const checkAnswerHoverColor = adjustColor(checkColor, isLightCheckAnswer);

  // New border logic with more prominent borders
  const getButtonBorder = (buttonColor, backgroundCol) => {
    if (buttonColor === backgroundCol) {
      const isLight = chroma(buttonColor).luminance() > 0.5;
      const borderColor = isLight 
        ? chroma(buttonColor).darken(0.8).hex()  // Doubled contrast for light colors
        : chroma(buttonColor).brighten(0.8).hex(); // Doubled contrast for dark colors
      return `2px solid ${borderColor}`; // Increased border width
    }
    return 'none';
  };

  const getDividerColor = () => {
    // If any button has a border, use that border color
    if (optionsBorder !== 'none') {
      return optionsBorder.split(' ')[2]; // Get the color from "2px solid #COLOR"
    }
    if (checkAnswerBorder !== 'none') {
      return checkAnswerBorder.split(' ')[2];
    }
    
    // Otherwise, calculate based on background with more contrast
    const isLightBg = chroma(bgColor).luminance() > 0.5;
    return isLightBg
      ? chroma(bgColor).darken(0.4).hex()  // Make darker colors more prominent
      : chroma(bgColor).brighten(0.4).hex(); // Make lighter colors more prominent
  };

  const optionsBorder = getButtonBorder(optColor, bgColor);
  const checkAnswerBorder = getButtonBorder(checkColor, bgColor);
  const dividerColor = getDividerColor();

  // Style objects for buttons
  const optionButtonStyle = {
    fontFamily: currentFontPair.body.family,
    fontSize: currentFontPair.body.size,
    fontWeight: currentFontPair.body.weight,
    backgroundColor: optColor,
    color: optionsTextColor,
    border: optionsBorder,
    '--base-color': optColor,
    '--hover-color': optionsHoverColor
  };

  const checkAnswerButtonStyle = {
    fontFamily: currentFontPair.body.family,
    fontSize: currentFontPair.body.size,
    fontWeight: currentFontPair.body.weight,
    backgroundColor: checkColor,
    color: checkAnswerTextColor,
    border: checkAnswerBorder,
    '--base-color': checkColor,
    '--hover-color': checkAnswerHoverColor
  };

  const previewStyle = {
    backgroundColor: bgColor,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: layout === 'fullscreen' ? '800px' : '400px',
    height: '450px',
    flexShrink: 0,
    overflow: layout === 'fullscreen' ? 'auto' : 'hidden'
  };

  const controlsStyle = {
    width: '400px',
    flexShrink: 0,
    padding: '32px'
  };

  const optionsGridStyle = {
    display: 'grid',
    gap: layout === 'fullscreen' ? '16px' : '12px',
    ...(layout === 'fullscreen' ? {
      margin: '0 0 96px 0',
      gridTemplateColumns: 'repeat(2, 1fr)',
    } : {
      margin: '0 0 64px 0',
      gridTemplateColumns: '1fr',
    })
  };

  const checkAnswerSectionStyle = {
    position: 'absolute',
    bottom: '32px',
    left: '32px',
    right: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: bgColor
  };

  const dividerStyle = {
    width: 'calc(100% + 64px)',
    height: '2px',
    backgroundColor: dividerColor,
    margin: '0 -32px 32px -32px',
    border: 'none',
    alignSelf: 'stretch'  // Make divider full width while button remains centered
  };

  const titleTextStyle = {
    color: questionTextColor,
    margin: layout === 'fullscreen' ? '32px 0 0 0' : '16px 0 -20px 0',
    textAlign: layout === 'fullscreen' ? 'center' : 'left',
    ...(layout === 'half' && {
      fontSize: '1.5rem'  // Smaller font size in half screen mode
    })
  };

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      gap: '32px',
      padding: '32px',
      minHeight: '100vh',
      alignItems: 'flex-start'
    }}>
      <div className="preview" style={previewStyle}>
        <h1 style={{ 
          fontFamily: currentFontPair.title.family,
          fontSize: currentFontPair.title.size,
          fontWeight: currentFontPair.title.weight,
          ...titleTextStyle
        }}>
          {questionText}
        </h1>
        <div className="options-grid" style={optionsGridStyle}>
          {['First option', 'Second option', 'Third option', 'Fourth option'].map((text, index) => (
            <button
              key={index}
              className="option-button"
              style={{
                ...optionButtonStyle,
                ...(layout === 'half' && {
                  padding: '16px 16px',  // Updated to 16px vertical padding
                  fontSize: '0.875rem'  // Smaller font size in half screen mode
                })
              }}
            >
              {text}
            </button>
          ))}
        </div>
        <div style={checkAnswerSectionStyle}>
          <hr style={dividerStyle} />
          <button
            className="check-answer-button"
            style={checkAnswerButtonStyle}
          >
            Check answer
          </button>
        </div>
      </div>

      <div className="controls" style={controlsStyle}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={generateBrandKit}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#1D4ED8'
              }
            }}
          >
            New Brand Kit
          </button>
          <button
            onClick={randomizeStyle}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#4B5563',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#374151'
              }
            }}
          >
            Randomize Style
          </button>
        </div>
        <div className="control-group">
          <label>Layout</label>
          <select 
            value={layout} 
            onChange={(e) => setLayout(e.target.value)}
          >
            <option value="fullscreen">Fullscreen</option>
            <option value="half">Half screen</option>
          </select>
        </div>

        <div className="control-group">
          <label>Title font</label>
          <select 
            value={currentFontPair.title.fontFamily} 
            onChange={(e) => setCurrentFontPair(prev => ({
              ...prev,
              title: availableFonts.display.find(f => f.family === e.target.value)
            }))}
          >
            {availableFonts.display.map(font => (
              <option key={font.family} value={font.family}>{font.name}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Body font</label>
          <select 
            value={currentFontPair.body.fontFamily} 
            onChange={(e) => setCurrentFontPair(prev => ({
              ...prev,
              body: availableFonts.body.find(f => f.family === e.target.value)
            }))}
          >
            {availableFonts.body.map(font => (
              <option key={font.family} value={font.family}>{font.name}</option>
            ))}
          </select>
        </div>



        <div className="control-group">
          <label>Background color</label>
          <select value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)}>
            <option value="White">White</option>
            <option value="Grey">Grey</option>
            <option value="Black">Black</option>
            <option value="Accent 1">Accent 1</option>
            <option value="Accent 2">Accent 2</option>
            <option value="Accent 3">Accent 3</option>
          </select>
        </div>

        <div className="control-group">
          <label>Options color</label>
          <select value={optionsColor} onChange={(e) => setOptionsColor(e.target.value)}>
            <option value="White">White</option>
            <option value="Grey">Grey</option>
            <option value="Black">Black</option>
            <option value="Accent 1">Accent 1</option>
            <option value="Accent 2">Accent 2</option>
            <option value="Accent 3">Accent 3</option>
          </select>
        </div>

        <div className="control-group">
          <label>Check answer color</label>
          <select value={checkAnswerColor} onChange={(e) => setCheckAnswerColor(e.target.value)}>
            <option value="White">White</option>
            <option value="Grey">Grey</option>
            <option value="Black">Black</option>
            <option value="Accent 1">Accent 1</option>
            <option value="Accent 2">Accent 2</option>
            <option value="Accent 3">Accent 3</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
