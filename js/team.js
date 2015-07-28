var teamTable;
var competition;

const nonstartStr = "未开始";
const doneStr = "已结束";

const firstTerm = "上学期";
const secondTerm = "下学期";


$(document).ready(function() {  
  
    var objectId = getUrlParam('objectId');

    teamTable = $('#teamTable').dataTable({
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
            window.location = "competition.html";
            return;
        }
        competition = data;
        getAllTeams(competition.competitionId, addTeamsToTable);
    });

});

function addTeamsToTable(data) {
    $.each(data, function(index, val) {
        var groupNo = val.groupNo && val.groupNo != "" ? val.groupNo : "无";
        teamTable.fnAddData([val.name, val.groupWinCount, val.groupDrawCount, val.groupLostCount, val.groupGoalCount, val.groupMissCount, groupNo, val.score, val.winCount, val.lostCount, val.goalCount, val.missCount, val.rank]);
    });
}

