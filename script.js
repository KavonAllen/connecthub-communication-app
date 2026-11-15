const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messageSearchInput = document.getElementById("message-search-input");
const messageFeed = document.getElementById("message-feed");
const channelTitle = document.getElementById("current-channel-title");
const channelDescription = document.getElementById("channel-description");
const channelList = document.querySelector(".channel-list");
const addChannelButton = document.getElementById("add-channel-button");
const homeButton = document.getElementById("nav-home");
const directMessagesButton = document.getElementById("nav-direct-messages");
const savedMessagesButton = document.getElementById("nav-saved-messages");
const profileArea = document.getElementById("profile-area");
const profileButton = document.getElementById("profile-button");
const profilePanel = document.getElementById("profile-panel");

const SAVED_MESSAGES_STORAGE_KEY = "connecthub.savedMessages";
const CHANNELS_STORAGE_KEY = "connecthub.channels";

if (
  !(messageForm instanceof HTMLFormElement) ||
  !(messageInput instanceof HTMLInputElement) ||
  !(messageSearchInput instanceof HTMLInputElement) ||
  !(messageFeed instanceof HTMLOListElement) ||
  !(channelTitle instanceof HTMLHeadingElement) ||
  !(channelDescription instanceof HTMLParagraphElement) ||
  !(channelList instanceof HTMLUListElement) ||
  !(addChannelButton instanceof HTMLButtonElement) ||
  !(homeButton instanceof HTMLButtonElement) ||
  !(directMessagesButton instanceof HTMLButtonElement) ||
  !(savedMessagesButton instanceof HTMLButtonElement) ||
  !(profileArea instanceof HTMLElement) ||
  !(profileButton instanceof HTMLButtonElement) ||
  !(profilePanel instanceof HTMLElement) ||
  channelList.querySelectorAll(".channel-button").length === 0
) {
  throw new Error("ConnectHub is missing a required channel or message interface element.");
}

const noResultsMessage = document.createElement("p");
noResultsMessage.id = "message-search-status";
noResultsMessage.setAttribute("role", "status");
noResultsMessage.textContent = "No messages found in this channel.";
noResultsMessage.hidden = true;

const viewStatusMessage = document.createElement("p");
viewStatusMessage.id = "view-status-message";
viewStatusMessage.setAttribute("role", "status");
viewStatusMessage.hidden = true;
messageFeed.after(noResultsMessage, viewStatusMessage);

const initialGeneralMessages = Array.from(
  messageFeed.querySelectorAll(".chat-message"),
  (article) => {
    const sender = article.querySelector(".message-sender");
    const timestamp = article.querySelector("time");
    const content = article.querySelector(".message-content");

    if (
      !(sender instanceof HTMLElement) ||
      !(timestamp instanceof HTMLTimeElement) ||
      !(content instanceof HTMLElement) ||
      sender.textContent === null ||
      content.textContent === null ||
      !timestamp.dateTime
    ) {
      throw new Error("A sample message is missing its sender, timestamp, or content.");
    }

    return {
      id: article.id || article.dataset.messageId,
      sender: sender.textContent,
      timestamp: timestamp.dateTime,
      text: content.textContent,
    };
  }
);

const initialChannels = {
  general: {
    title: "General",
    description: "A place for the team to share updates and have general discussions.",
    messages: initialGeneralMessages,
  },
  announcements: {
    title: "Announcements",
    description: "Important news and updates for the whole team.",
    messages: [
      {
        id: "announcement-001",
        sender: "Nina Brooks",
        timestamp: "2026-11-15T08:30",
        text: "The all-hands meeting is scheduled for Thursday at 10 AM.",
      },
      {
        id: "announcement-002",
        sender: "Alex Morgan",
        timestamp: "2026-11-15T08:42",
        text: "The meeting notes will be shared here after the session.",
      },
    ],
  },
  development: {
    title: "Development",
    description: "Discuss code, technical questions, and development work.",
    messages: [
      {
        id: "development-001",
        sender: "Diego Ramos",
        timestamp: "2026-11-15T10:05",
        text: "The latest build is ready for review on the test environment.",
      },
      {
        id: "development-002",
        sender: "Mei Chen",
        timestamp: "2026-11-15T10:17",
        text: "I will run through the updated sign-in flow this morning.",
      },
    ],
  },
  random: {
    title: "Random",
    description: "A casual space for ideas and conversations outside the day-to-day.",
    messages: [
      {
        id: "random-001",
        sender: "Sam Rivera",
        timestamp: "2026-11-15T11:20",
        text: "Anyone have a good podcast recommendation for the commute?",
      },
      {
        id: "random-002",
        sender: "Priya Patel",
        timestamp: "2026-11-15T11:26",
        text: "I started a series about the history of design and have been enjoying it.",
      },
    ],
  },
};

function isValidChannelMessage(message) {
  return (
    message !== null &&
    typeof message === "object" &&
    typeof message.id === "string" &&
    typeof message.sender === "string" &&
    typeof message.timestamp === "string" &&
    !Number.isNaN(new Date(message.timestamp).getTime()) &&
    typeof message.text === "string"
  );
}

function loadChannels(defaultChannels) {
  let serializedChannels;
  try {
    serializedChannels = window.localStorage.getItem(CHANNELS_STORAGE_KEY);
  } catch (error) {
    console.error("Could not read channel messages from localStorage.", error);
    window.alert("Channel messages could not be loaded in this browser session.");
    return defaultChannels;
  }

  if (serializedChannels === null) {
    return defaultChannels;
  }

  let storedData;
  try {
    storedData = JSON.parse(serializedChannels);
  } catch (error) {
    console.error("Channel messages in localStorage are not valid JSON.", error);
    window.alert("Channel messages could not be loaded because the stored data is invalid.");
    return defaultChannels;
  }

  if (
    storedData === null ||
    typeof storedData !== "object" ||
    storedData.version !== 1 ||
    storedData.channels === null ||
    typeof storedData.channels !== "object" ||
    Array.isArray(storedData.channels)
  ) {
    console.error("Channel messages in localStorage do not match the expected format.");
    window.alert("Channel messages could not be loaded because the stored data is invalid.");
    return defaultChannels;
  }

  const restoredChannels = {};
  for (const [channelId, channel] of Object.entries(defaultChannels)) {
    restoredChannels[channelId] = { ...channel, messages: [...channel.messages] };
  }

  for (const [channelId, storedChannel] of Object.entries(storedData.channels)) {
    if (
      storedChannel === null ||
      typeof storedChannel !== "object" ||
      typeof storedChannel.title !== "string" ||
      typeof storedChannel.description !== "string" ||
      !Array.isArray(storedChannel.messages) ||
      !storedChannel.messages.every(isValidChannelMessage)
    ) {
      console.error(`Stored data for channel "${channelId}" is invalid.`);
      window.alert("Channel messages could not be loaded because the stored data is invalid.");
      return defaultChannels;
    }

    if (Object.prototype.hasOwnProperty.call(restoredChannels, channelId)) {
      restoredChannels[channelId].messages = storedChannel.messages;
    } else if (/^custom-\d+$/.test(channelId)) {
      restoredChannels[channelId] = {
        title: storedChannel.title,
        description: storedChannel.description,
        messages: storedChannel.messages,
      };
    } else {
      console.error(`Stored data contains an unknown channel "${channelId}".`);
      window.alert("Channel messages could not be loaded because the stored data is invalid.");
      return defaultChannels;
    }
  }

  return restoredChannels;
}

const channels = loadChannels(initialChannels);

function persistChannels() {
  const storedChannels = {};
  for (const [channelId, channel] of Object.entries(channels)) {
    storedChannels[channelId] = {
      title: channel.title,
      description: channel.description,
      messages: channel.messages,
    };
  }

  try {
    window.localStorage.setItem(
      CHANNELS_STORAGE_KEY,
      JSON.stringify({ version: 1, channels: storedChannels })
    );
  } catch (error) {
    console.error("Could not save channel messages to localStorage.", error);
    window.alert("Channel message changes could not be persisted in this browser.");
  }
}

function loadSavedMessages() {
  let serializedMessages;
  try {
    serializedMessages = window.localStorage.getItem(SAVED_MESSAGES_STORAGE_KEY);
  } catch (error) {
    console.error("Could not read saved messages from localStorage.", error);
    window.alert("Saved messages are unavailable in this browser session.");
    return [];
  }

  if (serializedMessages === null) {
    return [];
  }

  let parsedMessages;
  try {
    parsedMessages = JSON.parse(serializedMessages);
  } catch (error) {
    console.error("Saved messages in localStorage are not valid JSON.", error);
    window.alert("Saved messages could not be loaded because the stored data is invalid.");
    return [];
  }

  const isValidMessage = (message) =>
    message !== null &&
    typeof message === "object" &&
    typeof message.id === "string" &&
    typeof message.channelId === "string" &&
    typeof message.channelName === "string" &&
    typeof message.sender === "string" &&
    typeof message.timestamp === "string" &&
    typeof message.text === "string" &&
    !Number.isNaN(new Date(message.timestamp).getTime());

  if (!Array.isArray(parsedMessages) || !parsedMessages.every(isValidMessage)) {
    console.error("Saved messages in localStorage do not match the expected format.");
    window.alert("Saved messages could not be loaded because the stored data is invalid.");
    return [];
  }

  const uniqueMessages = new Map();
  for (const message of parsedMessages) {
    const key = `${message.channelId}\u0000${message.id}`;
    if (!uniqueMessages.has(key)) {
      uniqueMessages.set(key, message);
    }
  }

  return Array.from(uniqueMessages.values());
}

function persistSavedMessages(savedMessages) {
  try {
    window.localStorage.setItem(
      SAVED_MESSAGES_STORAGE_KEY,
      JSON.stringify(savedMessages)
    );
  } catch (error) {
    console.error("Could not save messages to localStorage.", error);
    window.alert("Saved message changes could not be persisted in this browser.");
  }
}

const savedMessages = loadSavedMessages();

function addChannelNavigationItem(channelId) {
  const channel = channels[channelId];
  if (!channel) {
    throw new Error(`Unknown ConnectHub channel: ${channelId}`);
  }

  const listItem = document.createElement("li");
  const button = document.createElement("button");
  button.className = "channel-button";
  button.id = `channel-${channelId}`;
  button.dataset.channel = channelId;
  button.type = "button";
  button.textContent = channel.title;
  listItem.append(button);
  channelList.append(listItem);
}

for (const button of channelList.querySelectorAll(".channel-button")) {
  const channelId = button.dataset.channel;
  if (!channelId || !Object.prototype.hasOwnProperty.call(channels, channelId)) {
    throw new Error("A channel navigation button has an unknown or missing data-channel value.");
  }
}

let restoredSavedChannelMessages = false;
for (const savedMessage of savedMessages) {
  let channel = channels[savedMessage.channelId];
  if (!channel && /^custom-\d+$/.test(savedMessage.channelId)) {
    channel = {
      title: savedMessage.channelName,
      description: `A place for the team to discuss ${savedMessage.channelName}.`,
      messages: [],
    };
    channels[savedMessage.channelId] = channel;
    restoredSavedChannelMessages = true;
  }

  if (channel && !channel.messages.some((message) => message.id === savedMessage.id)) {
    channel.messages.push({
      id: savedMessage.id,
      sender: savedMessage.sender,
      timestamp: savedMessage.timestamp,
      text: savedMessage.text,
    });
    restoredSavedChannelMessages = true;
  }
}

for (const channelId of Object.keys(channels)) {
  const hasNavigationButton = Array.from(
    channelList.querySelectorAll(".channel-button")
  ).some((button) => button.dataset.channel === channelId);
  if (!hasNavigationButton) {
    addChannelNavigationItem(channelId);
  }
}

if (restoredSavedChannelMessages) {
  persistChannels();
}

let activeChannelId = "general";
let activeView = "channel";
let generatedMessageCount = 0;

function applyMessageSearch() {
  if (activeView === "home" || activeView === "direct-messages") {
    noResultsMessage.hidden = true;
    return;
  }

  const query = messageSearchInput.value.trim().toLocaleLowerCase();
  let visibleMessageCount = 0;

  for (const listItem of messageFeed.querySelectorAll(":scope > li")) {
    const sender = listItem.querySelector(".message-sender");
    const content = listItem.querySelector(".message-content");
    if (
      !(sender instanceof HTMLElement) ||
      !(content instanceof HTMLElement) ||
      sender.textContent === null ||
      content.textContent === null
    ) {
      throw new Error("A chat message is missing its sender or content.");
    }

    const searchableText = `${sender.textContent} ${content.textContent}`.toLocaleLowerCase();
    const matches = searchableText.includes(query);
    listItem.hidden = !matches;
    if (matches) {
      visibleMessageCount += 1;
    }
  }

  if (activeView === "saved") {
    noResultsMessage.textContent = query
      ? "No saved messages match your search."
      : "No saved messages yet.";
    noResultsMessage.hidden =
      savedMessages.length > 0 && (query.length === 0 || visibleMessageCount > 0);
    return;
  }

  noResultsMessage.textContent = "No messages found in this channel.";
  noResultsMessage.hidden = query.length === 0 || visibleMessageCount > 0;
}

function isMessageSaved(messageId, channelId) {
  return savedMessages.some(
    (savedMessage) =>
      savedMessage.id === messageId && savedMessage.channelId === channelId
  );
}

function createMessageElement(message, channelId, inSavedMessagesView = false) {
  const sentAt = new Date(message.timestamp);
  if (Number.isNaN(sentAt.getTime())) {
    throw new Error("A message has an invalid timestamp.");
  }

  const messageId = message.id || `message-${Date.now()}-${++generatedMessageCount}`;
  message.id = messageId;
  const listItem = document.createElement("li");
  const article = document.createElement("article");
  article.className = "chat-message";
  article.id = messageId;
  article.dataset.messageId = messageId;
  article.dataset.channelId = channelId;

  const header = document.createElement("header");
  header.className = "message-header";

  const sender = document.createElement("h3");
  sender.className = "message-sender";
  sender.textContent = message.sender;

  const timestamp = document.createElement("time");
  timestamp.dateTime = message.timestamp;
  timestamp.textContent = sentAt.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const isSaved = inSavedMessagesView || isMessageSaved(messageId, channelId);
  const saveButton = document.createElement("button");
  saveButton.className = "save-message-button";
  saveButton.type = "button";
  saveButton.dataset.action = "toggle-save";
  saveButton.dataset.messageId = messageId;
  saveButton.dataset.channelId = channelId;
  saveButton.setAttribute("aria-pressed", String(isSaved));
  saveButton.setAttribute(
    "aria-label",
    isSaved
      ? `Remove ${message.sender}'s message from saved messages`
      : `Save ${message.sender}'s message`
  );
  saveButton.textContent = inSavedMessagesView ? "Remove" : isSaved ? "Saved" : "Save";

  const content = document.createElement("p");
  content.className = "message-content";
  content.textContent = message.text;

  header.append(sender, timestamp, saveButton);
  if (inSavedMessagesView) {
    const source = document.createElement("p");
    source.className = "message-source";
    source.textContent = `Saved from #${message.channelName}`;
    article.append(header, source, content);
  } else {
    article.append(header, content);
  }
  listItem.append(article);
  return listItem;
}

function renderChannelMessages() {
  const channel = channels[activeChannelId];
  if (!channel) {
    throw new Error(`Unknown ConnectHub channel: ${activeChannelId}`);
  }

  viewStatusMessage.hidden = true;
  messageFeed.setAttribute("aria-label", `Messages in ${channel.title}`);
  messageFeed.replaceChildren(
    ...channel.messages.map((message) => createMessageElement(message, activeChannelId))
  );
  applyMessageSearch();
}

function updateActiveChannelButton(channelId) {
  for (const button of channelList.querySelectorAll(".channel-button")) {
    const isActive = button.dataset.channel === channelId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function updateActiveNavigation(view) {
  for (const button of [homeButton, directMessagesButton, savedMessagesButton]) {
    const isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function renderInfoView(view, title, description, message) {
  activeView = view;
  messageForm.hidden = true;
  channelTitle.textContent = title;
  channelDescription.textContent = description;
  messageFeed.setAttribute("aria-label", title);
  messageFeed.replaceChildren();
  noResultsMessage.hidden = true;
  viewStatusMessage.textContent = message;
  viewStatusMessage.hidden = false;
  updateActiveNavigation(view);
  updateActiveChannelButton("");
}

function renderHomeView() {
  renderInfoView(
    "home",
    "Home",
    "Your ConnectHub workspace.",
    "Welcome to ConnectHub, Alex. Choose a channel from the sidebar to read and send messages."
  );
}

function renderDirectMessagesView() {
  renderInfoView(
    "direct-messages",
    "Direct Messages",
    "Private conversations.",
    "Direct messages are not available in this demo yet. Choose a channel to continue."
  );
}

function renderChannel(channelId) {
  const channel = channels[channelId];
  if (!channel) {
    throw new Error(`Unknown ConnectHub channel: ${channelId}`);
  }

  activeChannelId = channelId;
  activeView = "channel";
  messageForm.hidden = false;
  channelTitle.textContent = channel.title;
  channelDescription.textContent = channel.description;
  updateActiveNavigation("");
  updateActiveChannelButton(channelId);
  renderChannelMessages();
}

function renderSavedMessages() {
  activeView = "saved";
  messageForm.hidden = true;
  viewStatusMessage.hidden = true;
  channelTitle.textContent = "Saved Messages";
  channelDescription.textContent = "Messages you have saved from your channels.";
  messageFeed.setAttribute("aria-label", "Saved messages");
  messageFeed.replaceChildren(
    ...savedMessages.map((message) =>
      createMessageElement(message, message.channelId, true)
    )
  );
  applyMessageSearch();
  updateActiveNavigation("saved-messages");
  updateActiveChannelButton("");
}

channelList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest(".channel-button");
  if (!(button instanceof HTMLButtonElement) || !channelList.contains(button)) {
    return;
  }

  const channelId = button.dataset.channel;
  if (!channelId) {
    throw new Error("A channel navigation button is missing its data-channel value.");
  }

  renderChannel(channelId);
});

homeButton.addEventListener("click", renderHomeView);
directMessagesButton.addEventListener("click", renderDirectMessagesView);
savedMessagesButton.addEventListener("click", renderSavedMessages);

profileButton.addEventListener("click", () => {
  const isExpanded = profileButton.getAttribute("aria-expanded") === "true";
  profileButton.setAttribute("aria-expanded", String(!isExpanded));
  profilePanel.hidden = isExpanded;
});

document.addEventListener("click", (event) => {
  if (event.target instanceof Element && !profileArea.contains(event.target)) {
    profileButton.setAttribute("aria-expanded", "false");
    profilePanel.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !profilePanel.hidden) {
    profileButton.setAttribute("aria-expanded", "false");
    profilePanel.hidden = true;
    profileButton.focus();
  }
});

messageFeed.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest(".save-message-button");
  if (!(button instanceof HTMLButtonElement) || !messageFeed.contains(button)) {
    return;
  }

  const messageId = button.dataset.messageId;
  const channelId = button.dataset.channelId;
  if (!messageId || !channelId) {
    throw new Error("A save-message button is missing its message or channel identifier.");
  }

  const savedIndex = savedMessages.findIndex(
    (message) => message.id === messageId && message.channelId === channelId
  );
  if (savedIndex >= 0) {
    savedMessages.splice(savedIndex, 1);
  } else {
    const channel = channels[channelId];
    const message = channel && channel.messages.find((item) => item.id === messageId);
    if (!channel || !message) {
      throw new Error("The message to save could not be found in its channel.");
    }

    savedMessages.push({
      id: message.id,
      channelId,
      channelName: channel.title,
      sender: message.sender,
      timestamp: message.timestamp,
      text: message.text,
    });
  }

  persistSavedMessages(savedMessages);
  if (activeView === "saved") {
    renderSavedMessages();
  } else {
    renderChannelMessages();
  }
});

messageSearchInput.addEventListener("input", applyMessageSearch);

let createdChannelCount = 0;

addChannelButton.addEventListener("click", () => {
  const enteredName = window.prompt("Enter a channel name:");
  if (enteredName === null) {
    return;
  }

  const title = enteredName.trim().replace(/\s+/g, " ");
  if (!title) {
    window.alert("Channel names cannot be empty.");
    return;
  }

  const normalizedTitle = title.toLowerCase();
  const isDuplicate = Object.values(channels).some(
    (channel) => channel.title.toLowerCase() === normalizedTitle
  );
  if (isDuplicate) {
    window.alert("A channel with that name already exists.");
    return;
  }

  let channelId;
  do {
    channelId = `custom-${++createdChannelCount}`;
  } while (Object.prototype.hasOwnProperty.call(channels, channelId));

  channels[channelId] = {
    title,
    description: `A place for the team to discuss ${title}.`,
    messages: [],
  };
  persistChannels();

  addChannelNavigationItem(channelId);
  renderChannel(channelId);
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageText = messageInput.value.trim();
  if (!messageText) {
    return;
  }

  const message = {
    id: `message-${Date.now()}-${++generatedMessageCount}`,
    sender: "Alex Morgan",
    timestamp: new Date().toISOString(),
    text: messageText,
  };
  channels[activeChannelId].messages.push(message);
  persistChannels();
  if (activeView === "saved") {
    renderSavedMessages();
  } else {
    renderChannelMessages();
  }

  messageInput.value = "";
  messageInput.focus();
});

renderChannel(activeChannelId);
