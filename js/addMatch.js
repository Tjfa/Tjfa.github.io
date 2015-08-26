var competition;
var datetimepicker;
var players


$(document).ready(function() {

    var objectId = getUrlParam('objectId');

    datetimepicker = $('#datetimepicker').datetimepicker({
        locale: 'zh-CN',
        defaultDate: new Date(),
        format: 'YYYY/MM/DD-HH:mm',
        stepping:15,
    });
    
    getCompetitionByObjectId(objectId, function(data, error) {
        if (!data) {
            window.location = "/competition";
            return;
        }
        competition = data;
        getAllPlayers(competition.get("competitionId"), setupAtJs);
    });

});


function setupAtJs(data, error) {

    if (error) {
        return
    }

    players = data
    var map = {};
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        map[player.get("name")] = codefans_net_CC2PY(player.get("name"));
    }

    var playersPinyin = [];

    $.each(map, function(key, val) {
        var object = {
            playerName: key,
            name: val,
        }
        playersPinyin.push(object);
    });


    $(".playerAtJs").atwho({
        at: "",
        tpl: '<li data-value="${playerName}">${playerName}</li>',
        data: playersPinyin,
        limit: 10,
    });
}

//必须把相同球员的进球数等合并
function matchDetailSubmit() {
    if ($("#matchSubmit").hasClass('disabled')) return;
    var utcDate = new Date($('#datetimepicker').data("DateTimePicker").date() - 8 * 60 * 60 * 1000);
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
    } 
    else if (teamBName == "") {
        alert("输入B队名字");
        return;
    }

    $("#matchSubmit").addClass('disabled');
    $("#matchSubmit").html("提交中...");


    var converDate = string2Date(date);
    var match = {};
    match.competitionId = competition.get("competitionId");
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
        } 
        else {
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


///    var s = "2005-12-15  09:41:30";
function string2Date(formatString) {
    return new Date(Date.parse(formatString.replace(/-/g, "/")));
}