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
                    console.log(results);
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
        data: '{"match":{"competitionId":100,"teamAName":"测试A","teamBName":"测试B","scoreA":2,"scoreB":1,"penaltyA":0,"penaltyB":0,"date":"2014-10-24 03:16:14","matchProperty":0,"hint":""},"players":[{"name":"测试名字1","goalCount":2,"yellowCard":0,"redCard":10,"team":"测试"},{"name":"测试名字2","goalCount":2,"yellowCard":1,"redCard":0,"team":"测试"}]}',
        success: function(data) {
            if (callback) {
                console.log(results);
                callback(results);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });


}