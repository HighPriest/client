<script lang="ts">
	import { chatState, chatConfig } from '$lib/state.svelte';
	import { websocketService } from '$lib/websocket.service.js';
	import { tapOutside } from 'svelte-outside';

	import Header from '$lib/Chatbox/Header.svelte';
	import Session from '$lib/Chatbox/Session.svelte';
	import Messages from '$lib/Chatbox/Messages.svelte';

	// --- PROPS ---
	// The parent component can control the visibility of the chatbox with this prop.

	// --- STATE ---
	let sessionActive: boolean = $state(false);
	let configLoaded: boolean = $state(false);
	let userInput = $state('');

	// --- LOGIC & EFFECTS ---

	// $effect replaces onMount for async setup and reactions to state changes.
	$effect(() => {
		// 1. Setup config fetching
		async function fetchConfig() {
			try {
				console.debug('Fetching config.json');
				const response = await fetch('./livematrix/config.json');
				if (!response.ok) throw new Error('Network response was not ok');
				const configData = await response.json();
				console.debug('Received config.json', configData);
				// Assign fetched data to our reactive config object.
				Object.assign(chatConfig, configData.config);
			} catch (error) {
				console.error('Failed to fetch config:', error);
			} finally {
				configLoaded = true;
			}
		}

		if (!sessionActive) sessionActive = document.cookie.includes('session_id');
		if (!configLoaded) {
			fetchConfig();
			return;
		} else if (sessionActive) {
			websocketService.connect();
			console.debug('Websocket connecting!');
		}
		/* {
            console.debug("Websocket cleanup!");
            websocketService.disconnect();
            return
        } */

		// The cleanup function runs when the component is unmounted
		// or when the dependencies (`sessionActive`, `isLoadingConfig`) change.
		return () => {};
	});

	function handleSessionCreated() {
		sessionActive = true;
	}

	function handleSendMessage() {
		const text = userInput.trim();
		if (text) {
			websocketService.sendMessage(text);
			userInput = ''; // Clear the input field
		}
	}
</script>

<!-- The main container's visibility is now controlled by the `isChatboxOpen` state -->
{#if chatState.isChatboxOpen}
	<div
		class="chat-ui"
		use:tapOutside={() => {
			chatState.isChatboxOpen = false;
		}}
	>
		<Header />

		{#if !configLoaded}
			<div class="loading-view">
				<p>Loading configuration...</p>
			</div>
		{:else if !sessionActive}
			<!-- The Session component notifies us when the session is ready -->
			<Session onSessionCreated={handleSessionCreated} />
		{:else}
			<!-- The MessagingView now reads directly from the shared state -->
			<Messages />
			<form class="chat-authoring" onsubmit={handleSendMessage} data-sveltekit-keepfocus>
				<input
					type="text"
					placeholder="Say something..."
					bind:value={userInput}
					aria-label="Your message"
				/>
			</form>
		{/if}
	</div>
{/if}

<style lang="scss">
.chat-ui {
  --chat-ui_theme: hsl(200, 100%, 50%);
  --chat-ui_theme_compliment: color(var(--chat-ui_theme) hue(+200));
  --chat-ui_theme_text-color: white;
  --chat-ui_bg: hsl(0, 0%, 90%);
  --chat-ui_width: 350px;
  --chat-ui_height: 480px;
  --chat-ui_message_bg: white;
  --chat-ui_message_bg2: hsl(0, 0%, 85%);
  --chat-ui_message_text-color: hsl(0, 0%, 10%);
  --chat-ui_message_font-size: 0.8rem;
  --chat-ui_easing-quick: cubic-bezier(0.075, 0.820, 0.165, 1.000);
  
  width: 320px;
  height: 480px;
  position: relative;
  background: var(--chat-ui_bg);
  overflow: hidden;
  box-shadow: 0 3rem 10rem hsl(0, 0%, 60%);
  resize: both;
}

.chat-authoring {
  position: absolute;
  z-index: 12;
  bottom: 0.5rem;
  right: 0;
  box-sizing: border-box;
  margin: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem 1rem 2px;
  box-shadow: 0.25rem 0.5rem 1rem hsla(0, 0%, 0%, .2);
  background: white;
  caret-color: var(--chat-ui_theme, blue);
  font-size: 0.9rem;
  font-weight: lighter;
  line-height: 1.4em;
  width: calc(100% - 1rem);
  transition: width 0.15s var(--chat-ui_easing-quick);

  &:has(> input:active) {
    width: calc(100% - 1rem);
    outline: none;
  }

  &:has(> input:empty:not(:focus)) {
    width: 50%;
  }
  input {
    border: none;
    width: 100%;
  }
}

// Basic styling to make the components work together.
/* 	.chat-ui {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 370px;
		height: 600px;
		max-height: calc(100vh - 40px);
		border-radius: var(--pico-border-radius);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		background: var(--pico-card-background-color);
		display: flex;
		flex-direction: column;
		overflow: hidden;
        z-index: 1000;
	}

	.chat-header {
		padding: 0.75rem 1rem;
		background: var(--pico-secondary-background);
		border-bottom: 1px solid var(--pico-form-element-border-color);
        flex-shrink: 0;
        h3 {
            margin: 0;
            font-size: 1rem;
        }
	}

    .chat-authoring {
		display: flex;
		padding: 0.5rem;
		border-top: 1px solid var(--pico-form-element-border-color);
        background: var(--pico-secondary-background);
        flex-shrink: 0;

        input {
            flex-grow: 1;
            margin: 0;
            margin-right: 0.5rem;
        }
        button {
            width: auto;
            padding: 0.5rem;
            line-height: 0;
        }
	} */

    .loading-view {
        display: grid;
        place-content: center;
        flex-grow: 1;
    }

    // This is just a conceptual placeholder for the bubble
    .chat-toggle-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--pico-primary);
        display: grid;
        place-content: center;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 999;
    }

    .unread-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--pico-color-red-500);
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: grid;
        place-content: center;
        font-size: 0.8rem;
        font-weight: bold;
    }
</style>