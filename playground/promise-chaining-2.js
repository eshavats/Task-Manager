require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5ec13e79d75b674dac43cc79").then((task) => {
//     console.log(task);
//     return Task.countDocuments({completed: false});
// }).then((tasks) => {
//     console.log(tasks);
// }).catch((e) => {
//     console.log(e);
// });

const deleteTaskAndCount = async (id) => {
    const count = await Task.countDocuments({completed: false});
    const task = await Task.findByIdAndDelete(id);
    const result = {
        task,
        count
    };
    return result;
};

deleteTaskAndCount("5ec143df4b19833af8b5d935").then((result) => {
    console.log("Task:", result.task);
    console.log("Incompleted tasks:", result.count);    
}).catch((e) => {
    console.log("Error:", e);    
});