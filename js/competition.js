var oTable;


const nonstartStr = "未开始";
const startingStr = "进行中";
const doneStr = "已结束";

const firstTerm = "上学期";
const secondTerm = "下学期";

const typeBenbu = "本部"
const typeJiading = "嘉定"

$(document).ready(function() {

    oTable = $('#competitionTable').dataTable({
        "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
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

});

function clearForm() {
    $("form").find("input").val("");
    $("form").find("select").find("option:first").attr("selected", true);
    $("form").find("#competitionType").find("input:radio").get(0).checked = true;
}

function showEdit($obj) {
    if (!$obj) {
        clearForm();
        $("#competitionId").val(0);
    } else {

        $("#competitionId").val($obj.find("td:eq(0)").html());
        $("#competitionName").val($obj.find("td:eq(1)").html());
        $("#competitionNo").val($obj.find("td:eq(2)").html());
        var state = $obj.find("td:eq(3)").html();
        if (state == nonstartStr) {
            $("#competitionState").find("option:first").attr("selected", true);
        } else if (state == startingStr) {
            $("#competitionState").find("option:eq(1)").attr("selected", true);
        } else {
            $("#competitionState").find("option:eq(2)").attr("selected", true);
        }

        var time = $obj.find("td:eq(4)").html();
        $("#competitionTimeYear").val(time.substring(0, 4));

        var term = time.substring(4);

        if (term == firstTerm) {
            $("#competitionTimeTerm").find("option:first").attr("selected", true);
        } else {
            $("#competitionTimeTerm").find("option:eq(1)").attr("selected", true);
        }

        var type = $obj.find("td:eq(5)").html();
        if (type == typeBenbu) {
            $("form").find("#competitionType").find("input:radio").get(0).checked = true;
        } else {
            $("form").find("#competitionType").find("input:radio").get(1).checked = true;
        }


    }

    $("#createCompetitionModal").modal('show');

}

function deleteCompetition() {

}


function addCompetitionsToTable(data) {
    $.each(data, function(index, val) {

        var isStart;
        if (val.isStart == 0) {
            isStart = nonstartStr;
        } else if (val.isStart == 1) {
            isStart = startingStr;
        } else isStart = doneStr;

        var type;
        if (val.type == 1) {
            type = typeBenbu;
        } else type = typeJiading;

        var time = val.time.substring(0, 4);
        if (val.time[4] == '1') {
            time += firstTerm;
        } else time += secondTerm;

        var detail = "<a class='btn btn-info' href='competitionDetail.php'>赛事信息</a>"
        var edit = "<a class='edit btn btn-primary'>编辑</a>";
        var deleteItem = "<a class='delete btn btn-danger'>删除</a>";
        var detailItem = "<a class='showDetail btn btn-info' objectId='" + val.objectId + "'>详情</a>";

        oTable.fnAddData([val.name, val.number, isStart, time, type, detail, edit, deleteItem, detailItem]);

    });


    oTable.find("a.edit").click(function(event) {
        $obj = $(this).parent().parent();
        showEdit($obj);
    });

    oTable.find("a.delete").click(function(event) {
        console.log($(this).parent().parent());
    });

    oTable.find("a.showDetail").click(function(event) {
        var objectId = $(this).attr("objectId");
        getCompetitionByObjectId(objectId, function(data) {
            window.location = "competitionDetail.html?objectId=" + data.objectId;
        });

    });
}