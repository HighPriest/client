<script lang="ts">
    import Bubble from "$lib/Bubble.svelte";
    import Chatbox from "$lib/Chatbox.svelte";
    import { chatState } from '$lib/state.svelte.ts';
    let openchat = false;

</script>

<Bubble on:bubbling={()=> {openchat=!openchat}}/>
<Chatbox bind:chatboxOpen={openchat} />
