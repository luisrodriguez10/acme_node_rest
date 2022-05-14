const { Client } = require("pg");

const client = new Client(
  process.env.DATABASE_URL || "postgres://localhost/places_users_acme_db"
);

const getUsers = async () => {
  return (await client.query('SELECT * FROM "User";')).rows;
};

const getPlaces = async () => {
  return (await client.query('SELECT * FROM "Place";')).rows;
};

const createPlace = async ({ name }) => {
  await client.query('INSERT INTO "Place"(name) VALUES($1)', [name]);
};

const createUser = async ({ name }) => {
  await client.query('INSERT INTO "User"(name) VALUES($1)', [name]);
};

const getUser = async (id) => {
  return (await client.query('SELECT name FROM "User" WHERE id=$1', [id]))
    .rows[0];
};

const getPlacesUser = async (id) => {
  const SQL = `
        SELECT p.name
        FROM "User_Place" up
        JOIN "User" u
        ON up.user_id = u.id
        JOIN "Place" p
        ON up.place_id = p.id
        WHERE u.id = $1;
    `;
  return (await client.query(SQL, [id])).rows;
};

const deleteUser = async (id) => {
  const SQLOne = 'DELETE FROM "User_Place" WHERE user_id=$1;';
  const SQLTwo = 'DELETE FROM "User" WHERE id=$1;';
  await client.query(SQLOne, [id]);
  await client.query(SQLTwo, [id]);
};

const syncAndSeed = async () => {
  const SQL = `
        DROP TABLE IF EXISTS "User_Place";
        DROP TABLE IF EXISTS "User";
        DROP TABLE IF EXISTS "Place";
        CREATE TABLE "User"(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20) NOT NULL
        );
        CREATE TABLE "Place"(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20) NOT NULL
        );
        CREATE TABLE "User_Place"(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES "User"(id),
            place_id INTEGER REFERENCES "Place"(id)
        );
        INSERT INTO "User"(name) VALUES('Katty');
        INSERT INTO "User"(name) VALUES('Luis');
        INSERT INTO "User"(name) VALUES('Carmen');
        INSERT INTO "Place"(name) VALUES('Houston');
        INSERT INTO "Place"(name) VALUES('Lima');
        INSERT INTO "Place"(name) VALUES('Barranca');
        INSERT INTO "Place"(name) VALUES('Denver');
        INSERT INTO "Place"(name) VALUES('Asheville');
        INSERT INTO "Place"(name) VALUES('NYC');
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Katty'), (SELECT id FROM "Place" WHERE name='Lima'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Katty'), (SELECT id FROM "Place" WHERE name='Denver'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Katty'), (SELECT id FROM "Place" WHERE name='NYC'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Luis'), (SELECT id FROM "Place" WHERE name='Barranca'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Luis'), (SELECT id FROM "Place" WHERE name='NYC'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Luis'), (SELECT id FROM "Place" WHERE name='Denver'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Luis'), (SELECT id FROM "Place" WHERE name='Asheville'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Carmen'), (SELECT id FROM "Place" WHERE name='Houston'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Carmen'), (SELECT id FROM "Place" WHERE name='Asheville'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Carmen'), (SELECT id FROM "Place" WHERE name='Denver'));
        INSERT INTO "User_Place"(user_id, place_id) VALUES((SELECT id FROM "User" WHERE name='Carmen'), (SELECT id FROM "Place" WHERE name='NYC'));
    `;

  await client.query(SQL);
};

module.exports = {
  client,
  syncAndSeed,
  getUsers,
  getPlaces,
  createUser,
  deleteUser,
  createPlace,
  getPlacesUser,
  getUser,
};
