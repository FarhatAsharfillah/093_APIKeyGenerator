const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/user", require("./routes/user"));
app.use("/admin", require("./routes/admin"));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
