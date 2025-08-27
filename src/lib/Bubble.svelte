<!-- Copyright (C) 2025 LiveMatrix -->
<script lang="ts">
	import { chatConfig, chatState } from '$lib/state.svelte';

	// $effect to manage the open/closed state
	$effect(() => {
		// If the box is opened, clear unread messages.
		if (chatState.isChatboxOpen) {
			chatState.unread = 0;
		}
	});

	let showBubble = $state(false);

	$effect(() => {
		if (chatConfig.greetings && chatConfig.greetings.bubble != undefined) {
			showBubble = true;
		}
		const timer = setTimeout(() => {
			showBubble = false;
		}, 5000);
		return () => clearTimeout(timer);
	});
</script>

<div style={!chatState.isChatboxOpen ? undefined : 'display: none'}>
	{#if showBubble}
		<div class="thought-bubble">{chatConfig.greetings.bubble}</div>
	{/if}

	<button
		class="chat-toggle-button"
		onclick={() => {
			chatState.isChatboxOpen = !chatState.isChatboxOpen;
		}}
	>
		<span class="animated-border"></span>
		{#if chatState.unread > 0 && !chatState.isChatboxOpen}
			<span class="unread-badge">{chatState.unread}</span>
		{/if}
		<!-- Icon placeholder -->
		<svg viewBox="0 0 24 24" width="32" height="32" fill="white"
			><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg
		>
	</button>
</div>

<style lang="scss">
	// This is just a conceptual placeholder for the bubble
	.chat-toggle-button {
		overflow: hidden;
		position: fixed;
		bottom: 1em;
		right: 1em;
		width: 4em;
		height: 4em;
		border-radius: 50%;
		background: black;
		display: grid;
		place-content: center;
		cursor: pointer;
		box-shadow: 0.25em 0.75em 1em rgb(0 0 0 / 84%);
		z-index: 999;
	}

	.chat-toggle-button::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 100%;
		height: 100%;
		background: linear-gradient(0deg, transparent, transparent, #45f3ff, #45f3ff, #45f3ff);
		z-index: 1;
		transform-origin: bottom right;
		animation: animate 6s linear infinite;
	}

	.chat-toggle-button::after {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 100%;
		height: 100%;
		background: linear-gradient(0deg, transparent, transparent, #45f3ff, #45f3ff, #45f3ff);
		z-index: 1;
		transform-origin: bottom right;
		animation: animate 6s linear infinite;
		animation-delay: -3s;
	}

	.animated-border::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 100%;
		height: 100%;
		background: linear-gradient(0deg, transparent, transparent, #ff2770, #ff2770, #ff2770);
		z-index: 1;
		transform-origin: bottom right;
		animation: animate 6s linear infinite;
		animation-delay: -1.5s;
	}

	.animated-border::after {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 100%;
		height: 100%;
		background: linear-gradient(0deg, transparent, transparent, #ff2770, #ff2770, #ff2770);
		z-index: 1;
		transform-origin: bottom right;
		animation: animate 6s linear infinite;
		animation-delay: -4.5s;
	}

	@keyframes animate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
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
		font-size: 0.8em;
		font-weight: bold;
	}
	.thought-bubble {
		color: black;
		position: fixed;
		bottom: 4em;
		right: 1em;
		display: flex;
		background-color: #fff;
		padding: 1em;
		border-radius: 2em;
		min-width: 40px;
		max-width: 220px;
		min-height: 40px;
		margin: 1em;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.thought-bubble:before,
	.thought-bubble:after {
		content: '';
		background-color: #fff;
		border-radius: 50%;
		display: block;
		position: absolute;
		z-index: -1;
	}
	.thought-bubble:before {
		width: 44px;
		height: 44px;
		top: -12px;
		left: 28px;
		box-shadow: -50px 30px 0 -12px #fff;
	}
	.thought-bubble:after {
		bottom: -10px;
		right: 26px;
		width: 30px;
		height: 30px;
		box-shadow:
			40px -34px 0 0 #fff,
			-28px -6px 0 -2px #fff,
			-24px 17px 0 -6px #fff,
			-5px 25px 0 -10px #fff;
	}
</style>
