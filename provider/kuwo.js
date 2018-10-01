const request = require('../request.js')

function search(songInfo){
	var url =
		'http://search.kuwo.cn/r.s?' +
		'ft=music&itemset=web_2013&client=kt&' +
		'rformat=json&encoding=utf8&' +
		'all=' + encodeURIComponent(songInfo.keyword) + '&pn=0&rn=20'

	return request('GET', url)
	.then(function(response){
		var jsonBody = JSON.parse(response.body.replace(/(\')/g, '"'))
		var chief = jsonBody['abslist'][0]
		if(chief)
			return chief.MUSICRID.split('_').pop()
		else
			return Promise.reject()
	})
}

function track(id){
	var url =
		'http://antiserver.kuwo.cn/anti.s?' +
		'type=convert_url&format=aac|mp3|wma&response=url&rid=MUSIC_' + id

	return request('GET', url)
	.then(function(response){
		if (response.body)
			return response.body
		else
			return Promise.reject()
	})
}

function check(songInfo){
	return search(songInfo)
	.then(function(songId){
		return track(songId)
	})
	.catch(function(e){
		return
	})
}

module.exports = {check}