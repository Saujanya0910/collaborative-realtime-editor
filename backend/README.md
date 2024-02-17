# Real-time Code Editor Web App
A real-time code editor web app that allows users to share and edit code in real-time. The app is built using React.js built using Vite for the frontend, and Node.js, Express.js, and Socket.io for the backend. All the data is stored in-memory and is not persisted.

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
- Backend
  - Node.js
  - Express.js
  - Socket.io

## Installation
The repository is a mono-repo, hence, it contains two directories, *frontend*, and *backend*. The *frontend* directory contains the code for the frontend of the app, and the backend directory contains the code for the backend of the app.

```bash
# Clone the repository
git clone

# Change the directory
cd collaborative-realtime-editor

# Switch to the backend directory
cd backend

# Install the dependencies
npm install
```

## Usage
```bash

# From the root directory, switch to the backend directory
cd backend

# Run the server
npm run start:dev

# The backend server will start on port mentioned in the environment variable, else on port 3001 by default.
```