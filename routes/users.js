const { getPlaces, getUsers, createUser, deleteUser, getPlacesUser, getUser } = require("../db");
const { head, nav } = require("../templates");
const app = require('express').Router()

module.exports = app;

app.get('/', async(req,res,next) => {
    try {
        const [users, places] = await Promise.all([getUsers(), getPlaces()]);
        res.send(`
            <html>
                ${head({ title: "The Acme Users" })}
                <body>
                    ${nav({ users, places })}
                    <h1>Users of the Acme Club</h1>
                    <form method="POST">
                        <input name='name'/>
                        <button>Create User</button>
                    </form>
                    <ul>
                        ${users.map(user => `
                            <li><a href="/users/${user.id}">${user.name}</a></li>
                            <form method="POST" action="/users/${user.id}?_method=DELETE"><button>X</button></form>
                        `).join('')}
                    </ul>
                </body>
            </html>
        `);
    } catch (error) {
        next(error)
    }
});

app.get('/:id', async(req,res,next) =>{
    try {
        const [users, places, placeUser, user] = await Promise.all([getUsers(), getPlaces(), getPlacesUser(req.params.id), getUser(req.params.id)]);
        if(placeUser.length){
            res.send(`
                <html>
                    ${head({ title: "The Acme Users" })}
                    <body>
                        ${nav({ users, places })}
                        <h1>Places visited by ${user.name}</h1>
                        <ul>
                        ${placeUser.map(place => `
                            <li>${place.name}</li>
                            `).join('')}
                        </ul>
                        <p><a href='/users'>Return to Users Page</a><p>
                    </body>
                </html>
        `);
        }else{
            res.send(`
                <html>
                    ${head({ title: "The Acme Users" })}
                    <body>
                        ${nav({ users, places })}
                        <h1>Places visited by ${user.name}</h1>
                        <p>${user.name} has not visited places yet.</p>
                        <p><a href='/users'>Return to Users Page</a><p>
                    </body>
                </html>
            `);
        }
        
    } catch (error) {
        next(error)
    }
})

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