<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, useTexture } from '@threlte/extras';

	export let width: number;
	export let url: string;

	$: texture = useTexture(url);
</script>

<T.PerspectiveCamera makeDefault position.z={width}>
	<OrbitControls />
</T.PerspectiveCamera>

<T.Color args={['black']} attach="background" />
<T.AmbientLight />

{#await texture then map}
	<T.Mesh>
		<T.PlaneGeometry args={[width, map.source.data.height]} />
		<T.MeshStandardMaterial {map} />
	</T.Mesh>
{/await}
