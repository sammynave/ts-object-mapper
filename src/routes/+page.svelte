<script>
	import { setIn } from '$lib/immutable';

	export let data;
	// $: console.log(data);

	function updateImmutableName() {
		data = setIn(data, ['sammy', 0, 'name'], 'butt');
	}
</script>

<div>sammy: await users.where({`{ name: 'db sammy' }`}).results()</div>
{#each data.sammy as user}
	<div>{user.id} {user.name}</div>
{/each}

<div>
	emily: await users.where({`{ name: 'db emily' }`}).results(),
</div>
{#each data.emily as user}
	<div>{user.id} {user.name}</div>
{/each}

<div>
	idGt1: await users.where({`{ id: { gt: 1 } }`}).results()
</div>
{#each data.idGt1 as user}
	<div>{user.id} {user.name}</div>
{/each}

<!-- <button on:click={() => updateName('butt')}>change sammy to butt (fail)</button> -->
<button on:click={() => updateImmutableName('butt')}>change sammy to butt (succeed)</button>
