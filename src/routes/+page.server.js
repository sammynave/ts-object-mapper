import { error } from '@sveltejs/kit';

const data = [
	{ id: 1, name: 'sammy', email: 'sammy@email.com' },
	{ id: 2, name: 'emily', email: 'emily@email.com' }
];

class Reading {
	#columns = '*';
	#order = null;
	#orderBy = null;
	#where = null;

	#results = [];

	select() {
		this.#columns = Object.values(arguments);
		console.log({ select: this.#columns });
		return this;
	}

	selectAppend() {
		this.#columns = this.#columns.concat(Object.values(arguments));
		console.log({ select: this.#columns });
		return this;
	}

	orderBy() {
		this.#orderBy = Object.values(arguments);
		console.log({ order: this.#orderBy });
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

	get results() {
		this.#results = data.reduce((r, d) => {
			const obj = {};
			this.#columns.forEach((c) => {
				if (this.#where !== null) {
					Object.entries(this.#where).forEach(([key, value]) => {
						if (typeof value === 'object' && value !== null) {
							if ('gt' in value && d[key] > value.gt) {
								obj[c] = d[c];
							}
						} else if (d[key] === value) {
							obj[c] = d[c];
						}
					});
				} else {
					obj[c] = d[c];
				}
			});

			if (Object.keys(obj).length) {
				r.push(obj);
			}
			return r;
		}, []);

		// execute query and cache here

		return this.#results;
	}
}

class Users extends Reading {
	all() {
		return this.select('id', 'name', 'email').orderBy('name').order('desc').results;
	}
}

export async function load() {
	const users = new Users();

	if (users) {
		return {
			users: users.all(),
			usersCount: users.count,
			sammy: users.where({ name: 'sammy' }).results,
			emily: users.where({ name: 'emily' }).results,
			idGt1: users.where({ id: { gt: 1 } }).results
		};
	}

	throw error(404, 'Not found');
}
