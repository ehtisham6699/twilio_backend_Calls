const express = require("express");
const router = express.Router();
const db = require("../config/database");
const User = require("../models/call_record");
const Sequelize = require("sequelize");
const call_controller = require("../controller/call_controller");
router.get("/allRecords", call_controller.fetchAllCalls);

router.post("/inbound", call_controller.inbound);
router.post("/callSetup", call_controller.setup);
router.post("/saveCall", call_controller.saveCall);
router.get("/forwarding", call_controller.callForwarding);
router.get("/recordVoice", call_controller.recordVoice);
router.post("/saveVoice", call_controller.saveVoice);

module.exports = router;
