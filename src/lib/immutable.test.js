import { describe, it, expect } from 'vitest';
import { diff, fromJSON, get, setIn, toImmutable, toJSON } from './immutable';

describe('toImmutable test', () => {
	it('freezes an object', () => {
		const obj = { a: 1, b: { a: 1, b: [{ a: 1 }] } };
		const imObj = toImmutable(obj);

		expect(() => (imObj.a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);
		expect(() => (imObj.b = 2)).toThrowError(
			/^Cannot assign to read only property 'b' of object '#<Object>'$/
		);
		expect(() => (imObj.b.a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);
		expect(() => (imObj.b.b[0].a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);

		const imObjV2 = setIn(imObj, ['a'], 2);
		expect(imObj.a).toBe(1);
		expect(imObjV2.a).toBe(2);

		const path = ['b', 'b', 0, 'a'];
		const imObjV3 = setIn(imObjV2, path, 2);

		expect(imObj.b.b[0].a).toBe(1);
		expect(get(imObj, path)).toBe(1);

		expect(imObjV2.b.b[0].a).toBe(1);
		expect(get(imObjV2, path)).toBe(1);

		expect(imObjV3.b.b[0].a).toBe(2);
		expect(get(imObjV3, path)).toBe(2);

		// new version is also immutable
		expect(() => (imObjV3.a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);
		expect(() => (imObjV3.b = 2)).toThrowError(
			/^Cannot assign to read only property 'b' of object '#<Object>'$/
		);
		expect(() => (imObjV3.b.a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);
		expect(() => (imObjV3.b.b[0].a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);

		// JSON methods work fine
		const expectedJSON = '{"a":2,"b":{"a":1,"b":[{"a":2}]}}';
		expect(toJSON(imObjV3)).toBe(expectedJSON);
		const fromJSONObj = fromJSON(toJSON(imObjV3));
		expect(fromJSONObj).toStrictEqual(imObjV3);
		// new version is also immutable
		expect(() => (fromJSONObj.a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);
		expect(() => (fromJSONObj.b = 2)).toThrowError(
			/^Cannot assign to read only property 'b' of object '#<Object>'$/
		);
		expect(() => (fromJSONObj.b.a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);
		expect(() => (fromJSONObj.b.b[0].a = 2)).toThrowError(
			/^Cannot assign to read only property 'a' of object '#<Object>'$/
		);

		const objWithFn = toImmutable({ fn: () => 'butt' });
		expect(objWithFn.fn()).toBe('butt');
		expect(() => (objWithFn.fn = () => 'other butt')).toThrowError(
			/^Cannot assign to read only property 'fn' of object '#<Object>'$/
		);
	});

	it('can diff two immutable objects', () => {
		const obj = toImmutable({ a: 1, b: { a: 1, b: [{ a: 1 }] } });
		const objV2 = setIn(obj, ['b', 'b', 0, 'a'], 2);

		expect(diff(obj, objV2)).toStrictEqual({
			b: { b: [{ a: 2 }] }
		});

		expect(diff(obj, obj)).toStrictEqual({});
		expect(diff('a', 'a')).toStrictEqual('data-diff:no-diff');
		expect(diff('abc', 'bc')).toStrictEqual('bc');
	});

	const data1 = toImmutable({ g: { c: 3 }, x: 2, y: { z: 1 }, w: [5] });
	const data2 = toImmutable({ g: { c: 3 }, x: 2, y: { z: 2 }, w: [4] });

	expect(diff(data1, data2)).toStrictEqual({ w: [4], y: { z: 2 } });
});
