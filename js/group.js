var competition
var teams


$(document).ready(function() {

    var objectId = getUrlParam('objectId')
    
    getCompetitionByObjectId(objectId, function(data) {
        if (!data) {
            window.location = "/competition"
            return
        }
        competition = data
        getAllTeams(competition.get("competitionId"), addTeamsToGroupTable)
    })

})

function addTeamsToGroupTable(data, error) {

    if (error) {
        alert(error);
        return 
    }

    data.sort(function(a, b) {
        var groupNoA = a.get("groupNo") && a.get("groupNo") != "" ? a.get("groupNo") : "无"
        var groupNoB = b.get("groupNo") && b.get("groupNo") != "" ? b.get("groupNo") : "无"
        if (groupNoA != groupNoB) {
            if (groupNoA < groupNoB) return -1
            else return 1
        } 
        else {
            if (a.get("score") > b.get("score") ) return -1
            else if (a.get("score") < b.get("score") ) return 1
            else {
                var winLostCountA = a.get("groupGoalCount") - a.get("groupMissCount")
                var winLostCountB = b.get("groupGoalCount") - b.get("groupMissCount")
                if (winLostCountA > winLostCountB) return -1
                else if (winLostCountA < winLostCountB) return 1
                else {
                    if (a.get("groupGoalCount") > b.get("groupGoalCount")) return -1
                    else return 1
                }
            }
        }
    })
    teams = data

    var groupNo = null
    $.each(teams, function(index, val) {
        if (groupNo != val.get("groupNo")) {
            groupNo = val.get("groupNo")
            $("#groupTeamTableBody").append('<tr class="info"><td>' + groupNo + '</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
        }
        var name = '<th>' + val.get("name") + '</th>'
        var winCount = '<th>' + val.get("groupWinCount") + '</th>'
        var drawCount = '<th>' + val.get("groupDrawCount") + '</th>'
        var lostCount = '<th>' + val.get("groupLostCount") + '</th>'
        var goalCount = '<th>' + val.get("groupGoalCount") + '</th>'
        var missCount = '<th>' + val.get("groupMissCount") + '</th>'
        var winMissCount = '<th>' + (val.get("groupGoalCount") - val.get("groupMissCount")) + '</th>'
        var score = '<th>' + val.get("score") + '</th>'
        var element = '<tr>' + name + winCount + drawCount + lostCount + goalCount + missCount + winMissCount + score + '</tr>'
        $("#groupTeamTableBody").append(element)

    })
}


