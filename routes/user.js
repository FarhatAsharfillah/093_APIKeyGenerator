const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const db = require("../db");

// Generate API Key
function generateKey() {
    return crypto.randomBytes(20).toString("hex");
}

// Hash API Key
function hashKey(key) {
    return crypto.createHash("sha256").update(key).digest("hex");
}

// ========================
// USER REGISTER
// ========================
router.post("/register", (req, res) => {
    const { firstname, lastname, email } = req.body;

    if (!firstname || !lastname || !email) {
        return res.status(400).json({ message: "Incomplete data" });
    }

    const apiKeyPlain = generateKey();
    const apiKeyHash = hashKey(apiKeyPlain);

    let expired = new Date();
    expired.setMonth(expired.getMonth() + 1);

    const sqlApikey =
        "INSERT INTO apikey (apikey_hash, expired_at, status) VALUES (?, ?, 'active')";

    db.query(sqlApikey, [apiKeyHash, expired], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        const apikey_id = result.insertId;

        const sqlUser =
            "INSERT INTO users (firstname, lastname, email, apikey_id) VALUES (?, ?, ?, ?)";

        db.query(sqlUser, [firstname, lastname, email, apikey_id], (err2) => {
            if (err2) return res.status(500).json({ error: err2 });

            res.json({
                message: "User registered",
                apikey: apiKeyPlain,
                role: "user"
            });
        });
    });
});

// ========================
// USER LOGIN
// ========================
router.post("/login", (req, res) => {
    const { email } = req.body;

    const sql = `
        SELECT 
            u.firstname, u.lastname, u.email,
            a.apikey_hash, a.expired_at, a.status
        FROM users u
        LEFT JOIN apikey a ON u.apikey_id = a.id
        WHERE u.email = ?
    `;

    db.query(sql, [email], (err, rows) => {
        if (err) return res.status(500).json({ error: err });

        if (rows.length === 0)
            return res.status(400).json({ message: "User not found" });

        res.json({
            message: "Login successful",
            role: "user",
            user: rows[0]
        });
    });
});

module.exports = router;