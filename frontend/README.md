# Real-time Code Editor Web App
A real-time code editor web app that allows users to share and edit code in real-time. Also lets users compile and execute their code in real-time.
The app is built using React.js built using Vite for the frontend, and Node.js, Express.js, and Socket.io for the backend. All the data is stored in-memory and is not persisted as of v2.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)

## Features
- Real-time code sharing
- Real-time code editing
- Real-time code collaboration

## Technologies
- Frontend
  - React.js
  - Ant Design UI
  - Vite

## Installation

```bash
# Clone the repository
git clone

# Change the directory
cd collaborative-realtime-editor

# Switch to the frontend directory
cd frontend

# Install the dependencies
npm install
```

## Usage
```bash

# From the root directory, switch to the frontend directory
cd frontend

# Create a .env file in the root of the frontend directory and add the following environment variables
VITE_REACT_APP_BACKEND_URL=<YOUR_BACKEND_URL>
VITE_REACT_APP_ENCRYPTION_KEY=<YOUR_ENCRYPTION_KEY> # must be same as the backend's encryption key
VITE_REACT_APP_ENCRYPTION_IV=<YOUR_ENCRYPTION_IV> # must be same as the backend's encryption IV

# Run the server
npm run dev

# The frontend server will start on port 5173 by default.
```