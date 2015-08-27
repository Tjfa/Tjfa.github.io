var teamTable;
var competition;
var teams;

$(document).ready(function() {  
  
    var objectId = getUrlParam('objectId');

    teamTable = $('#teamTable').dataTable({
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sEmptyTable": "暂无球队",
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

    $("#teamBadge").change(function(){
        readURL(this);
    });

});

function addTeamsToTable(data, error) {

    if (error) {
        alert(error)
        return
    }

    teams = data

    $.each(data, function(index, val) {
        var groupNo = val.get("groupNo") && val.get("groupNo") != "" ? val.get("groupNo") : "无";
        teamTable.fnAddData([val.get("name"), val.get("groupWinCount"), val.get("groupDrawCount"), val.get("groupLostCount"), val.get("groupGoalCount"), val.get("groupMissCount"), groupNo, val.get("score"), val.get("winCount"), val.get("lostCount"), val.get("goalCount"), val.get("missCount"), val.get("rank")]);
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#teamBadgeImage').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function clearForum() {
    $("form").find("input").val("")
    $("form").find("select").find("option:first")[0].selected = true
    $("#teamBadgeImage").attr("src","/images/team_placeholder.png")
}


function reloadData()   {
    teamTable.fnClearTable()
    getAllTeams(competition.get("competitionId"), addTeamsToTable)
}


function addTeamButtonClick() { 
    $("#createTeamModal").modal('show')
}

function addOrUpdateTeam(team) {
    var teamName = $("#teamName").val()

    var teamGroup = $("#teamGroup").find("option:selected").text()
    if (teamGroup == "无") {
        teamGroup = ""
    }

    team.set("name", teamName)
    team.set("groupNo", teamGroup)
    team.set("competitionId", competition.get("competitionId"))
    team.save({
        success: function() {
            $('body').hideLoading()
            clearForum()
            $("#createTeamModal").modal('hide')  
            reloadData()
        },
        error: function(error) {
            $('body').hideLoading()
            console.log(error)
            alert(error)
        }
    })
}

function newTeamButtonClick() {

    var teamName = $("#teamName").val()
    if (teamName == null || teamName == "") {
        $("#createTeamModal").effect("shake", {times:2} , 500)
        $("#teamName").focus()
        return 
    }


    $('body').showLoading()

    var file = $("#teamBadge")[0].files[0]
    if (file) {
        var date = new Date()
        var name = competition.id + "_" + "_" + date + '_' + file.name;
        var avFile = new AV.File(name, file);
        avFile.save().then(function(fileObject) {
            console.log(fileObject)
            
            team = new Team()
            team.set("emblemPath", fileObject.url())
            addOrUpdateTeam(team)

        }), function(error) {
            alert(error)
            $('body').hideLoading()
            console.log(error)
            return 
        }
    }
    else {
        addOrUpdateTeam(new Team())
    }
}
