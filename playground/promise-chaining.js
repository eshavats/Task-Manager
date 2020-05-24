require("../src/db/mongoose");
const User = require("../src/models/user");

User.findByIdAndUpdate("5ec13b8c5c015a4110111398", {age: 69}).then((user) => {
    console.log(user);
    return User.countDocuments({age: 69});
}).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
});