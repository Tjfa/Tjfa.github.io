var oTable
var data

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
    })

    getAllCompetition(addCompetitionsToTable)

    $("#newCompetitionButton").click(function() { 
        addCompetitionOrUpdate()
    })
})

function clearForm() {
    $("form").find("input").val("")
    $("form").find("option").attr("selected", false)
    $("form").find("select").find("option:first")[0].selected = true
    $("form").find("#competitionType").find("input:radio").get(0).checked = true
}

function getCompetitionFromData(objectId) {
    var result = null
    $.each(data, function(index, val) {
        if (val.id == objectId) {
            result = val
            return val
        } 
    })

    return result
}

function showEdit(val) {
    clearForm()
    if (val != null) {
        $("#competetitionObjectId").val(val.id)
        $("#competitionName").val(val.get("name"))
        $("#competitionNo").val(val.get("number"))
        $("#competitionState").find('option:eq('+val.get("isStart")+')')[0].selected = true

        year = val.get("time").substring(0, val.get("time").length - 1)
        $("#competitionTimeYear").val(year)
        if (val.get("time")[val.get("time").length - 1] == '1') {
            $("#competitionTimeTerm").find("option:first")[0].selected = true 
        } 
        else {
            $("#competitionTimeTerm").find("option:eq(1)")[0].selected = true
        }
        $("form").find("#competitionType").find("input:radio").get(val.get("type") - 1).checked = true
        $("#newCompetitionButton").html("更新")
    }      
    else{
        $("#newCompetitionButton").html("新建")
    }
    $("#createCompetitionModal").modal('show')
}


function getIsStartString(isStart) {
    switch ( isStart )
    {
        case 0:
            return "未开始"
        case 1:
            return "进行中"
        default:
            return "已结束"
    }
}

function getTypeString(type) {
    switch ( type )
    {
        case 1:
            return "本部"
        default:
            return "嘉定"
    }
}

function getTimeString(time) {
    var year = time.substring(0, time.length - 1)
    if (time[time.length - 1] == "1") {
        return year + "上学期"
    }
    else {
        return year + "下学期"
    }
}

function addCompetitionsToTable(competitions, error) {

    if (error) {
        alert(error);
        return 
    }

    data = competitions
    $.each(data, function(index, val) {
        var isStart = getIsStartString( val.get("isStart") )
        var type = getTypeString( val.get("type") )
        var time = getTimeString( val.get("time") )

        var edit = "<a class='edit btn btn-primary' objectId='" + val.id + "'>更新</a>"
        var deleteItem = "<a class='delete btn btn-danger' objectId='" + val.id + "'>删除</a>"
        var detailItem = "<a class='showDetail btn btn-info' objectId='" + val.id + "'>详情</a>"

        oTable.fnAddData([val.get("name"), val.get("number"), isStart, time, type, edit, deleteItem, detailItem])
    })

    oTable.find("a.edit").click(function(event) {
        var objectId = $(this).attr("objectId")
        var competetition = getCompetitionFromData(objectId) 
        showEdit(competetition)
    })

    oTable.find("a.delete").click(function(event) {
        var $objectId = $(this).attr('objectId')
        var competetition = getCompetitionFromData($objectId)
        $.confirm({
            text: '删除后不可以恢复，删除后不可以恢复，删除后不可以恢复！！！',
            title: '重要的事情说三遍',
            confirmButton: '确定',
            cancelButton: '乖！我错了！',
            post: true,
            confirmButtonClass: "btn-danger",
            cancelButtonClass: "btn-primary",
            confirm: function () {
                competition.destroy({
                    success: function(myObject) {   
                        console.log(myObject)
                    },  
                    error: function(myObject, error) {
                        alert("删除失败，请稍后再试")
                    },
                })
            },
        })
    })

    oTable.find("a.showDetail").click(function(event) {
        var objectId = $(this).attr("objectId")
        window.location = "/player?objectId=" + objectId
    })
}

function reloadData()   {
    oTable.fnClearTable()
    getAllCompetition(addCompetitionsToTable)
}

function addCompetitionOrUpdate() {
    if ($("#newCompetitionButton").hasClass('disabled')) return

    var objectId = $("#competetitionObjectId").val()
    var competitionName = $("#competitionName").val()
    var competitionNo = $("#competitionNo").val()
    var competitionTime = $("#competitionTimeYear").val()
    var competitionTerm = $("#competitionTimeTerm").val()
    var competitionState = $("#competitionState").val()
    var competitionType = $('input[name=competitionType]:checked', '#competitionType').attr("status")

    if (competitionName == "") {
        $("#createCompetitionModal").effect("shake", {times:2} , 500)
        $("#competitionName").focus()
        return 
    }

    if (competitionNo == "") {
        $("#createCompetitionModal").effect("shake", {times:2} , 500)
        $("#competitionNo").focus()
        return 
    }

    if (competitionTime == "") {
        $("#createCompetitionModal").effect("shake", {times:2} , 500)
        $("#competitionTimeYear").focus()
        return 
    }

    if (!parseInt(competitionNo)) {
        $("#createCompetitionModal").effect("shake", {times:2} , 500)
        $("#competitionNo").focus()
        return 
    }

    var title = $("#newCompetitionButton").html()
    $("#newCompetitionButton").html(title + "中")
    $("#newCompetitionButton").addClass('disabled')

    var competition = new Competition()
    competition.set("objectId", objectId)
    competition.set("name", competitionName)
    competition.set("number", parseInt(competitionNo))
    competition.set("time", competitionTime + competitionTerm)
    competition.set("type", parseInt(competitionType))
    competition.set("isStart", parseInt(competitionState))
    competition.save({
        success: function() {
            $("#newCompetitionButton").removeClass('disabled')
            $("#newCompetitionButton").html(title)
            $( "#createCompetitionModal" ).modal('hide')
            reloadData()
        },
        error: function(error) {
            $("#newCompetitionButton").removeClass('disabled')
            $("#newCompetitionButton").html(title)
            alert(title + "失败，请稍后再试!" + error)
        }
    })
}