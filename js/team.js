var teamTable;
var competition;
var source = null;

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
        if (!data) {
            window.location = "/competition";
            return;
        }
        competition = data;
        getAllTeams(competition.get("competitionId"), addTeamsToTable);
    });

    $("#imgInp").change(function(){
        readURL(this);
    });

});

function addTeamsToTable(data) {
    $.each(data, function(index, val) {
        var groupNo = val.groupNo && val.groupNo != "" ? val.groupNo : "无";
        teamTable.fnAddData([val.name, val.groupWinCount, val.groupDrawCount, val.groupLostCount, val.groupGoalCount, val.groupMissCount, groupNo, val.score, val.winCount, val.lostCount, val.goalCount, val.missCount, val.rank]);
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
            console.log(e.target)
            source = e
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function clearForum()
{
    source = null
}

function addTeamButtonClick() { 
    $("#createTeamModal").modal('show');
}

function newTeamButtonClick() {
    $('body').showLoading();
    var code = source.target.result.substring(23)
    uploadTeamBadge(code, null, "aa", 12083, 'image/png', function(data) {
        if (data) {
            console.log(data)
        }
        else {

        }
    })
}
