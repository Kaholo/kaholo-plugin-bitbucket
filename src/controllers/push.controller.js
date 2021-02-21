const minimatch = require("minimatch");
const { findTriggers } = require("../helpers");

function controller(req, res) {
  const body = req.body;

  if (!body.repository) {
    return res.send(`Repository not found!`);
  }
  if (!body.push) {
    return res.send(`Not a push`);
  }
  const repoName = body.repository.name; // Get repo name
  const push = body.push.changes[0];
  const name = push.new.name; // get branch name
  const isTag = push.new.type == "tag"; // check if tag
  findTriggers(
    body,
    validateTriggerPush,
    { repoName, name, isTag },
    req,
    res,
    "webhookPush"
  );
}

async function validateTriggerPush(trigger, { repoName, name, isTag }) {
  const triggerRepoName = trigger.params.find((o) => o.name === "repoName");
  const triggerBranchPat = trigger.params.find((o) => o.name === "branchPat");
  const triggerTagPat = trigger.params.find((o) => o.name === "tagPat");
  /**
   * if repo name was provided check it matches repo name in post request
   */
  if (triggerRepoName.value && repoName !== triggerRepoName.value) {
    throw "Not same repo";
  }
  /**
   * if neither tag or branch was provided, accept both
   */
  if (!triggerBranchPat.value && !triggerTagPat.value){
    return true;
  }
  /**
   * if branch was provided check if it matches branch in post request, if so then accept
   */
  if (triggerBranchPat.value && !isTag && minimatch(name, triggerBranchPat.value)) {
    return true;
  }
  /**
  * if tag was provided check if it matches tag in post request, if so then accept
  */
  if (triggerTagPat.value && isTag && minimatch(name, triggerTagPat.value)) {
    return true;
  }
  throw "Failed filtering";
}

module.exports = { controller }
