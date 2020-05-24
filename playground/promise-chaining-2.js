require("../src/db/mongoose");
const Task = require("../src/models/task");

Task.findByIdAndDelete("5ec13e79d75b674dac43cc79").then((task) => {
    console.log(task);
    return Task.countDocuments({completed: false});
}).then((tasks) => {
    console.log(tasks);
}).catch((e) => {
    console.log(e);
});