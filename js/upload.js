/*
 * Function upload files
 * Author: https://github.com/coligo-io/file-uploader/blob/master/public/javascripts/upload.js
 * Due to time constraints it was just much simpler to use an already made file upload.
 */
$('.uploadbtn').on('click', function (){
	console.log("we made it");
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      /* check to see if .csv is extension */
      if(file.name.length - file.name.indexOf(".csv") != 4){
    	  alert("file must be of type \".csv\"");
    	  return;
      }
      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
    	  alert("upload successful!");
          console.log('upload successful!\n data = %j', data.data);
          
          var obj = JSON.parse(data.data);
          var toDict = {};
          //convert the data into a dictionary object to match previous code
          for(var i = 0; i < obj.length; i ++ ){
        	  var newUser = obj[i];
        	  toDict[i] = new BasicUser(i, newUser.first_name, newUser.last_name, newUser.info, Date.now());
          }
          //need to clear orderedUsers or else the code 
          orderedUsers = [];
          users = toDict;
          setupSlotMachine(users);
          console.log("NEWUSERS %j", toDict);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});