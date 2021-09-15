const  bcrypt = require("bcrypt");
const data = {
    users: [
        {
            firstname: "Sherry",
            lastname: "Admin",
            phone: 9000000020,
            email: "admin@shop360.com",
            isAdmin: true,
            isConfirmed: 1,
            password: bcrypt.hashSync('1122Shop360?admin', 8),
        }
    ]
}

module.exports = data;