# Holo Monitor

The Holo Monitor keep track of when a hosts enable or disable an app for hosting my hosting device is automatically registered/deregistered with this Holo centralized services

## How To

### NodeJS App
- clone the repo to your local machine
- run `npm install`
- run `nix-shell`
- For running on a server:
> `npm start`


### Lets run tests:

We need to install the node modules
- `npm install`
Enter Nix Shell
- `nix-shell`
Now lets preload the HHA DNA with apps
- `npm run test:setup`
Now lets run the holo-monitor once
This is to check if we get any enabled apps from the DNA
You should have the DNA pass an empty array
- `npm run once`
Now lets enable all the apps that we just registered in the DNA
- `npm run test:enable-happs`
Lets call the holo-monitor once
Expectation: you need to get the the enabled apps which would update the kv store
- `npm run once`
Check the kv store
Expectation: The kv store should have 2 happs and one host for each happ
- `npm run test:get-kv`
Now lets disable all the apps that we just registered in the DNA
- `npm run test:disable-happs`
Lets call the holo-monitor once
Expectation: you need to get the the disabled apps which would update the kv store
- `npm run once`
Check the kv store
Expectation: The kv store should have 2 happs and 0 host for each happ
- `npm run test:get-kv`

**NOTE:** If you are unclear about how to get the keys to work, just look in the code.

## Reference Doc
- [DNA APIs](https://hackmd.io/_zUswSixRRK0NpnvoK1dLA)
