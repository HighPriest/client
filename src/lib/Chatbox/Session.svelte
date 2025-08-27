<!-- Copyright (C) 2025 LiveMatrix -->
<script lang="ts">
	// Import the configuration
	import { chatConfig } from '$lib/state.svelte';
	import type { UserMetadata } from '$lib/state.svelte';

	// --- PROPS ---
	let { onSessionCreated = () => {} } = $props();

	// --- STATE ---
	let userMetadata: UserMetadata  = $state({
		name: '',
		phone: '',
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
		if (!userMetadata.name || !userMetadata.email) {
			errorMessage = 'Name and email are required.';
			isLoading = false;
			return;
		}

		// Construct the server URL from the imported config.
		const { proto, host, port } = chatConfig.server;
		const url =
			port && port !== 0 ? `${proto}://${host}:${port}/session` : `${proto}://${host}/session`;

		// Create the request body.
		const formBody = Object.entries(userMetadata)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
			.join('&');

		console.debug('Session request body:', formBody);
		try {
			const response = await fetch(url, {
				method: 'POST',
				mode: 'no-cors',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formBody
			});

			// With 'no-cors', the status will be 0 on success.
			if (response.status === 0) {
				// Call the function prop to notify the parent component.
				onSessionCreated(userMetadata);
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
	<form
		onsubmit={(event) => {
			event.preventDefault();
			handleSessionRequest();
		}}
	>
		<fieldset disabled={isLoading}>
			<legend>Welcome to {chatConfig.metadata.companyName}</legend>
			<p>If you want to inquire about our services or have a chat with our administrators, you are in the right place</p>
			<p style="font-size:smaller; opacity: 50%;">We ask for extra id, to contact you if we lose communication. <br>The chat is persistent between browser sessions, so you can come back here at any time, to continue our conversation.</p>

			<div class="form-input">
				<input
					type="text"
					id="name"
					name="name"
					placeholder=""
					bind:value={userMetadata.name}
					required
				/>
				<label for="name">Your Name*</label>
			</div>

			<div class="form-input">
				<input
					type="text"
					id="phone"
					name="phone"
					placeholder=""
					bind:value={userMetadata.phone}
				/>
				<label for="surname">Phone Number</label>
			</div>

			<div class="form-input">
				<input
					type="email"
					id="email"
					name="email"
					bind:value={userMetadata.email}
					placeholder=""
					required
				/>
				<label for="email">E-mail address*</label>
			</div>

			<button class="button-82-pushable" type="submit" aria-busy={isLoading}>
				<span class="button-82-shadow"></span>
				<span class="button-82-edge"></span>
				<span class="button-82-front text"> {#if isLoading}Starting...{:else}Open Chat{/if} </span>
			</button>
		</fieldset>
	</form>
	{#if errorMessage}
		<p class="error-message" role="alert">{errorMessage}</p>
	{/if}
</div>
<!-- HTML !-->

<style lang="scss">
	.chat-sessionform {
		/* 		position: relative;
		padding: 1.5em;
		border: 1px solid var(--pico-form-element-border-color);
		border-radius: var(--pico-border-radius);
		background-color: var(--pico-card-background-color); */

		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3em 1em 0.5em 1em;
		color: white;

		form {
			margin: 12px 0;
			overflow: hidden;
			padding: 0.1em;
			position: relative;
			border-radius: 1em;
			fieldset {
				border-radius: 1em;
				position: relative;
				margin-top: -0.3em;
				background: hsl(0deg 0% 0% / 0.8);
				legend {
					font-weight: bold;
					font-size: 1.2em;
					text-shadow: -0.05em -0.1em black;
				}
			}
			button {
				&.button-82-pushable {
					position: relative;
					border: none;
					background: transparent;
					padding: 0;
					cursor: pointer;
					outline-offset: 4px;
					transition: filter 250ms;
					user-select: none;
					-webkit-user-select: none;
					touch-action: manipulation;
				}

				.button-82-shadow {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					border-radius: 12px;
					background: hsl(0deg 0% 0% / 0.25);
					will-change: transform;
					transform: translateY(2px);
					transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
				}

				.button-82-edge {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					border-radius: 12px;
					background: linear-gradient(
						to left,
						hsl(from var(--chat-ui_theme) h s l / 16%) 0%,
						hsl(from var(--chat-ui_theme) h s l / 32%) 8%,
						hsl(from var(--chat-ui_theme) h s l / 32%) 92%,
						hsl(from var(--chat-ui_theme) h s l / 32%) 100%
					);
				}

				.button-82-front {
					display: block;
					position: relative;
					padding: 12px 27px;
					border-radius: 12px;
					font-size: 1.1rem;
					color: white;
					background: var(--chat-ui_theme);
					will-change: transform;
					transform: translateY(-4px);
					transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
				}

/* 				@media (min-width: 768px) {
					.button-82-front {
						font-size: 1.25rem;
						padding: 12px 42px;
					}
				} */

				&.button-82-pushable:hover {
					filter: brightness(110%);
					-webkit-filter: brightness(110%);
				}

				&.button-82-pushable:hover .button-82-front {
					transform: translateY(-6px);
					transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
				}

				&.button-82-pushable:active .button-82-front {
					transform: translateY(-2px);
					transition: transform 34ms;
				}

				&.button-82-pushable:hover .button-82-shadow {
					transform: translateY(4px);
					transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
				}

				&.button-82-pushable:active .button-82-shadow {
					transform: translateY(1px);
					transition: transform 34ms;
				}

				&.button-82-pushable:focus:not(:focus-visible) {
					outline: none;
				}
			}
			.form-input {
				position: relative;
				input {
					width: 100%;
					padding: 10px 0;
					font-size: 16px;
					color: var(--chat-ui_theme_text-color);
					margin-bottom: 30px;
					border: none;
					border-bottom: 1px solid #fff;
					outline: none;
					background: transparent;
					&:not(:placeholder-shown),
					&:focus {
						~ label {
							top: -20px;
							left: 0;
							font-size: 12px;
						}
						&:invalid {
							~ label {
								color: crimson;
							}
						}
					}
					&:valid {
						~ label {
							color: gray;
						}
					}
				}
				label {
					position: absolute;
					top: 0;
					left: 0;
					padding: 10px 0;
					font-size: 16px;
					color: gray;
					pointer-events: none;
					transition: 0.5s;
				}
			}
		}
	}

	.error-message {
		color: var(--pico-color-red-500);
		font-size: 0.9em;
		margin-top: 1em;
		position: absolute;
		bottom: 0;
	}

	/* Add a little spacing between form elements */
	label {
		margin-top: 0.5em;
	}
</style>
