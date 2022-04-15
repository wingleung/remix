# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

⚠️ EXPERIMENTAL ⚠️

The [same caveats](https://github.com/remix-run/remix/blob/main/templates/deno/README.md#-under-construction-) apply here as in our experimental, basic [Deno template](https://github.com/remix-run/remix/blob/main/templates/deno).

## Deno Deploy Setup

Let's get you setup with [Deno Deploy](https://deno.com/deploy)!

1. [Sign up](https://dash.deno.com/signin) for Deno Deploy.

2. [Create a new Deno Deploy project](https://dash.deno.com/new) for this app.

3. Replace `<your Deno Deploy project>` in the `deploy` script in `package.json` with your Deno deploy project name:

```json
{
  "scripts": {
    "deploy": "deployctl deploy --project=<your Deno Deploy project> --include=.cache,build,public ./build/index.js"

  }
}
```

4. [Create a personal access token](https://dash.deno.com/account) for the Deno Deploy API and export it as `DENO_DEPLOY_TOKEN`:

```sh
export DENO_DEPLOY_TOKEN=<your Deno Deploy API token>
```

You may want to add this to your `rc` file (e.g. `.bashrc` or `.zshrc`) to make it available for new terminal sessions, but make sure you don't commit this token into `git`.

5. Install the Deno Deploy CLI, [`deployctl`](https://github.com/denoland/deployctl):

```sh
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
```

If you have previously installed the Deno Deploy CLI, you should update it to the latest version:

```sh
deployctl upgrade
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deploy

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run build
npm run deploy
```

When the deployment is successful, `deployctl` will print out your project's IP address.