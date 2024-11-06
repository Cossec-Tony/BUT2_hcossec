const express = require('express');
const session = require('express-session');
const app = express();
const userModel = require("./models/userModel.js");
md5 = require("md5");

// Setting view engine
app.set('view engine', 'ejs');

// Loading statics files (css, images, ...)
app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'pamplemousse',
    resave: false,
    saveUninitialized: false,
}));

app.get('/', function (req, res) {
    res.render("index");
})

app.get("/login", function (req, res) {
    res.render("login", { error: null });
});

app.post("/login", async function (req, res) {
    const { login, password } = req.body;
    try {
        const user = await userModel.checkLogin(login);
        
        if (user != false && md5(password) == user.password) {
            req.session.userId = user.id;
            return res.redirect("/users/list");
        }

        res.render("login", { error: "Login ou mot de passe incorrect" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.status(500).send("Erreur lors de la déconnexion");
        }
        res.redirect("/login");
    });
});

app.get("/users/list", async function (req, res) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    try {
        const users = await userModel.getAllUsers();
        res.render("liste_utilisateurs", { users });
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération des données");
    }
});

app.use(function (req, res) {
    res.status(404).render("404");
})

app.listen(3000, function () {
    console.log('Server running on port 3000');
});



