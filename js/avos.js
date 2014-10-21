const appKey="ks5u25gdqcm5laox6oj9gfq195p4ymfaytb9eix5fb6yq6nt";
const appId="n2iby57nxdhh1cnqw27eocg6lkujbovtgvb7ezzjtb9wpqqf";


/*
* 如果找不到这个player  就要去 创建一个player 注意创建的playerId
*/

function updatePlayer(name,goalCount,yellowCard,redCard,competitionId,teamId)
{
	var whereJson = {name:name,competitionId:competitionId,teamId:teamId};
	var where=JSON.stringify(whereJson);
	$.ajax({
	  	url: 'https://leancloud.cn/1.1/classes/Player',
	  	type: 'get',
	  	headers: {
	  			   "Content-Type": "text/plain; charset=utf-8",
	  			   "X-AVOSCloud-Application-Id": appId,
	  			   "X-AVOSCloud-Application-Key":appKey,
		},
		data: { where: where,
				limit:1},
	  	success: function(data) {
	     		console.log(data.results);
	  	},
	});
}


function getAllCompetition(callback)
{
	$.ajax({
	  	url: 'https://leancloud.cn/1.1/classes/Competition',
	  	type: 'get',
	  	headers: {
	  			   "Content-Type": "text/plain; charset=utf-8",
	  			   "X-AVOSCloud-Application-Id": appId,
	  			   "X-AVOSCloud-Application-Key":appKey,
		},
		data: { 
				limit:1000
		},
	  	success: function(data) {
	  		if (callback) {
	     		console.log(data.results);
	     		callback(data.results);
	     	}
	  	},
	});
}

function getAllTeams(callback)
{
	$.ajax({
	  	url: 'https://leancloud.cn/1.1/classes/Team',
	  	type: 'get',
	  	headers: {
	  			   "Content-Type": "text/plain; charset=utf-8",
	  			   "X-AVOSCloud-Application-Id": appId,
	  			   "X-AVOSCloud-Application-Key":appKey,
		},
		data: { 
				limit:1000
		},
	  	success: function(data) {
	     		if (callback) {
	     			callback(data.results);
	     		}
	     		
	  	},
	});
}

function getAllPlayers(callback)
{
	var results={};

	getAllTeams( function( teams ){
		results.teams=teams;
		$.ajax({
	  		url: 'https://leancloud.cn/1.1/classes/Player',
	  		type: 'get',
	  		headers: {
	  			   "Content-Type": "text/plain; charset=utf-8",
	  			   "X-AVOSCloud-Application-Id": appId,
	  			   "X-AVOSCloud-Application-Key":appKey,
			},
			data: { 
				limit:1000
			},
	  		success: function(data) {
	  			if (callback) {
	  				results.players=data.results;
	  				console.log(results);
	     			callback(results);
	  			}
	     		
	  		},
		});
	} );

	
}
