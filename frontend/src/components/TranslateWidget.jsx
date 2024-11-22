// src/components/TranslateWidget.jsx
import { useEffect, useState } from 'react';
import './TranslateWidget.css';

const TranslateWidget = ({ onLoad }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Add Google Translate script only if not already loaded
    const addScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      );

      if (!existingScript && !loaded) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.addEventListener('load', () => {
            // onLoad();
          
        });
  
        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
        };

        document.body.appendChild(script);
      } else if (typeof onLoad === 'function') {
        onLoad();
      }
    };
    addScript();
  }, [onLoad]);


  return <div id="google_translate_element" className="translate-widget" />;
};

export default TranslateWidget;