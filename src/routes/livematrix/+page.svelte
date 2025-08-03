<script lang="ts">
	import { onMount } from 'svelte';
  
	onMount(() => {
	  const script = document.createElement('script');
	  script.src = '/src/_standalone/livematrix/embed.ts';
	  script.async = true;
	  script.type = 'module';
  
	  document.head.appendChild(script);
  
	  return () => {
		document.head.removeChild(script);
		window.livematrix.stop();
	  };
	});
</script>