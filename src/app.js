const pushController = require('./controllers/push.controller');
const prController = require('./controllers/pr.controller');


module.exports = { 
    webhookPush: pushController.controller,
    webhookPR: prController.controller
};