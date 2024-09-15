<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import Scene from './Scene.svelte';

	let { data } = $props();
</script>

{#await data.artwork then artwork}
	{@const url = `${artwork.config.iiif_url}/${artwork.data.image_id}/full/${data.width},/0/default.jpg`}
	<Canvas>
		<T.Color args={['black']} attach="background" />
		<Scene width={data.width} {url} />
	</Canvas>
{/await}
