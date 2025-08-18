<script lang="ts">
	import { chatState } from '$lib/state.svelte';

	// $effect to manage the open/closed state
	$effect(() => {
		// If the box is opened, clear unread messages.
		if (chatState.isChatboxOpen) {
			chatState.unread = 0;
		}
	});
</script>

<button
	class="chat-toggle-button"
	style={!chatState.isChatboxOpen ? undefined : 'display: none'}
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

<style lang="scss">
	// This is just a conceptual placeholder for the bubble
    .chat-toggle-button {
        overflow: hidden;
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 60px;
		height: 60px;
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
</style>
