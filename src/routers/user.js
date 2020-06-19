const express = require("express");
const User = require ("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

//View our profile
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

//Register
router.post("/users", async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }

});

//Login
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        
        res.send({ user, token });
    } catch(e) {
        res.status(400).send("Unable to login!");
    }
});

//Logout user from one device
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send("Logged out successfully!");
    } catch(e) {
        res.status(500).send();
    }
});

//Logout user from all devices
router.post("/users/logoutALL", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send("Logged out of all devices!");
    } catch(e) {
        res.status(500).send();
    }
});

//Update user
router.patch("/users/me", auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation)
    {
        res.status(400).send({error: "Invalid update!"});
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e);
    }
});

//Delete user
router.delete("/users/me", auth, async (req, res) => {
    
    try {
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }

});

module.exports = router;