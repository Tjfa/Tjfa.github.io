//debug
// const appKey = "v3cdupbp0fcv9b9712qvp45qb0efq6hy0iqttu3nvd80d6ts";
// const appId = "yyy2oocar74kh9kywwg4z9wdqzjelmjs9fsju5fm01r9mkdg";

// release
const appKey = "ks5u25gdqcm5laox6oj9gfq195p4ymfaytb9eix5fb6yq6nt";
const appId = "n2iby57nxdhh1cnqw27eocg6lkujbovtgvb7ezzjtb9wpqqf";

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

/*
 * 如果找不到这个player  就要去 创建一个player 注意创建的playerId
 */
function updatePlayer(name, goalCount, yellowCard, redCard, competitionId, teamId) {
    var whereJson = {
        name: name,
        competitionId: competitionId,
        teamId: teamId
    };
    var where = JSON.stringify(whereJson);
    $.ajax({
        url: 'https://leancloud.cn/1.1/classes/Player',
        type: 'get',
        headers: {
            "X-AVOSCloud-Application-Id": appId,
            "X-AVOSCloud-Application-Key": appKey,
        },
        data: {
            where: where,
            limit: 1
        },
        success: function(data) {
            console.log(data.results[0]);
        },
    });
}


function getCompetitionByObjectId(objectId, callback) {
    $.ajax({
        url: 'https://leancloud.cn/1.1/classes/Competition/' + objectId,
        type: 'get',
        headers: {
            "X-AVOSCloud-Application-Id": appId,
            "X-AVOSCloud-Application-Key": appKey,
        },
        success: function(data) {
            if (callback) {
                callback(data);
            }
        },
    });
}

function getAllCompetition(callback) {
    $.ajax({
        url: 'https://leancloud.cn/1.1/classes/Competition',
        type: 'get',
        headers: {
            "X-AVOSCloud-Application-Id": appId,
            "X-AVOSCloud-Application-Key": appKey,
        },
        data: {
            limit: 1000
        },
        success: function(data) {
            if (callback) {
                console.log(data.results);
                callback(data.results);
            }
        },
    });
}

function getAllTeams(competitionId, callback) {
    var whereJson = {
        competitionId: competitionId
    };
    var where = JSON.stringify(whereJson);
    $.ajax({
        url: 'https://leancloud.cn/1.1/classes/Team',
        type: 'get',
        headers: {
            "X-AVOSCloud-Application-Id": appId,
            "X-AVOSCloud-Application-Key": appKey,
        },
        data: {
            where: where,
            limit: 1000
        },
        success: function(data) {
            if (callback) {
                callback(data.results);
            }
        },
    });
}

function getAllPlayers(competitionId, callback) {
    var results = {};
    var whereJson = {
        competitionId: competitionId
    };
    var where = JSON.stringify(whereJson);

    getAllTeams(competitionId, function(teams) {
        results.teams = teams;
        $.ajax({
            url: 'https://leancloud.cn/1.1/classes/Player',
            type: 'get',
            headers: {
                "X-AVOSCloud-Application-Id": appId,
                "X-AVOSCloud-Application-Key": appKey,
            },
            data: {
                limit: 1000,
                where: where
            },
            success: function(data) {
                if (callback) {
                    results.players = data.results;
                    callback(results);
                }

            },
        });
    });
}

function getAllMatches(competitionId, callback) {
    var results = {};
    var whereJson = {
        competitionId: competitionId
    };
    var where = JSON.stringify(whereJson);

    getAllTeams(competitionId, function(teams) {
        results.teams = teams;
        $.ajax({
            url: 'https://leancloud.cn/1.1/classes/Match',
            type: 'get',
            headers: {
                "X-AVOSCloud-Application-Id": appId,
                "X-AVOSCloud-Application-Key": appKey,
            },
            data: {
                limit: 1000,
                where: where
            },
            success: function(data) {
                if (callback) {
                    results.matches = data.results;
                    console.log(results);
                    callback(results);
                }
            },
        });
    });
}

function getTeamByName(competitionId, teamName, callback) {
    var whereJson = {
        competitionId: competitionId,
        name: teamName,
    };
    var where = JSON.stringify(whereJson);
    $.ajax({
        url: 'https://leancloud.cn/1.1/classes/Player',
        type: 'get',
        headers: {
            "X-AVOSCloud-Application-Id": appId,
            "X-AVOSCloud-Application-Key": appKey,
        },
        data: {
            limit: 1,
            where: where
        },
        success: function(data) {
            if (callback) {
                results.players = data.results;
                console.log(results);
                callback(results);
            }

        },
    });
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
                console.log(data.result);
                callback(data.result);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
            if (callback) {
                callback("error");
            }
        }
    });
}

function addCompetitionToCloud(params, callback) {
    $.ajax({
        url: 'https://api.leancloud.cn/1.1/classes/Competition',
        type: 'post',
        headers: {
            "X-AVOSCloud-Application-Id": appId,
            "X-AVOSCloud-Application-Key": appKey,
            "Content-Type": "application/json",
        },
        data: JSON.stringify(params),
        success: function(data) {
            console.log(data)
            if (callback) {
                callback(data)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (callback) {
                callback("error")
            }
        }
    })
}