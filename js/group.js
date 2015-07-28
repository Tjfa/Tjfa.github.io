var competition;

const nonstartStr = "未开始";
const doneStr = "已结束";

const firstTerm = "上学期";
const secondTerm = "下学期";


$(document).ready(function() {

    var objectId = getUrlParam('objectId');
    
    getCompetitionByObjectId(objectId, function(data) {
        if (!data.competitionId) {
            window.location = "competition.html";
            return;
        }
        competition = data;
        getAllTeams(competition.competitionId, addTeamsToGroupTable);
    });

});

function addTeamsToGroupTable(data) {

    data.sort(function(a, b) {
        var groupNoA = a.groupNo && a.groupNo != "" ? a.groupNo : "无";
        var groupNoB = b.groupNo && b.groupNo != "" ? b.groupNo : "无";
        if (groupNoA != groupNoB) {
            if (groupNoA < groupNoB) return -1;
            else return 1;
        } 
        else {
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


