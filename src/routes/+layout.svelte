<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="grid bg-black min-h-screen">
	<p class="text-white">here's where a search would go</p>
	{@render children()}
</div>
