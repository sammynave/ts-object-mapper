<script>
	export let data;

	$: console.log(data);
</script>

{#each data.users as user}
	<div>{user.id} {user.name}</div>
{/each}
