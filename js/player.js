var playerTable
var competition
var teams
var players

$(document).ready(function() {

    var objectId = getUrlParam('objectId')

    playerTable = $('#playerTable').dataTable({
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sEmptyTable": "加载中。。。",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch": "搜索:",

        },
        "bPaginate": false,
    })

    getCompetitionByObjectId(objectId, function(data, error) {
        if (!data) {
            window.location = "/"
            return
        }
        competition = data
        getAllTeams(competition.get("competitionId"), function(data, error) {
            if (error) {
                alert(error)
                return 
            }
            else {
                teams = data
                getAllPlayers(competition.get("competitionId"), addPlayersToTable)
            }

        })       
    })

})

function addPlayersToTable(data, error) {

    if (error) {
        alert(error)
        return 
    }

    players = data
    $.each(players, function(index, val) {
        var team = findTeamInArray(val.get("teamId"), teams)
        if (team) {
            playerTable.fnAddData([competition.get("name"), val.get("name"), team.get("name"), val.get("goalCount"), val.get("yellowCard"), val.get("redCard")])
        }
    })
}