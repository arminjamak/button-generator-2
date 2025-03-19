import React, { useState } from 'react';
import chroma from 'chroma-js';

const textStyles = {
  title: {
    'Clean': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '2rem',
      fontWeight: '600'
    },
    'Elegant': {
      fontFamily: 'Playfair Display, serif',
      fontSize: '2.25rem',
      fontWeight: '600'
    },
    'Basic': {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1.875rem',
      fontWeight: '600'
    }
  },
  body: {
    'Clean': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      fontWeight: '400'
    },
    'Elegant': {
      fontFamily: 'Playfair Display, serif',
      fontSize: '1.125rem',
      fontWeight: '400'
    },
    'Basic': {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1rem',
      fontWeight: '400'
    }
  }
};

const colorPalette = {
  'White': '#FFFFFF',
  'Black': '#000000',
  'Accent 1': '#3B82F6',
  'Accent 2': '#10B981',
  'Accent 3': '#8B5CF6'
};

function App() {
  const [titleStyle, setTitleStyle] = useState('Clean');
  const [bodyStyle, setBodyStyle] = useState('Clean');
  const [backgroundColor, setBackgroundColor] = useState('Grey');
  const [optionsColor, setOptionsColor] = useState('Grey');
  const [checkAnswerColor, setCheckAnswerColor] = useState('Black');
  const [questionText, setQuestionText] = useState('Question');
  const [layout, setLayout] = useState('fullscreen');

  const randomizeColors = () => {
    // Randomly select title and body fonts
    const titleStyles = Object.keys(textStyles.title);
    const bodyStyles = Object.keys(textStyles.body);
    const newTitleStyle = titleStyles[Math.floor(Math.random() * titleStyles.length)];
    const newBodyStyle = bodyStyles[Math.floor(Math.random() * bodyStyles.length)];

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

    // Select options color
    const newOptionsColor = getRandomItem(neutralColors);

    // Select check answer color
    let newCheckAnswerColor;
    if (Math.random() < 0.5) {
      // Use a neutral color
      newCheckAnswerColor = getRandomItem(neutralColors);
    } else {
      // Use accent color
      newCheckAnswerColor = getRandomItem(accentColors);
    }

    // Update all states
    setTitleStyle(newTitleStyle);
    setBodyStyle(newBodyStyle);
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
    ...textStyles.body[bodyStyle],
    backgroundColor: optColor,
    color: optionsTextColor,
    border: optionsBorder,
    '--base-color': optColor,
    '--hover-color': optionsHoverColor
  };

  const checkAnswerButtonStyle = {
    ...textStyles.body[bodyStyle],
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
    ...textStyles.title[titleStyle],
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
        <h1 style={titleTextStyle}>
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
        <button
          onClick={randomizeColors}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '24px',
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
          Randomize Colors
        </button>
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
          <label>Title text</label>
          <select value={titleStyle} onChange={(e) => setTitleStyle(e.target.value)}>
            {Object.keys(textStyles.title).map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Body text</label>
          <select value={bodyStyle} onChange={(e) => setBodyStyle(e.target.value)}>
            {Object.keys(textStyles.body).map(style => (
              <option key={style} value={style}>{style}</option>
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
