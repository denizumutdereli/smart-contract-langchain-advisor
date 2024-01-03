const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/users");

const multer = require("multer");
const upload = multer();

router.post("/signup", upload.single("avatar"), usersCtrl.signup);
router.post("/login", usersCtrl.login);
router.get("/test", usersCtrl.testServer);

module.exports = router;
