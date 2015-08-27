// //debug
// const appKey = "v3cdupbp0fcv9b9712qvp45qb0efq6hy0iqttu3nvd80d6ts"
// const appId = "yyy2oocar74kh9kywwg4z9wdqzjelmjs9fsju5fm01r9mkdg"

release
const appKey = "ks5u25gdqcm5laox6oj9gfq195p4ymfaytb9eix5fb6yq6nt"
const appId = "n2iby57nxdhh1cnqw27eocg6lkujbovtgvb7ezzjtb9wpqqf"


var Competition
var Match
var Player
var Team
var User


function avInitialize() {
    AV.initialize(appId, appKey)
    Competition = AV.Object.extend("Competition")
    Match = AV.Object.extend("Match")
    Player = AV.Object.extend("Player")
    Team = AV.Object.extend("Team")
    User = AV.Object.extend("_User")
}

$(document).ready(function() {
    avInitialize()
})

function getCompetitionByObjectId(objectId, callback) {
    var query = new AV.Query(Competition)
    query.get(objectId, {
        success: function(competition) {
            if (callback) {
                callback(competition, null)
            }
        },
        error: function(object, error) {
            console.log(error)
            if (callback) {
                callback(null, error)
            }
        }
    }) 
}

function getAllCompetition(callback) {
    var query = new AV.Query(Competition)
    query.limit(1000)
    query.find({
        success: function(competitions) {
            if (callback) {
                callback(competitions, null)
            }
        },
        error: function(error) {
            if (callback) {
                callback(null, error)
            }
        }
    })
 }

function getAllTeams(competitionId, callback) {
    var query = new AV.Query(Team)
    query.limit(1000)
    query.equalTo("competitionId", competitionId);
    query.find({
        success: function(teams) {
            if (callback) {
                callback(teams, null)
            }
        },
        error: function(error) {
            if (callback) {
                callback(null, error)
            }
        }
    })
}

function getAllPlayers(competitionId, callback) {
    var query = new AV.Query(Player)
    query.limit(1000)
    query.equalTo("competitionId", competitionId);
    query.find({
        success: function(players) {
            if (callback) {
                callback(players, null)
            }
        },
        error: function(error) {
            if (callback) {
                callback(null, error)
            }
        }
    })
}

function getAllMatches(competitionId, callback) {
    var query = new AV.Query(Match)
    query.limit(1000)
    query.equalTo("competitionId", competitionId);
    query.find({
        success: function(matches) {
            if (callback) {
                callback(matches, null)
            }
        },
        error: function(error) {
            if (callback) {
                callback(null, error)
            }
        }
    })
}

function callCloudFunction(functionName, params, callback) {
    $.ajax({
        url: 'https://leancloud.cn/1.1/functions/' + functionName,
        type: 'post',
        headers: {
            "X-AVOSCloud-Application-Id": appId,
            "X-AVOSCloud-Application-Key": appKey,
            "Content-Type": "application/json",
        },
        data: JSON.stringify(params),
        success: function(data) {
            if (callback) {
                console.log(data.result)
                callback(data.result)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus)
            if (callback) {
                callback("error")
            }
        }
    })
}