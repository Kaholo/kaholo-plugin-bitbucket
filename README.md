# kaholo-trigger-bitbucket
Simple webhook trigger for Bitbucket

## How to use:
After installing the plugin on Kaholo,
on your Bitbucket repository, create a new webhook and set the URL required by each method.

Whenever creating a new Trigger in Kaholo, you can specify the following:
* Repository URL: The repository which pushing to will start the execution (e.g https://github.com/Kaholo/kaholo-plugin-GithubTrigger.git) 
* Branch : The branch which pushing to will start the execution

## Git Push:
This trigger whenever there is a push to a repository.

### Webhook URL:
**{KAHOLO_URL}/webhook/bitbucket/push**

### Parameters:
1) Branch - the branch or branch [minimatch pattern](https://github.com/isaacs/minimatch#readme) (if not specified, then any branch)
2) Tag - the tag or tag [minimatch pattern](https://github.com/isaacs/minimatch#readme) (if not specified, then any tag)
3) Repo Name - The repository Name (if not specified, then all repositories)

## Bitbucket Pull Request merge:
This trigger whenever there is merge of a pull request.

### Webhook URL:
**{KAHOLO_URL}/webhook/Bitbucket/pr**

### Parameters:
1) Target Branch - the target branch or target branch [minimatch pattern](https://github.com/isaacs/minimatch#readme) of the pull request(if not specified, then any branch)
1) Source Branch - the source branch or source branch [minimatch pattern](https://github.com/isaacs/minimatch#readme) of the pull request(if not specified, then any branch)
3) Repo Name - The repository Name (if not specified, then all repositories)
4) Trigger on action - the action that will cause it to trigger. if not specified then any. options are: 
    - Any
    - Created
    - Merged
    - Approved
    - Declined
    - Updated