# Contributing to LiveMatrix Client

Thank you for your interest in contributing to the **LiveMatrix Client**! We encourage you to follow the guidelines below to help us keep things organized and efficient.

## Development Setup

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/livematrix/client.git
cd client
```

### 2. Install Dependencies with `pnpm`

We use [pnpm](https://pnpm.io/) as our package manager. To install all necessary dependencies, run:

```bash
pnpm install
```

### 3. Run the Development Server

To preview the application locally, you can use the following command:

```bash
pnpm run dev
```

This will start a development server. You can view the app in your browser by navigating to `http://localhost:5173` (or the port specified in your terminal).

### 4. Build the Standalone Application

To build the product for production (a standalone version), run:

```bash
pnpm run standalone
```

This will generate the final build, which can be deployed as a standalone application.

---

## Folder Structure and Component Breakdown

The source code for the project is located in the `src` directory. Below is an explanation of the different components and their purpose.

### `src/routes/` - Development Preview

The `routes/` directory is where we define the routes used to show different development previews and pages within the application. It serves as the entry point for hosting the development environment.

### `src/_standalone/` - Build Configuration

The `_standalone/` directory contains configuration files used specifically for building the final standalone application. These configurations define how the app should be bundled and optimized for production environments.  
It had been created using `pnpm exec standalone create` and should be re-creatable with this function.

### `src/lib/` - Components of the Final Application

The `lib/` directory contains the core components that make up the final product. Below is a breakdown of the most important components:

#### **Bubble.svelte**

* This is the component responsible for displaying the **Bubble** element in the UI. It is a key visual element that can be customized or extended.

#### **Chatbox.svelte**

* This component is responsible for the entire **Chatbox** feature, which encompasses the interactive messaging system.

  * **Header.svelte**: The header section that remains constant across all views of the Chatbox.
  * **Session.svelte**: The form presented to the user when they have not yet logged in. This typically asks for login credentials or invites the user to register.
  * **Messages.svelte**: The view that appears once the user has logged in. It contains the messaging interface and allows users to send and receive messages.

### `src/lib/state.svelte.ts` - Global State Management

The `state.svelte.ts` file handles the **global state** of the application. It manages shared data between components and allows them to communicate seamlessly. This file holds important application state, such as user authentication status and other global variables.

### `src/lib/websocket.ts` - Client-Side WebSocket Communication

The `websocket.ts` file is responsible for handling the **WebSocket** communication with the server. It establishes a connection, listens for events, and sends messages back and forth. This file is crucial for real-time updates in the chat application.

### `src/lib/websocket.server.ts` - Server-Side WebSocket Communication

The `websocket.server.ts` file contains the server-side code that manages the **WebSocket** connection with the Matrix bot. It facilitates communication between the client and the bot, allowing for sending and receiving messages in real time.

---

## Contribution Guidelines

We encourage you to contribute to the project by following these steps:

1. **Fork the repository**: If you haven’t done so already, fork this repository and clone your fork locally.
2. **Create a new branch**: Make sure to create a new branch for your work. Use a descriptive name for the branch, e.g., `fix-bubble-component` or `feature/new-chatbox-header`.
3. **Make your changes**: Write your code, ensuring that it adheres to the project’s coding standards. If you are unsure about style guidelines, please refer to the existing code.
4. **Test your changes**: Make sure to test any changes you make to ensure that they work as expected. Run the development server (`pnpm run dev`) to preview and test locally.
5. **Commit your changes**: Use meaningful commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) format (e.g., `feat: add new chat bubble design`).
6. **Push to your fork**: Push your changes to your fork on GitHub.
7. **Submit a Pull Request**: Create a pull request to the `main` branch of this repository. Be sure to include a clear description of the changes you’ve made and any relevant issues you’ve addressed.

---

## Code of Conduct

By contributing to this project, you agree to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful, constructive, and collaborative in all your interactions.

---

If you have any questions or need help with something, feel free to reach out via GitHub Issues or the discussion forums. Thank you for contributing to the LiveMatrix Client!

---

This should give developers all the necessary information to contribute to the project. Let me know if you’d like to adjust anything or add more detail!
