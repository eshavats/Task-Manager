require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate("5ec13b8c5c015a4110111398", {age: 69}).then((user) => {
//     console.log(user);
//     return User.countDocuments({age: 69});
// }).then((count) => {
//     console.log(count);
// }).catch((e) => {
//     console.log(e);
// });

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    const result = {
        user,
        count
    };
    return result;
};

updateAgeAndCount("5ec15ca5c1e0bc033897ae7e", 21).then((result) => {
    console.log("User:", result.user);
    console.log("Count:", result.count); 
}).catch((e) => {
    console.log("Error:", e);    
});

