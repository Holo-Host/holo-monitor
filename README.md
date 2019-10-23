# Holo Monitor

The Holo Monitor keep track of when a hosts enable or disable an app for hosting my hosting device is automatically registered/deregistered with this Holo centralized services

## How To

### NodeJS App
- clone the repo to your local machine
- run `nix-shell`
- run `npm install`
- Make sure you have installed node and are using a version of node that supports `experimental-modules`
- Run this:
> `node --experimental-modules src/index.mjs`

- For running on a server:
> `npm start`


### Lets run tests:

- `npm install`
- `nix-shell` or `holochain -c conductor-config.toml`
- `npm run test:setup`
- `npm run test:enable-happs`
- `npm run once`
- curl to get GET LIST

**NOTE:** If you are unclear about how to get the keys to work, just look in the code.

## Reference Doc
- [DNA APIs](https://hackmd.io/_zUswSixRRK0NpnvoK1dLA)
