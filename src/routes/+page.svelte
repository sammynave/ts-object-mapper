<script>
	import { setIn } from '$lib/immutable';

	export let data;

	$: console.log(data);

	function updateName() {
		data.users[0].name = 'butt';
	}
	function updateImmutableName() {
		data = setIn(data, ['users', 0, 'name'], 'butt');
	}
</script>

{#each data.users as user}
	<div>{user.id} {user.name}</div>
{/each}

<button on:click={() => updateName('butt')}>change sammy to butt (fail)</button>
<button on:click={() => updateImmutableName('butt')}>change sammy to butt (succeed)</button>
