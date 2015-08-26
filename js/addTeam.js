$(document).ready(function() {  
    
    $("#imgInp").change(function(){
        readURL(this);
    });

})

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
            console.log(e.target)
            //uploadTeamBadge(e.target.result, null, "abc.png", 0, "png", null)
        }
        
        reader.readAsDataURL(input.files[0]);
        var avFile = new AV.File("name2", input.files[0]);
         avFile.save()
    }
}
