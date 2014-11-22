var playerTable;
var matchTable;
var teamTable;
var objectId;
var competition;
var datetimepicker;

const nonstartStr = "未开始";
const doneStr = "已结束";

const firstTerm = "上学期";
const secondTerm = "下学期";


$(document).ready(function() {

    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "现在",
        suffix: [],
        meridiem: ["上午", "下午"]
    };

    datetimepicker = $('#datetimepicker').datetimepicker({
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: true,
        startView: 3,
        minuteStep: 15,

    });
    datetimepicker.datetimepicker('update', new Date());



    objectId = getUrlParam('objectId');
    console.log(objectId);

    playerTable = $('#playerTable').dataTable({
        "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sEmptyTable": "加载中。。。",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch": "搜索:",

        },
        "bPaginate": false,
    });

    matchTable = $('#matchTable').dataTable({
        "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sEmptyTable": "加载中。。。",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch": "搜索:",
            "aoColumns": [{
                sWidth: "50px"
            }, {
                sWidth: "100px"
            }, {
                sWidth: "100px"
            }, {
                sWidth: "100px"
            }, {
                sWidth: "50px"
            }, {
                sWidth: "50px"
            }, {
                sWidth: "50px"
            }, {
                sWidth: "50px"
            }, {
                sWidth: "100px"
            }, {
                sWidth: "300px"
            }]
        },
        "bPaginate": false,
    });

    teamTable = $('#teamTable').dataTable({
        "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sEmptyTable": "加载中。。。",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch": "搜索:",
        },
        // "aLengthMenu": [
        //     [10, 50, 100, -1],
        //     [10, 50, 100, "所有"]
        // ],
        "bPaginate": true,
    });

    getCompetitionByObjectId(objectId, function(data) {
        if (!data.competitionId) {
            window.location = "competition.html";
            return;
        }
        competition = data;
        getAllPlayers(competition.competitionId, addPlayersToTable);
        getAllPlayers(competition.competitionId, setupAtJs);
        getAllMatches(competition.competitionId, addMatchesToTable);
        getAllTeams(competition.competitionId, addTeamsToTable);
        getAllTeams(competition.competitionId, addTeamsToGroupTable);
    });

});


function setupAtJs(data) {

    var map = {};
    for (var i = 0; i < data.players.length; i++) {
        var player = data.players[i];
        player.pinyin = codefans_net_CC2PY(player.name);
        map[player.name] = player.pinyin;
    }

    var players = [];

    $.each(map, function(key, val) {
        var object = {
            playerName: key,
            name: val,
        }
        players.push(object);
    });


    $(".playerAtJs").atwho({
        at: "",
        tpl: '<li data-value="${playerName}">${playerName}</li>',
        data: players,
        limit: 10,
    });
}

function getTeamNameByTeamId(teamId, teams) {
    for (var i = 0; i < teams.length; i++) {
        var val = teams[i];
        if (val.teamId == teamId) {
            return val;
        }
    }
}

function addPlayersToTable(data) {
    $.each(data.players, function(index, val) {
        var team = getTeamNameByTeamId(val.teamId, data.teams);
        playerTable.fnAddData([competition.name, val.name, team.name, val.goalCount, val.yellowCard, val.redCard]);
    });
}

function addTeamsToTable(data) {
    $.each(data, function(index, val) {
        var groupNo = val.groupNo && val.groupNo != "" ? val.groupNo : "无";
        teamTable.fnAddData([val.name, val.groupWinCount, val.groupDrawCount, val.groupLostCount, val.groupGoalCount, val.groupMissCount, groupNo, val.score, val.winCount, val.lostCount, val.goalCount, val.missCount, val.rank]);
    });
}


function addTeamsToGroupTable(data) {

    data.sort(function(a, b) {
        var groupNoA = a.groupNo && a.groupNo != "" ? a.groupNo : "无";
        var groupNoB = b.groupNo && b.groupNo != "" ? b.groupNo : "无";
        if (groupNoA != groupNoB) {
            if (groupNoA < groupNoB) return -1;
            else return 1;
        } else {
            if (a.score > b.score) return -1;
            else if (a.score < b.score) return 1;
            else {
                var winLostCountA = a.groupGoalCount - a.groupMissCount;
                var winLostCountB = b.groupGoalCount - b.groupMissCount;
                if (winLostCountA > winLostCountB) return -1;
                else if (winLostCountA < winLostCountB) return 1;
                else {
                    if (a.groupGoalCount > b.groupGoalCount) return -1;
                    else return 1;
                }
            }
        }
    });

    var groupNo = null;
    $.each(data, function(index, val) {
        if (groupNo != val.groupNo) {
            groupNo = val.groupNo;
            $("#groupTeamTableBody").append('<tr class="info"><td>' + groupNo + '</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
        }
        var name = '<th>' + val.name + '</th>';
        var winCount = '<th>' + val.groupWinCount + '</th>';
        var drawCount = '<th>' + val.groupDrawCount + '</th>';
        var lostCount = '<th>' + val.groupLostCount + '</th>';
        var goalCount = '<th>' + val.groupGoalCount + '</th>';
        var missCount = '<th>' + val.groupMissCount + '</th>';
        var winMissCount = '<th>' + (val.groupGoalCount - val.groupMissCount) + '</th>';
        var score = '<th>' + val.score + '</th>';
        var element = '<tr>' + name + winCount + drawCount + lostCount + goalCount + missCount + winMissCount + score + '</tr>';
        $("#groupTeamTableBody").append(element);

    });
}

function addMatchesToTable(data) {
    $.each(data.matches, function(index, val) {
        var teamA = getTeamNameByTeamId(val.teamAId, data.teams);
        var teamB = getTeamNameByTeamId(val.teamBId, data.teams);
        var score = val.scoreA + ":" + val.scoreB;
        var penalty = val.penaltyA + ":" + val.penaltyB;

        var hint = "无";
        if (val.hint && val.hint != "") {
            hint = val.hint;
        }
        var referee = "无";
        if (val.referee && val.referee != "") {
            referee = val.referee;
        }

        var date = new Date(Date.parse(val.date.iso.substring(0, 19)));
        matchTable.fnAddData([competition.name, teamA.name, teamB.name, date.pattern("yyyy-MM-dd hh:mm:ss"), score, penalty, val.isStart, val.matchProperty, hint, referee]);
    });
}

function findPlayerInArray(name, players) {
    var player = null;
    for (var i = 0; i < players.length; i++) {
        player = players[i];
        if (name == player.name) return player;
    }


    player = {
        name: name,
        goalCount: 0,
        yellowCard: 0,
        redCard: 0,
    };
    players.push(player);
    return player;
}

//必须把相同球员的进球数等合并
function matchDetailSubmit() {
    if ($("#matchSubmit").hasClass('disabled')) return;
    var utcDate = new Date(datetimepicker.datetimepicker('getDate') - 8 * 60 * 60 * 1000);
    var date = utcDate.pattern("yyyy-MM-dd hh:mm:ss");
    var hint = $('#matchHint').val();
    var matchProperty = $("#matchProperty").find("option:selected").attr("value");
    var teamAName = $.trim($('#matchTeamAName').val());
    var teamBName = $.trim($('#matchTeamBName').val());
    var scoreA = parseInt($('#matchScoreA').val());
    var scoreB = parseInt($('#matchScoreB').val());
    if (!scoreA) scoreA = 0;
    if (!scoreB) scoreB = 0;

    var penaltyA = parseInt($('#matchPenaltyA').val());
    var penaltyB = parseInt($('#matchPenaltyB').val());
    //redCardAPlayers;

    if (!penaltyA) penaltyA = 0;
    if (!penaltyB) penaltyB = 0;

    if (teamAName == "") {
        alert("输入A队名字");
        return;
    } else if (teamBName == "") {
        alert("输入B队名字");
        return;
    }

    $("#matchSubmit").addClass('disabled');
    $("#matchSubmit").html("提交中...");


    var converDate = string2Date(date);
    var match = {};
    match.competitionId = competition.competitionId;
    match.teamAName = teamAName;
    match.teamBName = teamBName;
    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.penaltyA = penaltyA;
    match.penaltyB = penaltyB;
    match.date = date;
    match.matchProperty = matchProperty;
    match.hint = hint;
    match.referee = $("#matchReferee").val();

    var playersA = [];
    var playersB = [];


    //进球A
    var goalAPlayers = $("#goalAPlayers").val().split(" ");
    for (var i = 0; i < goalAPlayers.length; i++) {
        var playerName = $.trim(goalAPlayers[i]);
        if (playerName == "") continue;
        var player = findPlayerInArray(playerName, playersA);
        player.team = teamAName;
        player.goalCount += 1;
    }

    //进球B
    var goalBPlayers = $("#goalBPlayers").val().split(" ");
    for (var i = 0; i < goalBPlayers.length; i++) {
        var playerName = $.trim(goalBPlayers[i]);
        if (playerName == "") continue;
        var player = findPlayerInArray(playerName, playersB);
        player.team = teamBName;
        player.goalCount += 1;
    }

    var yellowCardAPlayers = $("#yellowCardAPlayers").val().split(" ");
    for (var i = 0; i < yellowCardAPlayers.length; i++) {
        var playerName = $.trim(yellowCardAPlayers[i]);
        if (playerName == "") continue;
        var player = findPlayerInArray(playerName, playersA);
        player.team = teamAName;
        player.yellowCard += 1;
    }

    var yellowCardBPlayers = $("#yellowCardBPlayers").val().split(" ");
    for (var i = 0; i < yellowCardBPlayers.length; i++) {
        var playerName = $.trim(yellowCardBPlayers[i]);
        if (playerName == "") continue;
        var player = findPlayerInArray(playerName, playersB);
        player.team = teamBName;
        player.yellowCard += 1;
    }

    //红牌
    var redCardAPlayers = $("#redCardAPlayers").val().split(" ");
    for (var i = 0; i < redCardAPlayers.length; i++) {
        var playerName = $.trim(redCardAPlayers[i]);
        if (playerName == "") continue;
        var player = findPlayerInArray(playerName, playersA);
        player.team = teamAName;
        player.redCard += 1;
    }

    var redCardBPlayers = $("#redCardBPlayers").val().split(" ");
    for (var i = 0; i < redCardBPlayers.length; i++) {
        var playerName = $.trim(redCardBPlayers[i]);
        if (playerName == "") continue;
        var player = findPlayerInArray(playerName, playersB);
        player.team = teamBName;
        player.redCard += 1;
    }



    var players = playersA.concat(playersB);
    var params = {
        match: match,
        players: players,
    };

    callCloudFunction("updateMatchAndPlayerData", params, function(results) {
        console.log(results);
        if (results.success == "success") {
            $('#submitFinishHint').bPopup();
            $('#submitFinishHintLabel').html("更新成功，请刷新网页更新数据");

            clearForm();
        } else {
            $('#submitFinishHint').bPopup();
            $('#submitFinishHintLabel').html("更新失败 " + results);
        }

        $("#matchSubmit").removeClass('disabled');
        $("#matchSubmit").html("提交");
    });
}

function clearForm() {
    $('#matchHint').val("");
    var matchProperty = $("#matchProperty").find("option:selected").attr("value");
    $('#matchTeamAName').val("");
    $('#matchTeamBName').val("");
    $('#matchScoreA').val("");
    $('#matchScoreB').val("");
    $('#matchPenaltyA').val("");
    $('#matchPenaltyB').val("");
    $("#goalAPlayers").val("");
    $("#goalBPlayers").val("");
    $("#yellowCardAPlayers").val("");
    $("#yellowCardBPlayers").val("");
    $("#redCardAPlayers").val("");
    $("#redCardBPlayers").val("");
    $("#matchReferee").val("");
}

/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
    可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
    Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
 */
Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours(), //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

///    var s = "2005-12-15  09:41:30";
function string2Date(formatString) {
    return new Date(Date.parse(formatString.replace(/-/g, "/")));
}