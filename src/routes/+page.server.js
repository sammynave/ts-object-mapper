import { Reading } from '$lib/relation';
import { error } from '@sveltejs/kit';
import pg from 'pg';
import { env } from '$env/dynamic/private';

const client = new pg.Client({
	user: env.PGUSER,
	host: env.PGHOST,
	database: env.PGDATABASE,
	password: env.PGPASSWORD,
	port: env.PGPORT
});
client.connect();

class Users extends Reading {
	table = 'users';

	constructor(client) {
		super(client);
	}

	all() {
		return this.select('id', 'name', 'email').orderBy('name').order('desc').results;
	}
}

export async function load() {
	const users = new Users(client);
	if (users) {
		return {
			// realUsers: realUsers.rows,
			// users: users.all(),
			// usersCount: users.count,
			sammy: await users.where({ name: 'db sammy' }).results(),
			emily: await users.where({ name: 'db emily' }).results(),
			idGt1: await users.where({ id: { gt: 1 } }).results()
		};
	}

	throw error(404, 'Not found');
}
