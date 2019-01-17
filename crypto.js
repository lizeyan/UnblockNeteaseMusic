'use strict'

const crypto = require('crypto')
const parse = require('url').parse
const eapiKey = 'e82ckenh8dichen8'
const linuxapiKey = 'rFgB&h#%2?^eDg:Q'

const decrypt = (buffer, key) => {
	let decipher = crypto.createDecipheriv('aes-128-ecb', key, '')
	return Buffer.concat([decipher.update(buffer), decipher.final()])
}

const encrypt = (buffer, key) => {
	let cipher = crypto.createCipheriv('aes-128-ecb', key, '')
	return Buffer.concat([cipher.update(buffer), cipher.final()])
}

module.exports = {
	eapi: {
		encrypt: buffer => encrypt(buffer, eapiKey),
		decrypt: buffer => decrypt(buffer, eapiKey),
		encryptRequest: (url, object) => {
			url = parse(url)
			let text = JSON.stringify(object)
			let message = `nobody${url.path}use${text}md5forencrypt`
			let digest = crypto.createHash('md5').update(message).digest('hex')
			let data = `${url.path}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
			return {
				url: url.href.replace(/\w*api/, 'eapi'),
				body: 'params=' + encrypt(Buffer.from(data), eapiKey).toString('hex').toUpperCase()
			}
		}
	},
	linuxapi: {
		encrypt: buffer => encrypt(buffer, linuxapiKey),
		decrypt: buffer => decrypt(buffer, linuxapiKey),
		encryptRequest: (url, object) => {
			url = parse(url)
			let text = JSON.stringify(Object.assign(object, {url: url.href}))
			return {
				url: url.resolve('/api/linux/forward'),
				body: 'eparams=' + encrypt(Buffer.from(text), linuxapiKey).toString('hex').toUpperCase()
			}
		}
	},
	base64: {
		encode: text => Buffer.from(text).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
		decode: text => Buffer.from(text.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('ascii')
	},
	md5: text => crypto.createHash('md5').update(text).digest('hex')
}