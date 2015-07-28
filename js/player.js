var playerTable;
var competition;

const nonstartStr = "未开始";
const doneStr = "已结束";

const firstTerm = "上学期";
const secondTerm = "下学期";


$(document).ready(function() {

    var objectId = getUrlParam('objectId');

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
    });

    getCompetitionByObjectId(objectId, function(data) {
        if (!data.competitionId) {
            window.location = "/";
            return;
        }
        competition = data;
        getAllPlayers(competition.competitionId, addPlayersToTable);
    });

});

function addPlayersToTable(data) {
    $.each(data.players, function(index, val) {
        var team = getTeamNameByTeamId(val.teamId, data.teams);
        playerTable.fnAddData([competition.name, val.name, team.name, val.goalCount, val.yellowCard, val.redCard]);
    });
}