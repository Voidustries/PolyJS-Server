const routes = require("express").Router();
const User = require("../../models/users/user.model");
const auth = require("../middleware/authController");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

routes.post("/login", async (req, res) => {
    await sleep(3000)
    const { username, password } = req.body;
    if (
        username == undefined ||
        Array.isArray(username) ||
        password == undefined ||
        Array.isArray(password)
    ) {
        res.status(400).send({ error: "Malformed Json" });
        return;
    }
    User.findOne({ username }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(400).send({ error: "Invalid credentials" });
            return;
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
                res.status(400).send({ error: "Invalid credentials" });
            } else {
                const token = user.generateAuthToken();
                res.status(200).send({ token: token, user: user.username });
            }
        });
    });
});

routes.post("/register", (req, res) => {
    try {
        if (req.body.isAdmin) throw error;
        const user = new User(req.body);
        const token = user.generateAuthToken();
        res.status(200).send({ token });
    } catch (error) {
        res.status(400).send({ error });
    }
});

routes.delete("/logout", auth, async (req, res) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await User.findOne({ "tokens.token": token });
    user.revokeAuthToken(token);
    res.status("200").json({ message: "Logout" });
});

routes.get("/authtest", auth, (req, res) => {
    res.status(200).send();
});

module.exports = routes;