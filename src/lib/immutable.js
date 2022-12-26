function toImmutable(object) {
	const propNames = Object.getOwnPropertyNames(object);
	for (const name of propNames) {
		const value = object[name];
		if (value && typeof value === 'object' && !Object.isFrozen(value)) {
			toImmutable(value);
		}
	}
	return Object.freeze(object);
}

function shallowCopy(o) {
	if (Array.isArray(o)) {
		return Object.assign([], o);
	}
	return Object.assign({}, o);
}

function set(o, k, v) {
	const mutCopy = shallowCopy(o);
	mutCopy[k] = v;
	return toImmutable(mutCopy);
}

function setIn(m, [k, ...restOfPath], v) {
	let modifiedNode = v;
	if (restOfPath.length > 0) {
		modifiedNode = setIn(m[k], restOfPath, v);
	}
	return set(m, k, modifiedNode);
}

function get(m, path) {
	let res = m;
	for (let i = 0; i < path.length; i++) {
		var key = path[i];
		res = res[key];
	}
	return res;
}

export { get, set, setIn, toImmutable };
