# TODO

- [ ] Relation
  - [ ] Reading
    - [ ] .where
    - [ ] .select
    - [ ] .join
      - [ ] .include (related records)
      - [ ]
    - [ ] .leftOuterJoin
    - [ ] .cte ???
    - [ ] aggregate functions
      - [ ] .count
      - [ ] .sum
      - [ ] .avg
      - [ ] .having
    - [ ] .orderBy
    - [ ] .limits
    - [ ] .cursor/paginate
  - [ ] Writing
    - [ ] update
    - [ ] insert
    - [ ] upsert
    - [ ] delete

# Test DB

```
CREATE TABLE "public"."users" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "name" text,
    "email" text,
    PRIMARY KEY ("id"),
    UNIQUE ("email")
);
```

# Design

example:

```js

  class Posts extends Relation {
    schema = {
      id: Integer,
      title: String,
      associations: {
        user: 'belongsTo'
      }
    }
  }

  class Users extends Relation {
    schema = {
      id: Integer,
      name: String,
      associations: {
        posts: 'hasMany'
      }
    }


  }

  class UserRepo extends Repo {
    relation = UsersRelation

    // commands
    create(attrs) { }
    update(id:, attrs) { }
    delete(id:) { }

    // queries
    // NOTE: `where` and `by_pk` should not leak out into application domain layer
    query(conditions) {
      relation.where(conditions).many
    }

    byId(id) {
      relation.byPk(id).one
    }
  }
```
