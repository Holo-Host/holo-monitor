// filesystem
import fs from "fs"
// http request lib
import axios from "axios"

// -------------------------------------------------------------------------
// FOR NOW this is one javascript file
// NEED to modularize it like this later
// -------------------------------------------------------------------------
// modularization test
// import from .mjs ES6 module file
// import myFunc from "./myfunc"
// use imported function
// myFunc()

// -------------------------------------------------------------------------
// the logic of this app
// 1. get data from valid data source (validate source???)
// 2. validate data
// 3. put valid data into cloudflare kv store
// -------------------------------------------------------------------------

// try/catch for error catching
try {
	// read file for keys
	let contents = fs.readFileSync("keys.json", "utf8")
	//console.log(contents)
	const KEYS = JSON.parse(contents)
	// console.log(KEYS)
	let account = KEYS.account
	let auth_email = KEYS.auth_email
	let auth_key = KEYS.auth_key
	let namespace = KEYS.namespace

	// vars for Cloudflare API urls
	let base_url = "https://api.cloudflare.com"
	let account_path = "client/v4/accounts"
	let namespace_path = "storage/kv/namespaces"

	// -------------------------------------------------------------------------
	// 1. get data
	// MOCKed for now
	// a. dns and dna pair
	// b. ip and dns pair
	let dns2dna = {
		data: [
			{
				"somedns":"somedna",
			},
			{
				"anotherdns":"anotherdna"
			}
		]
	}
	// console.log(dns2dna)
	// move to another script, run separately
	/*
	let ip2dna = {
		data: [
			{
				"someIP":"somedna"
			},
			{
				"anotherIP":"anotherdna"
			}
		]
	}
	// console.log(ip2dna)
	*/

	// -------------------------------------------------------------------------
	// 2. validate data
	// SKIPped for now

	// for later
	/*
	const validator = () => {
		return true
	}
	console.log(validator)
	*/

	// example of validator map for later
	/*
	let validation = item => {
		return item.isValid = true
	}
	let validated = dns2dna.data.map(validation)
	console.log(dns2dna.data)
	console.log(validated)
	*/

	// -------------------------------------------------------------------------
	// 3. PUT data
	//

	// test didUpdateAttrs
	// if these values end up anywhere they should be removed
	//let kv_key = "test_key"
	//let kv_value = "test_value"

	// -------------------------------------------------------------------------
	// Cloudflare API
	// -------------------------------------------------------------------------

	// Cloudflare API request vars
	let url = ""
	let method = ""
	let headers = {}
	let content_type = "application/json"
	let axios_request = {}

	// function for making requests
	const do_axios_request = async () => {
		try {
			const response = await axios(axios_request)
			const data = response.data
			console.log(data)
		}
		catch (error) {
			console.log(error)
		}
	}

	// FOR NOW DNS IS THE KEY
	// DNA IS THE VALUE
	const do_cloudflare_update = item => {
		// NEED TO ERROR CHECK HERE
		// THERE CAN ONLY BE ONE key/value PAIR per item

		// for each item set key and value
		// console.log(item)
		// ONLY ONE PAIR ALLOWED
		let kv_key = Object.keys(item)[0]
		let kv_value = item[kv_key]
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
		console.log(axios_request)
		do_axios_request()
	}
	dns2dna.data.map(do_cloudflare_update)

	// -------------------------------------------------------------------------

	// some more stuff
	/*
	let h_key = Object.keys(item)[0]
	let h_value = item[h_key]
	console.log(h_key + ":" + h_value)

	// Setting axios url, method, and headers for request
	// javascript using backticks ` and string literals ${}
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
		data: h_value
	}
	console.log(axios_request)
	do_axios_request()
	*/

} catch (err) {
	throw err
}


/*
LONG TERM goal is to get to something like this:
	await/async version with loaded ES6 modules and/or classes, too

*/
/*
class Actions
	async action1 (data) {
		return fs.action(data)
	}
	async action2 (data) {
		return fs.action(data)
	}
	....
}

try {
	await new Actions().action1()
	await new Actions().action1()
} catach(error) {
	return handlError(error)
}
 */
