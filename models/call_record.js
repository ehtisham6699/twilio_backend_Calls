const Sequelize = require("sequelize");
const db = require("../config/database");

const call_record = db.define(
  "call_record",
  {
    callsid: {
      type: Sequelize.STRING,
      required: true,
    },

    duration: {
      type: Sequelize.INTEGER,
      required: true,
    },

    RecordingUrl: {
      type: Sequelize.STRING,
    },
    FromCountry: {
      type: Sequelize.STRING,
    },
    ToCountry: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      required: true,
    },
    from: {
      type: Sequelize.STRING,
      required: true,
    },
    to: {
      type: Sequelize.STRING,
      required: true,
    },
    method: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  { timestamps: true }
);

call_record.sync({ alter: true }).then(() => {
  console.log("All models created");
});

module.exports = call_record;
