<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import Scene from './Scene.svelte';

	let { data } = $props();
</script>

<Canvas>
	<T.Color args={['black']} attach="background" />
	<Scene width={data.width} url={data.url} />
</Canvas>
