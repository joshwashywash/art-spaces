<script>
	import { page } from '$app/stores';
	import '../app.css';

	let { children } = $props();
</script>

<div class="grid bg-black min-h-screen text-white">
	<form>
		<label>
			id
			<input
				class="text-black"
				type="search"
				name="id"
				value={$page.url.searchParams.get('id') ?? ''}
			/>
		</label>
		<button>submit</button>
	</form>
	{@render children()}
</div>
