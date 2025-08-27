<!-- Copyright (C) 2025 LiveMatrix -->
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

		if (!sessionActive) sessionActive = document.cookie.includes('session_id'); // If session not created, check if we have session_id stored
		if (!configLoaded) {
			fetchConfig();
			return;
		} else if (sessionActive) {	// If session_id had been received or session_id had been stored. Connect!
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
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');

	:global(.chat-ui) {
		all: revert; // Separate this widget from the styles of the website!
        font-family: "Geist", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
		:global(*) {
			all: revert; // Bring back styles of sub-elements to match the root .chat-ui
		}
	}

	@keyframes show {
		100% {
			opacity: 1;
			transform: none;
            scale: 1;
		}
	}

	.chat-ui {
		// State before intro animation
		opacity: 0;
        transform-origin: bottom right;
        scale: 0;
        animation: s-livematrix-chatbox-show 1000ms 100ms cubic-bezier(0.34, 1.0, 0.4, 0.94) forwards;

		animation: show 600ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards;

		--chat-ui_theme: hsl(200, 100%, 50%);
		--chat-ui_theme_compliment: color(var(--chat-ui_theme) hue(+200));
		--chat-ui_theme_text-color: white;
		--chat-ui_bg: hsl(0, 0%, 90%);
		--chat-ui_width: 350px;
		--chat-ui_height: 480px;
		--chat-ui_message_bg: white;
		--chat-ui_message_bg2: hsl(0, 0%, 85%);
		--chat-ui_message_text-color: hsl(0, 0%, 10%);
		--chat-ui_message_font-size: 0.8em;
		--chat-ui_easing-quick: cubic-bezier(0.075, 0.82, 0.165, 1);
		width: 20em;
        min-height: 20em;
		position: absolute;
		bottom: 3rem;
		right: 3rem;

        border-radius: 1em;
		background: var(--chat-ui_bg);
		font-size: initial;
		color: var(--chat-ui_message_text-color);
		overflow: hidden;
		box-shadow: 0 3rem 10rem hsl(0, 0%, 60%);
		resize: both;
	}

	.chat-authoring {
		position: absolute;
		z-index: 12;
		bottom: 0.5em;
		right: 0.5em;
		box-sizing: border-box;
		margin: 0.5em;
		padding: 0.5em 0.75em;
		border-radius: 1em 1em 2px;
		box-shadow: 0.25rem 0.5rem 1rem hsla(0, 0%, 0%, 0.2);
		background: white;
		caret-color: var(--chat-ui_theme, blue);
		font-size: 0.9em;
		font-weight: lighter;
		line-height: 1.4em;
		width: calc(100% - 1em);
		transition: width 0.15s var(--chat-ui_easing-quick);

		&:has(> input:active) {
			width: calc(100% - 1em);
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
            font-size: 1em;
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
</style>
