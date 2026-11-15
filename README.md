# ConnectHub

ConnectHub is a responsive, browser-based team communication interface built with HTML, CSS, and vanilla JavaScript. It demonstrates common messaging-app interactions such as channel navigation, message search, and saved messages without requiring a backend.

## Project Overview

ConnectHub provides a workspace for reading and composing messages in channels. Its interface includes a header, workspace navigation, channel list, chat feed, and message composer. Channel conversations and saved messages are retained in the browser using `localStorage`.

This project is a front-end demonstration. It does not provide real-time communication between users or connect to a server.

## Features

- Responsive workspace layout with a dark sidebar and light chat area.
- Four sample channels: General, Announcements, Development, and Random.
- Create channels with a name prompt; empty and duplicate names are rejected.
- Send messages using the Send button or Enter. Empty or whitespace-only messages are ignored.
- Search messages case-insensitively in the currently selected channel or the Saved Messages view.
- Save and remove messages, including their sender, content, timestamp, and source channel.
- Keep channel messages, created channels, and saved messages after refresh using browser storage.
- A Home welcome view and a profile details panel.
- A Direct Messages placeholder that explains this feature is not available in the demo.

## Technologies

- **HTML5** for the document structure and semantic elements.
- **CSS3** for layout, styling, responsive breakpoints, and scrolling behavior.
- **Vanilla JavaScript** for event handling, DOM updates, message and channel behavior, search, and browser storage.

No JavaScript framework, package manager, or build tool is required.

## Installation and Setup

### Requirements

- A modern web browser.
- Git to clone the repository.
- Optionally, Visual Studio Code with the Live Server extension for local serving.

### Get the project

```bash
git clone https://github.com/KavonAllen/connecthub-communication-app.git
cd connecthub-communication-app
```

### Launch

The application is static. You can open `index.html` directly in a browser, or open the project folder in Visual Studio Code and use **Open with Live Server** on `index.html`.

Using Live Server or another consistent local URL is recommended because browser storage is scoped to the page's origin. There are no dependency-install or build commands.

## Using the Application

1. Select a channel in the sidebar to view its messages.
2. Enter a message in the composer and click **Send** or press **Enter**.
3. Use the header search field to filter the current channel. Clear the field to show all of its messages again.
4. Select **+ Add Channel** to create a channel. New channels open immediately after creation.
5. Use **Save** on a message to add it to **Saved Messages**. Select the Saved Messages navigation item to view saved items; use **Remove** to unsave one.
6. Select **Home** for the welcome view. The Direct Messages item currently opens an informational placeholder.
7. Select the Alex Morgan profile control to view the demo profile details.

## Project Structure

```text
connecthub-communication-app/
├── index.html       # App structure and initial General messages
├── style.css        # Theme, layout, responsive rules, and component styles
├── script.js        # Channel, message, search, and saved-message behavior
├── REFLECTION.md    # Development reflection for the assignment
├── README.md        # Project documentation
└── images/          # Screenshots; not required to run the application
```

## Data Storage

ConnectHub uses the browser's `localStorage`; it does not use a database.

- `connecthub.channels` stores channel definitions and channel messages, including user-created channels.
- `connecthub.savedMessages` stores saved-message copies with their original channel name, sender, timestamp, and text.
- Initial sample messages are provided by the project. Messages sent in the app and created channels are stored locally so they can be restored after refresh.

Storage belongs to the current browser and origin. It is not shared across devices or users, and clearing site data removes it. Using a different browser or local URL may show a separate storage area.

## Known Limitations

- There is no backend, database, authentication, or real-time multi-user messaging.
- Direct Messages and profile management are not implemented; the interface displays a placeholder or demo details.
- Home is a simple welcome view rather than a full activity dashboard.
- Search filters only the currently open channel or Saved Messages; it does not search every channel at once.
- Local browser storage is not a backup or secure multi-user persistence solution.

## Possible Future Improvements

- Add a backend and database for accounts, shared channels, and durable message history.
- Add real-time message delivery and synchronization between users.
- Implement direct conversations and profile settings.
- Expand search to cover all channels and add sender/channel filters.
- Add message editing, deletion, and richer attachment support.
- Add automated tests for message sending, channel changes, search, storage, and responsive layouts.
