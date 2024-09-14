<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls, useTexture } from '@threlte/extras';

	export let width: number;
	export let url: string;

	let x = 0;
	let rotation = 0;
	useTask((delta) => {
		rotation = 0.25 * Math.sin(x);
		x += delta;
	});

	$: texture = useTexture(url);
</script>

<T.PerspectiveCamera makeDefault position.z={width}>
	<OrbitControls />
</T.PerspectiveCamera>

<T.Color args={['black']} attach="background" />
<T.AmbientLight />

{#await texture then map}
	<T.Mesh rotation.y={rotation}>
		<T.PlaneGeometry args={[width, map.source.data.height]} />
		<T.MeshStandardMaterial {map} />
	</T.Mesh>
{/await}
