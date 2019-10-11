const User = require('../models').User
const route = require('express').Router()
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

route.post('/signin', (req, res) => {
    console.log(req.body);
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then((users) => {
            if (users) {
                if (!bcrypt.compareSync(req.body.password, users.password)) {
                    req.session.user = null;
                    return res.status(401).send({
                        title: 'Login failed',
                        error: { message: 'Invalid login credentials' }
                    });
                }
                console.log(users["dataValues"].id);
                req.session.user = users;
                // var token = jwt.sign({ user: users }, 'secret', { expiresIn: 720000 });
                res.redirect('/bands/');
            }

            else {
                req.session.user = null;
                res.status(500).send({
                    error: "Invalid email or password"
                })
            }
        })
        .catch((err) => {
            req.session.user = null;
            res.status(500).send({
                error: "Invalid email or password"
            })
        })

})

route.get('/signin', (req, res) => {
    if (req.session.user) {
        res.redirect('/bands');
    } else {
        res.render("login");
    }
});

route.get('/signup', (req, res) => {
    res.render('Signup');
});

route.post('/signup', (req, res) => {
    // We will create a new user 
    console.log("in post");
    console.log(req.body.password);
    console.log(req.body);
    User.create({
        name: req.body.name,
        email: req.body.email,
        college: req.body.college,
        dob: req.body.dob,
        password: bcrypt.hashSync(req.body.password, 10)
    }).then((user) => {
        res.status(201).send(user)
    }).catch((err) => {
        console.log(err);

        res.status(501).send({

            error: err.errors
        })
    })
    res.redirect('/users/signin');
})

route.get('/logout', function (req, res) {
    console.log("xfvfg");
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("login");
        }
    });
})

route.get('/isloggedin', function (req, res) {
    if (req.session.user) {
        res.send({
            done: true,
            name: req.session.user.name
        })
    }
    else
        res.send({
            done: false,
        })
})

exports = module.exports = route 
