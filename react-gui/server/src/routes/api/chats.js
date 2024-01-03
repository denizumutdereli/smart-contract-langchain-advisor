const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chats");

router.use(require("../../config/auth"));
router.get("/", chatController.getAllChats);
router.get("/:id", chatController.getChat); 
router.put("/rename", chatController.renameChat);
router.post("/create", chatController.createChat); 
router.post("/addMessage", chatController.addMessage);
router.delete("/delete", chatController.deleteChat); 
router.delete("/deleteAll", chatController.deleteAllChats); 
module.exports = router;
