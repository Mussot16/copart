const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Set the countdown to 24 hours (in milliseconds)
const COUNTDOWN_DURATION = 24 * 60 * 60 * 1000;
let countdownTime = COUNTDOWN_DURATION; // Initial 24-hour countdown

// Function to format time as HH:MM:SS
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Broadcast the updated time to all connected clients
const broadcastTime = () => {
  const formattedTime = formatTime(countdownTime);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ remainingTime: formattedTime }));
    }
  });
};

// Start the countdown
const startCountdown = () => {
  setInterval(() => {
    if (countdownTime > 0) {
      countdownTime -= 1000; // Decrease by one second (1000ms)
      broadcastTime();
    } else {
      clearInterval(this); // Stop the interval when time runs out
      broadcastTime(); // Final broadcast to show 00:00:00
    }
  }, 1000); // Run every second
};

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  // Send the initial remaining time when a new client connects
  ws.send(JSON.stringify({ remainingTime: formatTime(countdownTime) }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the countdown timer
startCountdown();

// Start the HTTP server on port 3001
server.listen(3002, () => {
  console.log('WebSocket server started on ws://localhost:3002');
});
