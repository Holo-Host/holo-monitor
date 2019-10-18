const { connect } = require('@holochain/hc-web-client')
const axios = require('axios')
const HAPP_CONFIG = require('./HappConfig.js')
const {DNA_PORT, CONDUCTOR_HTTP_PORT, HHA_INSTANCE_ID, HS_INSTANCE_ID} = require("../../src/consts")
const { pingConductor } = require("../../src/hc_client")

pingConductor()
  .then(() => {
    connect({ url: "ws://localhost:"+DNA_PORT }).then(({ callZome, close }) => {
      const holochainZomeCall = (instance, zomeName, zomeFuncName, args) => {
        try {
          return callZome(instance, zomeName, zomeFuncName)(args).then(r => {
            console.log(`${zomeFuncName} SUCCESS!  Entry address : `, r)
            return r
          })
            .catch(e => console.log('HC ZomeCall error occured. >> ERROR :  ', e))
        } catch (e) {
          console.log(`Error occured when connecting to HC conductor. >> ERROR: (${e})`)
        }
      }

      const PROVIDER_SHIMS = {
        // 1. registerProvider
        registerAsProvider: () => {
          return new Promise((resolve, reject) => {
            const regProviderCall = holochainZomeCall(
              HHA_INSTANCE_ID,
              'provider',
              'register_as_provider',
              {
                provider_doc: {
                  kyc_proof: 'TODO: This info is currently not required.'
                }
              }
            )
            resolve(regProviderCall)
          })
        },

        // 2. create App in has
        createHapp: (happId) => {
          const happ = HAPP_CONFIG[happId]
          return holochainZomeCall(
            HS_INSTANCE_ID,
            'happs',
            'create_app',
            {
              title: happ.title,
              description: happ.description,
              thumbnail_url: happ.thumbnail_url,
              homepage_url: happ.homepage_url,
              ui: happ.ui,
              dnas: happ.dna
            }
          )
        },

        // 3. register App in holo-hosting-app
        registerHapp: (happStoreId, happId) => {
          const happ = HAPP_CONFIG[happId]

          return holochainZomeCall(
            HHA_INSTANCE_ID,
            'provider',
            'register_app',
            {
              app_bundle: {
                happ_hash: happStoreId
              },
              domain_name: happ.domain
            }
          )
        },

        // currently adds dummy data
        addHolofuelAccount: () => holochainZomeCall(HHA_INSTANCE_ID, 'provider', 'add_holofuel_account', { holofuel_account_details: {account_number: 'not currently used'} })
      }

      const registerProvider = new Promise((resolve, reject) => resolve(PROVIDER_SHIMS.registerAsProvider()))
      const happConfigKeys = Object.keys(HAPP_CONFIG)
      const fillHappStore = () => {
        happConfigKeys.forEach(happId => {
          PROVIDER_SHIMS.createHapp(happId)
            .then(r => {
              const { Ok: happStoreId } = JSON.parse(r)
              PROVIDER_SHIMS.registerHapp(happStoreId, happId)
            })
            .catch(error => { return error })
        })
      }

      registerProvider
        .then(_ => fillHappStore())
        .then(_ => {PROVIDER_SHIMS.addHolofuelAccount()

        })
        .catch(e => console.log(`Error when registering Provider. >> ERROR : ${e}`))
    }) // end of SHIMS
  })
