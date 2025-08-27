import { chatState, chatConfig, type Message } from '$lib/state.svelte';

// Use a local, non-reactive variable to hold the socket instance.
let ws: WebSocket | null = null;

/**
 * Connects to the WebSocket server and sets up event listeners.
 */
function connect() {
	// Prevent multiple connections
	if (ws && ws.readyState < 2) {
		console.debug('WebSocket already connected.');
		return;
	}

    const { proto, host, port } = chatConfig.websocket;
    const url = port && port !== 0
        ? `${proto}://${host}:${port}/entry`
        : `${proto}://${host}/entry`;

	console.debug(`Connecting to ${url}...`);
	ws = new WebSocket(url);

	ws.onopen = () => {
		console.debug('WebSocket connection established.');
		// Send initial greeting to the user upon connection
		if (chatConfig.greetings.message) {
			chatState.messenger.push({ author: "0", body: chatConfig.greetings.message });
		}
	};

	ws.onmessage = (event) => {
		try {
			const message: Message = JSON.parse(event.data);
			console.debug('Message received:', message);
			chatState.messenger.push(message);

            // If the chatbox is closed, increment the unread counter
            // This logic is now centralized here.
            if (!chatState.isChatboxOpen) {
                chatState.unread++;
            }

		} catch (error) {
			console.error('Failed to parse incoming message:', event.data, error);
		}
	};

	ws.onerror = (event) => {
		console.error('WebSocket error:', event);
        chatState.messenger.push({author: "0", body: "There has been an error with creating WebSocket connection!"});
	};

	ws.onclose = () => {
		console.debug('WebSocket connection closed.');
		ws = null; // Clear the instance on close
	};
}

/**
 * Sends a message through the WebSocket.
 * @param body The text of the message to send.
 */
function sendMessage(body: string) {
	if (ws && ws.readyState === WebSocket.OPEN) {
		const message: Message = { author: "1", body }; // Author 1 is the user

		// Add the user's message to the state immediately for a snappy UI
		chatState.messenger.push(message);

		// Send the message to the server
		ws.send(JSON.stringify(message));
		console.debug('Message sent:', message);
	} else {
		console.error('Cannot send message, WebSocket is not connected.');
	}
}

/**
 * Closes the WebSocket connection.
 */
function disconnect() {
	if (ws) {
		ws.close();
	}
}

// Export the functions as a service object
export const websocketService = {
	connect,
	disconnect,
	sendMessage,
};
