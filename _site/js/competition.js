var oTable;
var data

const nonstartStr = "未开始";
const startingStr = "进行中";
const doneStr = "已结束";

const firstTerm = "上学期";
const secondTerm = "下学期";

const typeBenbu = "本部"
const typeJiading = "嘉定"

$(document).ready(function() {

    oTable = $('#competitionTable').dataTable({
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

    getAllCompetition(addCompetitionsToTable);

    $("#newCompetitionButton").click(function() { 
        addCompetition()
    });
});

function clearForm() {
    $("form").find("input").val("");
    $("form").find("option").attr("selected", false);
    $("form").find("select").find("option:first")[0].selected = true;
    $("form").find("#competitionType").find("input:radio").get(0).checked = true;
}

function getCompetitionFromData(objectId) {
    var result = null
    $.each(data, function(index, val) {
        if (val.objectId == objectId) {
            result = val
            return val
        } 
    });

    return result
}

function showEdit(val) {
    clearForm()
    if (val != null) {
        $("#competetitionObjectId").val(val.objectId)
        $("#competitionName").val(val.name);
        $("#competitionNo").val(val.number)
        $("#competitionState").find('option:eq('+val.isStart+')')[0].selected = true;
        $("#competitionTimeYear").val(val.time.substring(0, val.time.length - 1));

        if (val.time[val.time.length - 1] == '1') {
            $("#competitionTimeTerm").find("option:first")[0].selected = true; 
        } 
        else {
            $("#competitionTimeTerm").find("option:eq(1)")[0].selected = true;
        }
        $("form").find("#competitionType").find("input:radio").get(val.type - 1).checked = true;
        $("#newCompetitionButton").html("更新");
    }      
    else{
        $("#newCompetitionButton").html("新建");
    }
    $("#createCompetitionModal").modal('show');
}

function deleteCompetition(objectId) {

    $.confirm({
        text: '删除后不可以恢复，删除后不可以恢复，删除后不可以恢复！！！',
        title: '重要的事情说三遍',
        confirmButton: '确定',
        cancelButton: '乖！我错了！',
        post: true,
        confirmButtonClass: "btn-danger",
        cancelButtonClass: "btn-primary",
        confirm: function () {
            callCloudFunction("deleteCompetition", {objectId: objectId}, function(result) {
                if (result != "error") {
                    reloadData()
                }
            })
        },
    })
}

function addCompetitionsToTable(competitions) {
    data = competitions
    $.each(data, function(index, val) {
        var isStart;
        if (val.isStart == 0) {
            isStart = nonstartStr;
        } 
        else if (val.isStart == 1) {
            isStart = startingStr;
        } 
        else isStart = doneStr;

        var type;
        if (val.type == 1) {
            type = typeBenbu;
        } 
        else type = typeJiading;

        var time = val.time.substring(0, val.time.length - 1);
        if (val.time[val.time.length - 1] == '1') {
            time += firstTerm;
        } 
        else time += secondTerm;

        var edit = "<a class='edit btn btn-primary' objectId='" + val.objectId + "'>更新</a>";
        var deleteItem = "<a class='delete btn btn-danger' objectId='" + val.objectId + "'>删除</a>";
        var detailItem = "<a class='showDetail btn btn-info' objectId='" + val.objectId + "'>详情</a>";

        oTable.fnAddData([val.name, val.number, isStart, time, type, edit, deleteItem, detailItem]);
    });

    oTable.find("a.edit").click(function(event) {
        var objectId = $(this).attr("objectId");
        var competetition = getCompetitionFromData(objectId) 
        showEdit(competetition)
    });

    oTable.find("a.delete").click(function(event) {
        var $objectId = $(this).attr('objectId');
        deleteCompetition($objectId)
    });

    oTable.find("a.showDetail").click(function(event) {
        var objectId = $(this).attr("objectId");
        window.location = "/player?objectId=" + data.objectId;
    });
}

function reloadData()   {
    oTable.fnClearTable()
    getAllCompetition(addCompetitionsToTable);
}

function addCompetition() {
    if ($("#newCompetitionButton").hasClass('disabled')) return;

    var objectId = $("#competetitionObjectId").val()
    var competitionName = $("#competitionName").val()
    var competitionNo = $("#competitionNo").val()
    var competitionTime = $("#competitionTimeYear").val()
    var competitionTerm = $("#competitionTimeTerm").val()
    var competitionState = $("#competitionState").val()
    var competitionType = $('input[name=competitionType]:checked', '#competitionType').attr("type")

    if (competitionName == "") {
        $("#createCompetitionModal").effect("shake", {times:2} , 500);
        $("#competitionName").focus();
        return 
    }

    if (competitionNo == "") {
        $("#createCompetitionModal").effect("shake", {times:2} , 500);
        $("#competitionNo").focus();
        return 
    }

    if (competitionTime == "") {
        $("#createCompetitionModal").effect("shake", {times:2} , 500);
        $("#competitionTimeYear").focus();
        return 
    }

    if (!parseInt(competitionNo)) {
        $("#createCompetitionModal").effect("shake", {times:2} , 500);
        $("#competitionNo").focus()
        return 
    }

    var params = {
        "objectId": objectId,
        "name": competitionName,
        "number": parseInt(competitionNo),
        "time": competitionTime + competitionTerm,
        "type": parseInt(competitionType),
        "isStart": parseInt(competitionState)
    }
    $("#newCompetitionButton").addClass('disabled')

    var title = $("#newCompetitionButton").html()
    $("#newCompetitionButton").html(title + "中")
    addOrUpdateCompetitionToCloud(params, function(data) {
        $("#newCompetitionButton").removeClass('disabled');
        $("#newCompetitionButton").html(title);

        if (data == "error") {
            alert(title + "失败，请稍后再试")
        }
        else {
            $( "#createCompetitionModal" ).modal('hide')
            reloadData()
        }
    })
    console.log(params)
}