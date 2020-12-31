const jwt = require("jsonwebtoken");
const User = require("../../models/users/user.model");
require("dotenv").config({
    path: "./../../.env",
});

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: data._id,
            "tokens.token": token,
        });
        if (!user) {
            throw new Error({error: 'No user found'});
        }
        next();
    } catch (error) {
        res.status(401).send({ error: "Unauthorized" });
    }
};

module.exports = auth;
