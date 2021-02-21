const minimatch = require(`minimatch`);
const { findTriggers } = require(`../helpers`);

function controller(req, res) {
  const body = req.body;
  if (!body.repository) {
    return res.send(`Repository not found!`);
  }
  const repoName = body.repository.name; // Get repo name
  const fromBranch = body.pullrequest.source.branch.name; // get source branch name
  const toBranch = body.pullrequest.destination.branch.name; // get target branch name
  const actionType = req.headers["x-event-key"] ? // get action type that triggered the webhook
    req.headers["x-event-key"].split(':')[1]:
    null; 
  findTriggers(
    body,
    validateTriggerPR,
    { repoName, fromBranch, toBranch, actionType },
    req,
    res
  );
}

async function validateTriggerPR(trigger, { repoName, fromBranch, toBranch, actionType }) {
  const triggerRepoName = trigger.params.find((o) => o.name === `repoName`);
  const triggerFromBranch = trigger.params.find((o) => o.name === `fromBranch`);
  const triggerToBranch = trigger.params.find((o) => o.name === `toBranch`);
  const triggerActionType = trigger.params.find((o) => o.name === `actionType`);
  /**
   * if repo name was provided check it matches repo name in post request
   */
  if (triggerRepoName && triggerRepoName.value && triggerRepoName.value != `` && repoName != triggerRepoName.value) {
    throw `Not same repo`;
  }
  /**
   * if source branch was provided check if it matches source branch in pull request, if not then refuse
   */
  if (triggerFromBranch && triggerFromBranch.value && triggerFromBranch.value != `` && minimatch(fromBranch, triggerFromBranch.value)) {
    throw `Not same source branch`;
  }
  /**
   * if target branch was provided check if it matches target branch in pull request, if not then refuse
   */
  if (triggerToBranch && triggerToBranch.value && triggerToBranch.value != `` && minimatch(toBranch, triggerToBranch.value)) {
    throw `Not same source branch`;
  }
  /**
   * if no action type was provided, or it's value is any, then accept
   */
  if (!triggerActionType || !triggerActionType.value || triggerActionType.value == `any` || triggerActionType.value == ``){
    return true;
  }
  if (triggerActionType.value != actionType) {
    throw `Not same action`; 
  } 
  return true;
}

module.exports = { controller }
