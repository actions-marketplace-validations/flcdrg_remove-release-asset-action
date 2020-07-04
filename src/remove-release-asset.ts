import core from '@actions/core';
//const { context, GitHub } = require('@actions/github');
import * as github from '@actions/github';

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

    const { owner, repo } = github.context.repo;

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const releaseId = parseInt(core.getInput('release_id', { required: true }));
    const assetName = core.getInput('asset_name', { required: true });

    const { data: assets } = await octokit.repos.listReleaseAssets({ 
      owner: owner, 
      repo: repo, 
      release_id: releaseId
    });

    const results: any[] = [];
    assets
      .filter(asset => asset.name === assetName)
      .forEach(asset => {
        results.push(octokit.repos.deleteReleaseAsset({ owner, repo, asset_id: asset.id }));
      });

    await Promise.all(results);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
