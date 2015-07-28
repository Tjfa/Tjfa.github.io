var matchTable;
var competition;

const nonstartStr = "未开始";
const doneStr = "已结束";

const firstTerm = "上学期";
const secondTerm = "下学期";


$(document).ready(function() {

    var objectId = getUrlParam('objectId');
    matchTable = $('#matchTable').dataTable({
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

    getCompetitionByObjectId(objectId, function(data) {
        if (!data.competitionId) {
            window.location = "competition.html";
            return;
        }
        competition = data;
        getAllMatches(competition.competitionId, addMatchesToTable);
    });

});

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
