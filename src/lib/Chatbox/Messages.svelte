<script lang="ts">
	import { chatConfig, chatState } from '$lib/state.svelte';
	//import type { Message } from '$lib/state.svelte';

	// --- DERIVED STATE ---
	// We derive a clustered view from the flat message list.
	// This code runs automatically whenever `chatState.messenger` changes.
	const messageClusters = $derived.by(() => {
		if (chatState.messenger.length === 0) {
			return [];
		}

		// This is the new structure we are creating.
		const clusters: { author: string; messages: string[] }[] = [];

		// Start the first cluster.
		let currentCluster = {
			author: chatState.messenger[0].author,
			messages: [chatState.messenger[0].body]
		};

		// Loop through the rest of the messages to group them.
		for (let i = 1; i < chatState.messenger.length; i++) {
			const message = chatState.messenger[i];
			if (message.author === currentCluster.author) {
				// If the author is the same, add the message to the current cluster.
				currentCluster.messages.push(message.body);
			} else {
				// If the author is different, push the completed cluster and start a new one.
				clusters.push(currentCluster);
				currentCluster = {
					author: message.author,
					messages: [message.body]
				};
			}
		}

		// Add the last cluster to the array.
		clusters.push(currentCluster);

		return clusters;
	});

	// --- SIDE EFFECTS ---
	let scrollContainer: HTMLElement;

	// Use $effect to run code after the DOM has been updated.
	// This is perfect for side effects like scrolling.
	$effect(() => {
		// The dependency on `messageClusters` is tracked automatically.
		if (scrollContainer) {
			scrollContainer.scrollTo(0, scrollContainer.scrollHeight);
		}
	});
</script>

<!-- The bind:this directive gives us a reference to the DOM element -->
<div class="chat-scrollview" bind:this={scrollContainer}>
	<div class="chat-messagelist">
		<!-- The main loop now iterates over our clean, clustered data -->
		{#each messageClusters as cluster (cluster.author + cluster.messages[0])}
			<!-- We check the author to determine the layout -->
			{#if cluster.author === "0"}
				<!-- BOT MESSAGES -->
				<div class="chat-cluster">
					<div class="chat-avatar">
						<img
							src="https://cdn.dribbble.com/users/37530/screenshots/2937858/drib_blink_bot.gif"
							alt="Bot Avatar"
						/>
					</div>
					<section>
						<h3>Snap Bot</h3>
						<!-- The nested loop renders each message in the cluster -->
						{#each cluster.messages as body}
							<div class="chat-message">{body}</div>
						{/each}
					</section>
				</div>
			{:else}
				<!-- USER MESSAGES -->
				<!-- The `mine` attribute applies the user-specific styling -->
				<div class="chat-cluster" mine>
					<section>
						{#each cluster.messages as body}
							<div class="chat-message">{body}</div>
						{/each}
					</section>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	/* Your existing SCSS styles remain unchanged as they are well-structured */
	.chat-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		margin: 0;
		overflow: hidden;
		display: inline-block;

		& > img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

.chat-scrollview {
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scroll-snap-type: y proximity;
  position: absolute;
  inset: 0;
  
  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
}

.chat-messagelist {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding-block: 4rem;
  min-height: 100%;
  
  & > .chat-cluster:last-child {
    scroll-snap-align: end;
    scroll-margin-block-end: 5rem;
  }
}

.chat-cluster {
  margin: 0.25rem 3rem 0.75rem 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-self: flex-start;
  align-items: flex-end;
  
  &[mine] {
    margin-left: 3rem;
    margin-right: 0.5rem;
    align-self: flex-end;
    
    & > section {
      align-items: flex-end;
    }
  }
  
  & > .chat-avatar {
    margin-right: 0.5rem;
    bottom: 1rem;
    position: sticky;
  }
  
  & > section {
    flex: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: column;
    
    & > h3 {
      margin: 0 0 0 0.7rem;
      font-size: 0.7rem;
      font-weight: lighter;
      color: hsl(0, 0%, 60%);
    }
  }
}

.chat-message {
  background-attachment: fixed;
  background-image: linear-gradient(var(--chat-ui_theme), 30%, hotpink);
  background-size: 100% 120%;
  color: white;
  font-size: var(--chat-ui_message_font-size);
  line-height: 1.4;
  padding: 0.5rem 0.75rem;
  margin: 0;
  border-radius: 0.25rem 1rem 1rem 0.25rem;
  
  &:first-of-type {
    border-radius: 1rem 1rem 1rem 0.25rem;
  }
  
  &:not(:first-child) {
    margin-top: 3px;
  }
}

[mine] .chat-message {
  background: var(--chat-ui_message_bg2);
  color: var(--chat-ui_message_text-color);
  border-radius: 1rem 0.25rem 0.25rem 1rem;
}
</style>
