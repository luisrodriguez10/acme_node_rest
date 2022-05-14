const { getPlaces, getUsers, createUser, deleteUser } = require("../db");
const { head, nav } = require("../templates");
const app = require('express').Router()

module.exports = app;

app.get('/', async(req,res,next) => {
    try {
        const [users, places] = await Promise.all([getUsers(), getPlaces()]);
        res.send(`
            <html>
                ${head({ title: "The Acme Club" })}
                <body>
                    ${nav({ users, places })}
                    <h1>Users of the Acme Club</h1>
                    <form method="POST">
                        <input name='name'/>
                        <button>Create User</button>
                    </form>
                    <ul>
                        ${users.map(user => `
                            <li id="delete-user">${user.name} <form method="POST" action="/users/${user.id}?_method=DELETE"><button>X</button></form></li>
                        `).join('')}
                    </ul>
                </body>
            </html>
        `);
    } catch (error) {
        next(error)
    }
});

app.post('/', async(req,res,next) => {
    try {
        await createUser(req.body)
        res.redirect('/users')
    } catch (error) {
        next(error)
    }
})

app.delete('/:id', async(req,res,next) => {
    try {
        await deleteUser(req.params.id);
        res.redirect('/users')
    } catch (error) {
        next(error)
    }
});