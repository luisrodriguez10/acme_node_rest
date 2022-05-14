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

const deleteUser = async (id) => {
  await client.query('DELETE FROM "User" WHERE id=$1', [id]);
};

const syncAndSeed = async () => {
  const SQL = `
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
        INSERT INTO "User"(name) VALUES('Katty');
        INSERT INTO "User"(name) VALUES('Luis');
        INSERT INTO "User"(name) VALUES('Carmen');
        INSERT INTO "Place"(name) VALUES('Houston');
        INSERT INTO "Place"(name) VALUES('Lima');
        INSERT INTO "Place"(name) VALUES('Barranca');
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
};
