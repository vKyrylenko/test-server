const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(3000, function () {
    console.log('listening on 3000')
});

const users = [];

app.get('/users', function (req, res) {
    res.json(users);
});

app.post('/users', function (req, res) {
    if (!req.body || (req.body && !req.body.telephone)) {
        return res.status(404).send('telephone is required!');
    } else {
        const isUserWithTelephoneExist = users.some((user) => {
            return user.telephone === req.body.telephone;
        });
        if (isUserWithTelephoneExist) {
            return res.status(404).send('user with this telephone is already exist!');
        }
        const user = Object.assign({}, req.body, {id: +Date.now()});
        users.push(user);
        res.json(user);
    }
});

app.delete('/users/:id', function (req, res) {
    const deleteIndex = users.findIndex((user => user.id == req.params.id));
    if (deleteIndex === -1) {
        return res.status(404).send('user with this id not found!');
    }
    users.splice(deleteIndex, 1);
    res.sendStatus(200);
});

app.put('/users/:id', (req, res) => {
    const updateIndex = users.findIndex((user => {
        return user.id == req.params.id
    }));
    if (updateIndex === -1) {
        return res.status(404).send('user with this id not found!');
    }

    users.splice(updateIndex, 1, Object.assign(users[updateIndex], req.body));

    res.json({data: users[updateIndex]});
});