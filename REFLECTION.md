# ConnectHub Development Reflection

## 1. What did I ask Copilot to help me build? How did I break down the problem?

I asked Copilot to help me build ConnectHub, a web-based team communication app using HTML5, CSS3, and vanilla JavaScript. Instead of asking it to generate the whole app at once, I divided the work into features and learned about each part before implementing it.

I started with the page structure in `index.html`: the header, search field, profile area, sidebar, channel navigation, chat feed, and message composer. I asked questions about semantic elements such as `header`, `nav`, `aside`, and `main` before asking for specific markup. Then I worked on the visual design in `style.css`, including the dashboard layout, message cards, colors, and responsive styles.

After that, I added JavaScript features in smaller steps: sending messages, switching channels, creating channels, searching messages, and saving messages. I kept asking Copilot to use the IDs and classes already in my project and to avoid rewriting unrelated functionality. That made it easier to understand what each change was for and review it against the rest of the app.

## 2. How did my approach to asking questions change as I worked?

At first, I used Ask mode to understand concepts before changing code. I asked how semantic HTML works, how messages should be displayed, and how CSS media queries could adapt the layout. Those questions helped me make decisions instead of copying code without understanding it.

As the project developed, I started using Agent mode for targeted implementation requests. I would specify the feature, the file to edit, and what existing behavior needed to stay intact. For example, I asked for message sending in `script.js` while keeping the HTML and CSS unchanged, and later asked for responsive header improvements only in `style.css`. I also requested code review recommendations before deciding which issues to address. My prompts became more specific because I had learned how the existing structure worked.

## 3. What parts of development with Copilot surprised me?

One thing that stood out was that related features can depend on separate pieces of state. I initially thought a saved message disappearing from its original channel meant it had not stayed saved. After checking the Saved Messages view, I found that the saved copy was still there, but the channel conversation itself was not persisted. I clarified that I wanted channel messages to remain in their channels after refresh, and then tested that behavior by refreshing and checking a message in Announcements.

I was also surprised by how useful a code review was for finding unfinished interactions. Home, Direct Messages, and the profile control looked clickable but did not yet do anything. After reviewing that feedback, I asked for simple front-end behavior rather than adding a backend: a Home welcome view, a clear message that Direct Messages were not available in the demo, and a profile details panel.

Copilot made it faster to explore solutions, but its suggestions still needed my judgment. I had to decide which suggestions fit the assignment, preserve the features I already had, and check the results in the browser.

## 4. What did I learn about the technologies I used that I didn't know before?

I learned that semantic HTML is about more than making the page look organized. Elements such as `nav`, `main`, and `section` communicate the purpose of different parts of the interface. Labels, button states, and accessible names also help people understand and use the controls.

In CSS, I learned how Grid and Flexbox can work together. Grid organizes the overall dashboard, while Flexbox helps arrange the chat header, message area, and composer. I also learned that responsive design is not just shrinking everything: at narrow widths, controls may need a different arrangement. For the chat feed, the layout needs a constrained height and a scrollable feed so the composer stays available.

In JavaScript, I learned how event listeners connect actions such as clicking Send or choosing a channel to changes in the page. DOM manipulation lets the app render messages and channel views, and using `textContent` keeps user-entered text from being treated as HTML. I also learned how `localStorage` can retain saved messages and channel conversations after a refresh. It is useful for a front-end demo, but it is not a shared database or a replacement for a backend.

## 5. What would I do differently if I built this application again?

I would plan the channel and message data structures earlier, especially which data should persist and where. That would have helped me distinguish channel history from the Saved Messages list before I encountered the refresh issue.

I would also decide what every visible navigation control should do before adding it to the interface. That could prevent buttons from appearing functional before their behavior is defined. Finally, I would make a small test checklist earlier and use it after each feature: send a message, switch channels, search, save and remove a message, refresh, and check narrow screen sizes. I did browser checks for message persistence and responsive layouts during this project; doing those checks throughout development would help catch issues sooner.

Overall, Copilot helped me move through the project incrementally and understand unfamiliar concepts, but it did not make the decisions for me. I still needed to review the code, describe the behavior I wanted, test the result, and ask for focused changes when something did not match my expectations.

## Copilot Collaboration Evidence

The following screenshots document my use of Copilot throughout development:

- Project planning and HTML structure
- CSS design and responsive layout
- JavaScript feature implementation
- Channel creation and message search
- Saved messages and code review
- README and reflection generation