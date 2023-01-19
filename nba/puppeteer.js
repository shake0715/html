const request = require('request');
//const fs = require('fs');
var map = []
function getScoreboard(){
  return new Promise(done=>{
    request('https://tw.global.nba.com/stats2/team/schedule.json?countryCode=TW&locale=zh_TW&teamCode=warriors', (err, res, body)=>{
		var teams = JSON.parse(body)
		teams.payload.monthGroups.forEach(element => {
			element.games.forEach(score=>{
				map.push(score["teamScore"])
				map.push(score["oppTeamScore"])
			})
			
		});
		done(map)
	})
  })
}
getScoreboard().then(()=>{
	console.log(map)
})
/*getScoreboard().then(()=>{
	fs.writeFile("./test.txt",map.toString(),()=>{
		console.log("finish")
	})
	//console.log(map.toString());
	//module.exports = Score
})*/

module.exports = {getScoreboard,map}
