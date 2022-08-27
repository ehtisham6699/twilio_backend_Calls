const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Calls = require("../models/call_record");
const { Sequelize, Op } = require("sequelize");

const VoiceResponse = require("twilio").twiml.VoiceResponse;
///////////////////////////for displaying call records////////////////////
exports.fetchAllCalls = async (req, res) => {
  try {
    let calls = await Calls.findAll({
      order: [["id", "ASC"]],
    });
    return res.render("records", { calls });
  } catch (e) {
    return res.send(e.message);
  }
};
/////////////////intial greetings when the user calls/////////////////////
exports.setup = async (req, res) => {
  try {
    const response = new VoiceResponse();
    await Calls.create({
      callsid: req.body.CallSid,
      status: req.body.CallStatus,
      to: req.body.To,
      from: req.body.From,
    });
    const gather = response.gather({
      numDigits: 1,
      action: "/calls/inbound",
      method: "POST",
    });
    gather.say(
      "Thanks for calling Ehtisham backend test. " +
        "press 1 for call forwarding. " +
        "Press 2 for recording a message.",
      { loop: 3 }
    );

    res.type("text/xml");
    res.send(gather.toString());
  } catch (error) {
    return res.send(error);
  }
};
//////////////////////inbound call options for selection by user///////////////////////
exports.inbound = async (req, res) => {
  try {
    const call = await Calls.update(
      { status: req.body.CallStatus },
      { where: { callsid: req.body.CallSid } }
    );
    const response = new VoiceResponse();

    switch (req.body.Digits) {
      case "1":
        response.say(" Forwarding call");
        res.redirect("/calls/forwarding");
        break;
      case "2":
        response.say(" Voice message is selected");
        res.redirect("/calls/recordVoice");
        break;
      default:
        response.say("Incorrect Option");
        res.redirect("/calls/saveCall");
    }

    //res.type("text/xml");
  } catch (error) {
    res.send(error.message);
  }
};

////////////////////////////if the user press the 1 then this function triggers/////
exports.callForwarding = (req, res) => {
  try {
    let phone_number = process.env.MY_NUMBER;
    const response = new VoiceResponse();
    console.log(req.body);
    response.say("Dialing.");
    response.dial(phone_number, {
      action: "/calls/saveCall",
      method: "POST",
    });
    // res.redirect(307, "/calls/saveCall");
    res.type("text/xml");
    res.send(response.toString());
  } catch (error) {
    res.send(error.message);
  }
};

////////////////////////after call ends this functions stores it in DB//////////////////
exports.saveCall = async (req, res) => {
  try {
    const response = new VoiceResponse();
    console.log(req.body);
    response.say(" Thankyou . Call record added to DB");
    response.hangup();
    const update = {
      status: "Completed",
      method: "call",
      FromCountry: req.body.FromCountry,
      ToCountry: req.body.ToCountry,
      duration: req.body.DialCallDuration || 0,
    };
    await Calls.update(update, {
      where: { callsid: req.body.CallSid },
    });
    res.type("text/xml");
    res.send(response.toString());
  } catch (error) {
    res.send(error.message);
  }
};

//////////////////for choosing voice by user, this function records the voice////////////
exports.recordVoice = (req, res) => {
  try {
    const response = new VoiceResponse();
    response.say(
      "Please leave a message at the beep.\nPress the star key when finished."
    );
    response.record({
      action: "/calls/saveVoice",
      method: "POST",
      maxLength: 3,
      finishOnKey: "*",
    });
    res.type("text/xml");
    res.send(response.toString());
  } catch (error) {
    res.send(error.message);
  }
};
////////////////////////for saving voice note in DB////////////////////////
exports.saveVoice = async (req, res) => {
  try {
    const response = new VoiceResponse();
    response.say("Your VoiceMail is saved");
    response.hangup();
    await Calls.update(
      {
        status: "Completed",
        method: "voiceNote",
        FromCountry: req.body.FromCountry,
        ToCountry: req.body.ToCountry,
        RecordingUrl: req.body.RecordingUrl,
        duration: req.body.RecordingDuration,
      },
      { where: { callsid: req.body.CallSid } }
    );
    res.send(response.toString());
  } catch (error) {
    res.send(error.message);
  }
};
