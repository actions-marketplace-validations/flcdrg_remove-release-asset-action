import * as core from '@actions/core';
import * as github from '@actions/github';
import { minimatch } from 'minimatch';

export async function run(): Promise<void> {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

    const { owner, repo } = github.context.repo;

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const releaseId = parseInt(core.getInput('release_id', { required: true }));
    const assetName = core.getInput('asset_name', { required: true });

    const { data: assets } = await octokit.rest.repos.listReleaseAssets({
      owner,
      repo,
      release_id: releaseId
    });

    for (const asset of assets.filter(a => minimatch(a.name, assetName))) {
      try {
        await octokit.rest.repos.deleteReleaseAsset({
          owner,
          repo,
          asset_id: asset.id
        });
      } catch (error) {
        core.warning(`Caught ${error}`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message ?? error);
    }
  }
}
