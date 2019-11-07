'use strict';
const axios = require('axios')
const fs = require('fs')

// read file for keys
let contents = fs.readFileSync("keys.json")
const KEYS = JSON.parse(contents)

let account = KEYS.account
let auth_email = KEYS.auth_email
let auth_key = KEYS.auth_key
let namespace = KEYS.namespace

// vars for Cloudflare API urls
let base_url = "https://api.cloudflare.com"
let account_path = "client/v4/accounts"
let namespace_path = "storage/kv/namespaces"


// Cloudflare API request vars
let url = ""
let method = ""
let headers = {}
let content_type = "application/json"
let axios_request = {}

// FOR NOW DNS IS THE KEY
// DNA IS THE VALUE
const do_cloudflare_update = async (kv_key, kv_value) => {
  console.log(kv_key + ":" + kv_value)
  // Setting axios url, method, and headers for request
  // javascript using backticks ` and string literals ${}
  url = `${base_url}/${account_path}/${account}/${namespace_path}/${namespace}/values/${kv_key}`
  method = "PUT"
  headers = {
    "X-Auth-Email": auth_email,
    "X-Auth-Key": auth_key,
    "Content-Type": content_type
  }
  axios_request = {
    url: url,
    method: method,
    headers: headers,
    data: kv_value
  }
  // console.log(axios_request)
  await do_axios_request()
}

const do_cloudflare_get = async (kv_key) => {
  console.log(`Getting data from KV Storef for ${kv_key}...`)
  url = `${base_url}/${account_path}/${account}/${namespace_path}/${namespace}/values/${kv_key}`
  method = "GET"
  headers = {
    "X-Auth-Email": auth_email,
    "X-Auth-Key": auth_key,
    "Content-Type": content_type
  }
  axios_request = {
    url: url,
    method: method,
    headers: headers,
  }
  // console.log(axios_request)
  return await do_axios_request()
}

const do_cloudflare_get_list = async () => {
  console.log("Getting list of Key from KV Store...")
  url = `${base_url}/${account_path}/${account}/${namespace_path}/${namespace}/keys`
  method = "GET"
  headers = {
    "X-Auth-Email": auth_email,
    "X-Auth-Key": auth_key,
    "Content-Type": content_type
  }
  axios_request = {
    url: url,
    method: method,
    headers: headers,
  }
  // console.log(axios_request)
  return await do_axios_request()
}

// function for making requests
const do_axios_request = async () => {
  try {
    const response = await axios(axios_request)
    const data = response.data
    // console.log(data)
    return data
  }
  catch (error) {
    console.log(error)
    return []
  }
}

module.exports = { do_cloudflare_update, do_cloudflare_get, do_cloudflare_get_list }
