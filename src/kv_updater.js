'use strict'
const axios = require('axios')
require('dotenv').config()

const account = process.env.HM_ACCOUNT
const authEmail = process.env.HM_AUTH_EMAIL
const authKey = process.env.HM_AUTH_KEY
const namespace = process.env.HM_NAMESPACE

// vars for Cloudflare API urls
const baseURL = 'https://api.cloudflare.com'
const accountPath = 'client/v4/accounts'
const namespacePath = 'storage/kv/namespaces'

// Cloudflare API request vars
let url = ''
let method = ''
let headers = {}
const contentType = 'application/json'
let axiosRequest = {}

// FOR NOW DNS IS THE KEY
// DNA IS THE VALUE
const doCloudflareUpdate = async (kvKey, kvValue) => {
  console.log(kvKey + ':' + kvValue)
  // Setting axios url, method, and headers for request
  // javascript using backticks ` and string literals ${}
  url = `${baseURL}/${accountPath}/${account}/${namespacePath}/${namespace}/values/${kvKey}`
  method = 'PUT'
  headers = {
    'X-Auth-Email': authEmail,
    'X-Auth-Key': authKey,
    'Content-Type': contentType
  }
  axiosRequest = {
    url: url,
    method: method,
    headers: headers,
    data: kvValue
  }
  // console.log(axiosRequest)
  await doAxiosRequest()
}

const doCloudflareGet = async (kvKey) => {
  console.log(`Getting data from KV Storef for ${kvKey}...`)
  url = `${baseURL}/${accountPath}/${account}/${namespacePath}/${namespace}/values/${kvKey}`
  method = 'GET'
  headers = {
    'X-Auth-Email': authEmail,
    'X-Auth-Key': authKey,
    'Content-Type': contentType
  }
  axiosRequest = {
    url: url,
    method: method,
    headers: headers
  }
  // console.log(axiosRequest)
  return doAxiosRequest()
}

const doCloudflareGetList = async () => {
  console.log('Getting list of Key from KV Store...')
  url = `${baseURL}/${accountPath}/${account}/${namespacePath}/${namespace}/keys`
  method = 'GET'
  headers = {
    'X-Auth-Email': authEmail,
    'X-Auth-Key': authKey,
    'Content-Type': contentType
  }
  axiosRequest = {
    url: url,
    method: method,
    headers: headers
  }
  // console.log(axiosRequest)
  return doAxiosRequest()
}

// function for making requests
const doAxiosRequest = async () => {
  try {
    const response = await axios(axiosRequest)
    const data = response.data
    // console.log(data)
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}

module.exports = { doCloudflareUpdate, doCloudflareGet, doCloudflareGetList }
