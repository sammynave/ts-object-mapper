import { toImmutable } from './immutable';

class Reading {
	#columns = ['*'];
	#order = null;
	#orderBy = null;
	#where = null;
	#table = null; // set by child

	res = [];

	constructor(client) {
		this.client = client;
	}

	select() {
		this.#columns = Object.values(arguments);
		return this;
	}

	selectAppend() {
		this.#columns = this.#columns.concat(Object.values(arguments));
		return this;
	}

	orderBy() {
		this.#orderBy = Object.values(arguments);
		return this;
	}

	order(dir) {
		this.#order = dir;
		return this;
	}

	where(conditions) {
		this.#where = conditions;
		return this;
	}

	get count() {
		return data.length;
	}

	get allUsers() {
		// return this.client.query('SELECT * from users limit 10;');
	}

	async results() {
		const conditions = Object.entries(this.#where)
			.map(([k, v]) => {
				if (typeof v === 'object' && 'gt' in v) {
					return `${k} > ${v.gt}`;
				} else {
					return `${k} = '${v}'`;
				}
			})
			.join(' AND ');
		const sql = `SELECT ${this.#columns.join(', ')} FROM ${this.table} WHERE ${conditions}`;
		const results = await this.client.query(sql);
		// execute query and cache here
		this.res = results.rows;

		return this.res;
	}
}
export { Reading };
