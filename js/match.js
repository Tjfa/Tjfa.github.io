var matchTable
var competition
var teams

$(document).ready(function() {

    var objectId = getUrlParam('objectId')
    matchTable = $('#matchTable').dataTable({
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sEmptyTable": "加载中。。。",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch": "搜索:",
            "bAutoWidth": false,
            "aoColumns": [
            { "sWidth": 'null' },
            { "sWidth": 'null' },
            { "sWidth": '10%' },
            { "sWidth": '10%' },
            { "sWidth": '10%' },
            { "sWidth": '10%' },
            { "sWidth": '10%' },
            { "sWidth": '10%' },
            { "sWidth": '10%' },
            { "sWidth": '10%' }]
        },
        "bPaginate": false,
    })
    matchTable.fnDraw()

    getCompetitionByObjectId(objectId, function(data) {
        if (!data) {
            window.location = "/competition"
            return
        }
        competition = data

        getAllTeams(competition.get("competitionId"), function(data, error) {
            if (error) {
                alert(error)
                return
            }
            teams = data
            getAllMatches(competition.get("competitionId"), addMatchesToTable)

        })
    })
})

function addMatchesToTable(data, error) {

    if (error) {
        alert(error)
        return 
    }
    matches = data

    $.each(matches, function(index, val) {
        var teamA = findTeamInArray(val.get("teamAId"), teams)
        var teamB = findTeamInArray(val.get("teamBId"), teams)
        var score = val.get("scoreA") + ":" + val.get("scoreB")
        var penalty = val.get("penaltyA") + ":" + val.get("penaltyB")

        var hint = "无"
        if (val.get("hint") && val.get("hint") != "") {
            hint = val.get("hint")
        }
        var referee = "无"
        if (val.get("referee") && val.get("referee") != "") {
            referee = val.get("referee")
        }

        var date = val.get("date")
        matchTable.fnAddData([competition.get("name"), teamA.get("name"), teamB.get("name"), date.pattern("yyyy-MM-dd hh:mm:ss"), score, penalty, val.get("isStart"), val.get("matchProperty"), hint, referee])
    })
}
