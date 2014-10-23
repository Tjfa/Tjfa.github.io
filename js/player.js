var playerTable;
var matchTable;
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
        "aLengthMenu": [
            [120, 50, 100, -1],
            [10, 50, 100, "所有"]
        ],
        "bPaginate": true,
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
        },
        "aLengthMenu": [
            [10, 50, 100, -1],
            [10, 50, 100, "所有"]
        ],
        "bPaginate": true,
    });


    getCompetitionByObjectId(objectId, function(data) {
        if (!data.competitionId) {
            window.location = "competition.html";
            return;
        }
        competition = data;
        getAllPlayers(competition.competitionId, addPlayersToTable);
        getAllMatches(competition.competitionId, addMatchesToTable);
    });
});


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
        playerTable.fnAddData([val.name, competition.name, team.name, val.goalCount, val.yellowCard, val.redCard]);
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

        matchTable.fnAddData([competition.name, teamA.name, teamB.name, val.date.iso.substring(0, 19), score, penalty, val.isStart, val.matchProperty, hint]);
    });
}

function matchDetailSubmit() {

    var date = datetimepicker.datetimepicker('getDate');
    var hint = $('#matchHint').val();
    var teamAName = $('#matchTeamAName').val();
    var teamBName = $('#matchTeamBName').val();
    var scoreA = parseInt($('#matchScoreA').val());
    var scoreB = parseInt($('#matchScoreB').val());
    if (!scoreA) scoreA = 0;
    if (!scoreB) scoreB = 0;

    var penaltyA = parseInt($('#matchPenaltyA').val());
    var penaltyB = parseInt($('#matchPenaltyB').val());

    if (!penaltyA) penaltyA = 0;
    if (!penaltyB) penaltyB = 0;

    var goalAName = $('#matchTeamAScoreName').val();


    var match = {};
    match.competitionId = competition.competitionId;
    match.teamAName = teamAName;
    match.teamBName = teamBName;
    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.penaltyA = penaltyA;
    match.penaltyB = penaltyB;

    var players = [];
    player = {
        name: "测试名字",
        goalCount: 2,
        yellowCard: 0,
        redCard: 10,
    };
    players.push(player);

    var params = {
        match: match,
        players: players,
    };

    console.log(params);

}