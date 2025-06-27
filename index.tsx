
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Correct relative path
import { HashRouter } from 'react-router-dom';

// Simulate process.env for browser environment if it doesn't exist (e.g., during development without a build tool)
if (typeof process === 'undefined') {
  // @ts-ignore
  window.process = { env: {} };
}

// Set a placeholder API_KEY if not provided by the environment.
// In a real build, this would be set through environment variables.
// For local development, you should set the API_KEY environment variable in your terminal/system.
// Example: export API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
if (!process.env.API_KEY) {
  process.env.API_KEY = "YOUR_GEMINI_API_KEY"; // THIS IS A PLACEHOLDER
  console.warn(
    "IMPORTANT: No API_KEY environment variable found. Using a placeholder key for HERE AND NOW AI Email Platform. " +
    "AI features will use mock data or may not function correctly. " +
    "For full functionality, please set your Gemini API_KEY as an environment variable."
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
