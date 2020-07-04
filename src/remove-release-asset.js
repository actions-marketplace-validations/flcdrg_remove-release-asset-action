const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    const { owner, repo } = context.repo;

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const releaseId = core.getInput('release_id', { required: true });
    const assetName = core.getInput('asset_name', { required: true });

    const { data: assets } = await github.repos.listAssetsForRelease({ owner, repo, releaseId });

    const results = [];
    assets
      .filter(asset => asset.name === assetName)
      .forEach(asset => {
        results.push(github.repos.deleteReleaseAsset({ owner, repo, asset_id: asset.id }));
      });

    await Promise.all(results);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
