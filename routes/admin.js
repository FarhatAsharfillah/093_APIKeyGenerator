const express = require("express");
const router = express.Router();
const db = require("../db");

// ========================
// ADMIN REGISTER
// ========================
router.post("/register", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email required" });
    }

    const sql = "INSERT INTO admins (email) VALUES (?)";

    db.query(sql, [email], (err) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
            message: "Admin registered",
            role: "admin"
        });
    });
});

// ========================
// ADMIN LOGIN
// ========================
router.post("/login", async (req, res) => {
    try {
        const { email } = req.body;

        const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Admin not found" });
        }

        res.json({
            message: "Admin login successful",
            role: "admin",
            admin: rows[0]
        });

    } catch (err) {
        res.status(500).json({ error: err });
    }
});


// ========================
// VIEW USERS (ADMIN ONLY)
// ========================

// GET ALL USERS
router.get("/view-users", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                users.id,
                users.firstname,
                users.lastname,
                users.email,
                apikey.apikey_hash,
                apikey.status,
                apikey.expired_at
            FROM users
            LEFT JOIN apikey ON users.apikey_id = apikey.id
        `);

        res.json({ success: true, users: rows });

    } catch (err) {
        console.log("VIEW USERS ERROR:", err);
        res.status(500).json({ 
        success: false, 
        message: "Failed to load users",
        error: err  });
    }
});




module.exports = router;

