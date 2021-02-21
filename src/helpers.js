const config = require("./config");
const mapExecutionService = require("../../../api/services/map-execution.service");
const Trigger = require("../../../api/models/map-trigger.model");

function findTriggers(body, validatationFn, startParams, req, res, method) {
  Trigger.find({ plugin: config.name, method: method})
    .then((triggers) => {
      console.log(`Found ${triggers.length} triggers`);
      res.send("OK");
      triggers.forEach((trigger) => {
        validatationFn(trigger, startParams)
          .then(exec(trigger, body, req.io))
          .catch(console.error);
      });
    })
    .catch((error) => res.send(error));
}

function exec(trigger, body, io) {
  return () => {
    console.log(trigger.map);
    let message = trigger.name + " - Started by BitBucket trigger";
    console.log(`******** BitBucket: executing map ${trigger.map} ********`);
    mapExecutionService.execute(
      trigger.map,
      null,
      io,
      { config: trigger.configuration },
      message,
      body
    );
  };
}

module.exports = { findTriggers };
