require("dotenv").config({ quiet: true });

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const PORT = 3000;
const CLASSROOM_ROOM = "classroom";
const MESSAGE_COOLDOWN_MS = 1000;
const MAX_NAME_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_RECENT_MESSAGES = 50;
const DISPLAY_COLORS = ["#155043", "#2451a6", "#7a3f99", "#8a3b2f", "#6b5b13", "#006d77"];

const roomPassword = process.env.ROOM_PASSWORD;

if (!roomPassword) {
  console.error("ROOM_PASSWORD is required. Set it in your environment or .env file.");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = new Map();
const recentMessages = [];

app.use(express.static(path.join(__dirname, "public")));

function currentUsersList() {
  return Array.from(users.values()).map((user) => ({
    name: user.name,
    color: user.color
  }));
}

function sendAppError(socket, message) {
  socket.emit("app:error", { message });
}

function trimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assignDisplayColor(requestedColor) {
  if (DISPLAY_COLORS.includes(requestedColor)) {
    return requestedColor;
  }

  const colorCounts = new Map(DISPLAY_COLORS.map((color) => [color, 0]));

  users.forEach((user) => {
    colorCounts.set(user.color, (colorCounts.get(user.color) || 0) + 1);
  });

  return DISPLAY_COLORS.reduce((leastUsedColor, color) => {
    return colorCounts.get(color) < colorCounts.get(leastUsedColor) ? color : leastUsedColor;
  }, DISPLAY_COLORS[0]);
}

io.on("connection", (socket) => {
  socket.on("join", (payload) => {
    if (users.has(socket.id)) {
      sendAppError(socket, "You are already in the classroom.");
      return;
    }

    if (!isPlainObject(payload)) {
      sendAppError(socket, "Invalid join request.");
      return;
    }

    const { name, password, color } = payload;
    const displayName = trimmedString(name);

    if (!displayName) {
      sendAppError(socket, "Please enter your real name.");
      return;
    }

    if (displayName.length > MAX_NAME_LENGTH) {
      sendAppError(socket, `Names must be ${MAX_NAME_LENGTH} characters or fewer.`);
      return;
    }

    if (password !== roomPassword) {
      sendAppError(socket, "The room password is incorrect.");
      return;
    }

    users.set(socket.id, {
      name: displayName,
      color: assignDisplayColor(color),
      lastMessageAt: 0
    });

    socket.join(CLASSROOM_ROOM);

    const usersList = currentUsersList();
    socket.emit("join:ok", {
      users: usersList,
      recentMessages
    });
    io.to(CLASSROOM_ROOM).emit("users:update", usersList);
  });

  socket.on("chat:send", (payload) => {
    if (!users.has(socket.id)) {
      sendAppError(socket, "Please join the classroom before sending messages.");
      return;
    }

    if (!isPlainObject(payload)) {
      sendAppError(socket, "Invalid message request.");
      return;
    }

    const { text } = payload;
    const messageText = trimmedString(text);

    if (!messageText) {
      sendAppError(socket, "Please type a message before sending.");
      return;
    }

    if (messageText.length > MAX_MESSAGE_LENGTH) {
      sendAppError(socket, `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
      return;
    }

    const user = users.get(socket.id);
    const now = Date.now();

    if (now - user.lastMessageAt < MESSAGE_COOLDOWN_MS) {
      sendAppError(socket, "Please wait a moment before sending another message.");
      return;
    }

    user.lastMessageAt = now;

    const message = {
      name: user.name,
      color: user.color,
      text: messageText,
      timestamp: new Date(now).toISOString()
    };

    recentMessages.push(message);

    while (recentMessages.length > MAX_RECENT_MESSAGES) {
      recentMessages.shift();
    }

    io.to(CLASSROOM_ROOM).emit("chat:message", message);
  });

  socket.on("disconnect", () => {
    if (!users.has(socket.id)) {
      return;
    }

    users.delete(socket.id);
    io.to(CLASSROOM_ROOM).emit("users:update", currentUsersList());
  });
});

server.listen(PORT, () => {
  console.log(`Class chat listening on port ${PORT}`);
});
