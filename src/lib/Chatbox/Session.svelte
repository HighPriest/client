<script lang="ts">
	// Import the configuration
	import { chatConfig } from '$lib/state.svelte';

	// --- PROPS ---
	let { onSessionCreated = () => {} } = $props();

	// --- STATE ---
	let postData = $state({
		name: '',
		surname: '',
		email: ''
	});

	let isLoading = $state(false);
	let errorMessage = $state('');

	// --- LOGIC ---
	/**
	 * Handle the form submission to create a new session.
	 */
	async function handleSessionRequest() {
		isLoading = true;
		errorMessage = '';

		// Simple validation
		if (!postData.name || !postData.email) {
			errorMessage = 'Name and email are required.';
			isLoading = false;
			return;
		}

		// Construct the server URL from the imported config.
        const { proto, host, port } = chatConfig.server;
        const url = port && port !== 0
            ? `${proto}://${host}:${port}/session`
            : `${proto}://${host}/session`;

		// Create the request body.
		const formBody = Object.entries(postData)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
			.join('&');

		try {
			const response = await fetch(url, {
				method: 'POST',
				// Note: 'no-cors' mode will result in an opaque response, meaning you can't
				// access status, headers, or the body. You might need to configure
				// CORS on your server for a real application.
				mode: 'no-cors',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formBody
			});

			// With 'no-cors', the status will be 0 on success.
			if (response.status === 0) {
				// Call the function prop to notify the parent component.
				onSessionCreated();
			} else {
				// We can't get detailed error info in 'no-cors' mode.
				throw new Error('Network response was not OK. Check server CORS policy.');
			}
		} catch (err) {
			console.error('Session creation failed:', err);
			errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
		} finally {
			isLoading = false;
		}
	}
</script>

<!-- 
  The HTML structure uses classless Pico.css helpers where appropriate.
  The form submission is handled by the on:submit event on the <form> element.
-->
<div class="chat-sessionform">
	<form onsubmit={handleSessionRequest}>
		<fieldset disabled={isLoading}>
			<legend>Start a new chat</legend>
			<p>Please fill in your details to begin.</p>

			<label for="name">Name*</label>
			<input
				type="text"
				id="name"
				name="name"
				placeholder="Your Name"
				bind:value={postData.name}
				required
			/>

			<label for="surname">Surname</label>
			<input
				type="text"
				id="surname"
				name="surname"
				placeholder="Your Surname"
				bind:value={postData.surname}
			/>

			<label for="email">Email*</label>
			<input
				type="email"
				id="email"
				name="email"
				placeholder="your@email.com"
				bind:value={postData.email}
				required
			/>

			<button type="submit" aria-busy={isLoading}>
				{#if isLoading}Starting...{:else}Open Chat{/if}
			</button>
		</fieldset>
	</form>
    {#if errorMessage}
        <p class="error-message" role="alert">{errorMessage}</p>
    {/if}
</div>

<style>
	.chat-sessionform {
        position: relative;
		padding: 1.5rem;
		border: 1px solid var(--pico-form-element-border-color);
		border-radius: var(--pico-border-radius);
		background-color: var(--pico-card-background-color);
	}

	legend {
		font-weight: bold;
		font-size: 1.2rem;
	}
	
	.error-message {
		color: var(--pico-color-red-500);
		font-size: 0.9rem;
		margin-top: 1rem;
        position: absolute;
        bottom: 0;
	}

    /* Add a little spacing between form elements */
    label {
        margin-top: 0.5rem;
    }
</style>
