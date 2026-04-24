(function () {
  const socket = io();

  const joinView = document.getElementById("join-view");
  const chatView = document.getElementById("chat-view");
  const joinForm = document.getElementById("join-form");
  const messageForm = document.getElementById("message-form");
  const nameInput = document.getElementById("name-input");
  const passwordInput = document.getElementById("password-input");
  const messageInput = document.getElementById("message-input");
  const joinError = document.getElementById("join-error");
  const chatError = document.getElementById("chat-error");
  const usersList = document.getElementById("users-list");
  const messagesList = document.getElementById("messages-list");

  let hasJoined = false;

  function setError(message) {
    const target = hasJoined ? chatError : joinError;
    target.textContent = message || "";
  }

  function clearError() {
    joinError.textContent = "";
    chatError.textContent = "";
  }

  function renderUsers(users) {
    usersList.replaceChildren();

    users.forEach((name) => {
      const item = document.createElement("li");
      item.textContent = name;
      usersList.append(item);
    });
  }

  function appendLinkedText(parent, text) {
    const urlPattern = /\bhttps?:\/\/[^\s<>"']+/gi;
    let lastIndex = 0;
    let match;

    while ((match = urlPattern.exec(text)) !== null) {
      const url = match[0];

      if (match.index > lastIndex) {
        parent.append(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      const isMarkdownLinkUrl = text.slice(Math.max(0, match.index - 2), match.index) === "](";

      if (!isMarkdownLinkUrl && (url.startsWith("http://") || url.startsWith("https://"))) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = url;
        parent.append(link);
      } else {
        parent.append(document.createTextNode(url));
      }

      lastIndex = match.index + url.length;
    }

    if (lastIndex < text.length) {
      parent.append(document.createTextNode(text.slice(lastIndex)));
    }
  }

  function renderMessage(message) {
    const article = document.createElement("article");
    article.className = "message";

    const meta = document.createElement("div");
    meta.className = "message-meta";

    const name = document.createElement("span");
    name.className = "message-name";
    name.textContent = message.name;

    const time = document.createElement("time");
    time.dateTime = message.timestamp;
    time.textContent = new Date(message.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const text = document.createElement("div");
    text.className = "message-text";
    appendLinkedText(text, message.text);

    meta.append(name, time);
    article.append(meta, text);
    messagesList.append(article);
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const name = nameInput.value.trim();
    const password = passwordInput.value;

    socket.emit("join", { name, password });
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const text = messageInput.value.trim();
    socket.emit("chat:send", { text });
    messageInput.value = "";
    messageInput.focus();
  });

  socket.on("join:ok", ({ users, recentMessages }) => {
    hasJoined = true;
    clearError();

    passwordInput.value = "";
    joinForm.reset();
    joinView.hidden = true;
    chatView.hidden = false;

    renderUsers(users);
    messagesList.replaceChildren();
    recentMessages.forEach(renderMessage);
    messageInput.focus();
  });

  socket.on("app:error", ({ message } = {}) => {
    setError(message || "Something went wrong.");
  });

  socket.on("users:update", (users) => {
    renderUsers(users);
  });

  socket.on("chat:message", (message) => {
    renderMessage(message);
  });
})();
