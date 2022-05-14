const { syncAndSeed, client, getPlaces, getUsers } = require("./db");
const { head, nav } = require("./templates");
const express = require("express");
const app = express();

app.use("/assets", express.static("assets"));
app.use(express.urlencoded({ extended: false }));
app.use(require("method-override")("_method"));

app.get("/", async (req, res, next) => {
  try {
    const [users, places] = await Promise.all([getUsers(), getPlaces()]);
    res.send(`
        <html>
            ${head({ title: "The Acme Club" })}
            <body>
                ${nav({ users, places })}
                <h1>Welcome to the Acme Club</h1>
            </body>
        </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.use('/users', require('./routes/users'));

app.use('/places', require('./routes/places'));



const init = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

init();
