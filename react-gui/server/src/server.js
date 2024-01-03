require('dotenv').config({ path: '.env.local' });

const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const favicon = require("serve-favicon");

require("./config/database");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors()); 

app.use(require("./config/auth"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/chats", require("./routes/api/chats"));

app.get("/*", function (req, res) {
  res.status(404).json({ msg: "Not Found" });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`App is now running on port ${port}`);
});
