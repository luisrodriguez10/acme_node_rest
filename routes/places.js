const { getPlaces, getUsers } = require("../db");
const { head, nav } = require("../templates");
const app = require('express').Router()

module.exports = app

app.get('/', async(req,res,next) => {
    try {
        const [users, places] = await Promise.all([getUsers(), getPlaces()]);
        res.send(`
            <html>
                ${head({ title: "The Acme Club" })}
                <body>
                    ${nav({ users, places })}
                    <h1>Places of the Acme Club</h1>
                    <ul>
                        ${places.map(place => `
                            <li>${place.name}</li>
                        `).join('')}
                    </ul>
                </body>
            </html>
        `);
    } catch (error) {
        next(error)
    }
});
