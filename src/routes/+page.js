import { toImmutable } from '$lib/immutable';

export async function load({ data }) {
	return toImmutable(data);
}
