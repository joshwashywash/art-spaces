<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import Scene from './Scene.svelte';

	let { data } = $props();
</script>

<main class="h-screen">
	<Canvas>
		<T.Color args={['black']} attach="background" />
		<Scene width={data.width} url={data.url} />
	</Canvas>
</main>
