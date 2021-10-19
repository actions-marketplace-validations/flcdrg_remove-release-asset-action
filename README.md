# GitHub Action - Remove Release Asset

Removes an existing asset from a release

## Usage

```yaml
- name: Remove asset
  uses: flcdrg/remove-release-asset-action@v1
  id: remove
  env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
      release_id: ${{ steps.create-test-release.outputs.id }}
      asset_name: package.json
```

### Inputs

- `release_id`: GitHub release id
- `asset_name`: Name of asset to remove

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
