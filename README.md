# Real-time Code Editor Web App (v2)
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
- Backend
  - Node.js
  - Express.js
  - Socket.io
  - Judge0 CE API (for code compilation and execution) (refer to the [Judge0 CE API](https://rapidapi.com/judge0-official/api/judge0-ce))

## Installation
The repository is a mono-repo, hence, it contains two directories, *frontend*, and *backend*. The *frontend* directory contains the code for the frontend of the app, and the *backend* directory contains the code for the backend of the app.

```bash
# Clone the repository
git clone

# Change the directory
cd collaborative-realtime-editor

# Switch to the frontend directory
cd frontend

# Install the dependencies
npm install

# Switch to the backend directory
cd backend

# Install the dependencies
npm install
```

## Usage
```bash

# From the root directory, switch to the frontend directory
cd frontend

# Run the server
npm run dev

# From the root directory, switch to the backend directory
cd backend

# Run the server
npm run start:dev

# The frontend server will start on port 5173 by default, and the backend server will start on port mentioned in the environment variable, else on port 3001 by default.

# Refer to the README in the respective directories for more information.
```

# TODO
- [X] Add support for multiple programming languages (v1)
- [X] Add support for multiple themes (v1)
- [X] Add support for code compilation and execution (v2)
