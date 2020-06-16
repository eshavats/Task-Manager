const express = require("express");
require("./db/mongoose.js");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

//Maintenance
// app.use((req, res, next) => {
//     return res.status(503).send("We're under maintenance! Please try again later.");
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server is up on " + port);
});

const main = async () => {
    const user = await User.findById("5ee90375e867d303b00fd7c0");
    await user.populate("tasks").execPopulate()
    console.log(user.tasks);
}

main();