const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require ("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendGoodbyeEmail } = require("../emails/accounts");
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
        sendWelcomeEmail(user.email, user.name);
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
        sendGoodbyeEmail(req.user.email, req.user.name)
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }

});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/))
        {
            return cb(new Error("Please upload an image of jpg/jpeg/png format"));
        }
        cb(undefined, true);
    }
});

//Upload avatar 
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("Profile avatar added successfully!");
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

//Delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send("Profile avatar deleted successfully!");
    } catch(e) {
        res.status(400).send(e);
    }
});

//Display avatar
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar)
        {
            throw new Error();
        }
        res.set("Content-Type", "image/jpg");
        res.send(user.avatar);
    } catch(e) {
        res.status(400).send();
    }
});

module.exports = router;