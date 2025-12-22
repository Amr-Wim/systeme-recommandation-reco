// This is the entry point for the React frontend application.

// Import Bootstrap CSS for styling.
import 'bootstrap/dist/css/bootstrap.min.css';
// Import React and the root rendering function.
import React from 'react';
import { createRoot } from 'react-dom/client';
// Import the main App component.
import App from './app';

// Get the root DOM element and create a React root.
const root = createRoot(document.getElementById('root'));
// Render the App component into the root element.
root.render(<App />);