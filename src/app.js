const minimatch = require("minimatch");

async function webhookPush(req, res, settings, triggerControllers) {
    if (!triggerControllers) {
        return res.status(400).send("triggers cannot be nil");
    }
    const body = req.body;
    if (!body.repository) {
      return res.status(400).send(`Repository not found!`);
    }
    if (!body.push) {
      return res.status(400).send(`Not a push`);
    }
    try {
      const reqRepoName = body.repository.name; // Get repo name
      const push = body.push.changes[0];
      const name = push.new.name; // get branch/tag name
      const isTag = push.new.type == "tag"; // check if tag

      triggerControllers.forEach(trigger => {
        const {repoName} = trigger.params;
        if (repoName && reqRepoName !== repoName) return;
        const pattern = trigger.params[isTag ? "tagPat" : "branchPat"];
        if (!pattern || !minimatch(name, pattern)) return;
        const msg = `${reqRepoName} ${isTag ? "Tag" : "Branch"} Push`;
        trigger.execute(msg, body);
      });
      res.status(200).send("OK");
    }
    catch (err){
      res.status(422).send(err.message);
    }
}

async function webhookPR(req, res, settings, triggerControllers) {
    if (!triggerControllers) {
        return res.status(400).send("triggers cannot be nil");
    }
    const body = req.body;
    if (!body.repository) {
      return res.status(400).send(`Repository not found!`);
    }
    try {
    const reqRepoName = body.repository.name; // Get repo name
    const reqFromBranch = body.pullrequest.source.branch.name; // get source branch name
    const reqToBranch = body.pullrequest.destination.branch.name; // get target branch name
    const reqActionType = req.headers["x-event-key"] ? // get action type that triggered the webhook
      req.headers["x-event-key"].split(':')[1]:
      null; 

      triggerControllers.forEach(trigger => {
        const {repoName, fromBranch, toBranch, actionType} = trigger.params;
        if (repoName && reqRepoName !== repoName) return;
        if (fromBranch && !minimatch(reqFromBranch, fromBranch)) return;
        if (toBranch && !minimatch(reqToBranch, toBranch)) return;
        if (actionType && actionType !== "any" && actionType !== reqActionType) return;
        const msg = `${reqRepoName} ${reqFromBranch}->${reqToBranch} ${reqActionType}`;
        trigger.execute(msg, body);
      });
      res.status(200).send("OK");
    }
    catch (err){
      res.status(422).send(err.message);
    }
}

module.exports = { 
    webhookPush,
    webhookPR
};