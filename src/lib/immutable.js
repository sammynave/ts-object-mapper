/*
	Do we want to create a set of persistent data structures à la Clojure, Immutable js, and Hamster.rb?

	Clojure: Collection, Lists, Vectors, Maps, Records, ArrayMaps, Sets
	Immutablejs: List, Map, OrderedMap, Set, OrderedSet, Stack, Record, Seq, Collection
	Hamster: Hash, Vector, Set, SortedSet, List, Dequeue

	laziness is the key feature of Seq which allows efficient chaining fo higher order collection methods (`map`, `filter`, etc...) without creating intermediate collections
*/

function toImmutable(object) {
	const propNames = Object.getOwnPropertyNames(object);
	for (const name of propNames) {
		const value = object[name];
		if (value && typeof value === 'object') {
			toImmutable(value);
		}
	}
	return Object.freeze(object);
}

function toJSON(obj) {
	return toImmutable(JSON.stringify(obj));
}

function fromJSON(json) {
	return toImmutable(JSON.parse(json));
}

// This should not be used outside of this file since it does not return an immutable value
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
	return toImmutable(res);
}

function isEmpty(value) {
	if (Array.isArray(value)) {
		return value.length === 0;
	}

	if (isObject(value)) {
		return Object.keys(value).length === 0;
	}
}

function union(a, b) {
	return toImmutable([...new Set(a.concat(b))]);
}

function isObject(value) {
	const type = typeof value;
	return value != null && (type === 'object' || type === 'function');
}

function diffObjects(data1, data2) {
	var emptyObject = Array.isArray(data1) ? toImmutable([]) : toImmutable({});
	if (data1 == data2) {
		return emptyObject;
	}
	var keys = union(Object.keys(data1), Object.keys(data2));
	return toImmutable(
		keys.reduce(function (acc, k) {
			var res = diff(get(data1, k), get(data2, k));
			if ((isObject(res) && isEmpty(res)) || res === 'data-diff:no-diff') {
				return acc;
			}
			return set(acc, k, res);
		}, emptyObject)
	);
}

function diff(data1, data2) {
	if (isObject(data1) && isObject(data2)) {
		return diffObjects(data1, data2);
	}
	if (data1 !== data2) {
		return data2;
	}
	return 'data-diff:no-diff';
}

export { get, set, setIn, toImmutable, fromJSON, toJSON, diff };
