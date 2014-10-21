var oTable;

var teams;

const nonstartStr="未开始";
const doneStr="已结束";

const firstTerm="上学期";
const secondTerm="下学期";

$(document).ready(function(){

	oTable=$('#competitionTable').dataTable({
        "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sEmptyTable": "加载中。。。",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch":"搜索:",
        },
        "aLengthMenu": [ [10,50,100,-1], [10,50,100,"所有"] ],	
        "bPaginate": true,

    });

	getAllPlayers(addPlayersToTable);
});


function getTeamNameById(teamId,teams)
{
	for (var i=0; i<teams.length; i++) {
		var val = teams[i];
		if ( val.teamId == teamId ) {
		 	return val;
		 } 
	}
}

function addPlayersToTable(data)
{
	$.each(data.players, function(index, val) {
		var team=getTeamNameById(val.teamId,data.teams);
		oTable.fnAddData([val.name,val.competitionId,team.name,val.goalCount,val.yellowCard,val.redCard]);
	});
}
