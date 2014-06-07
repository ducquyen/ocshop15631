function addEventSimpleImageUpload(imageUploadId,imageUploadNum){

    new AjaxUpload(imageUploadId, {
        action: 'index.php?route=tool/simpleimgupload/upload&token='+token,
        name: 'image',
        autoSubmit: true,
        responseType: 'json',

        onChange: function(file, extension) {
            var product_id = $('#product_id').val()+"-"+imageUploadNum;
            $('#image'+imageUploadNum).attr('value','data/products/'+product_id+'.'+extension);
            this.setData({'directory': 'products','newFileName': product_id+'.'+extension});
            this.submit();
        },

        onSubmit: function(file, extension) {
            $('#upload').append('<img src="view/image/loading.gif" class="loading" style="padding-left: 5px;" />');
        },
        onComplete: function(file, json) {
            if (json.success) {
                $.ajax({
                    url: 'index.php?route=common/filemanager/image&token='+token+'&image=' + encodeURIComponent($('#image'+imageUploadNum).attr('value')),
                    dataType: 'text',
                    success: function(text) {
                        console.log(text);
                        $("#thumb"+imageUploadNum).attr("src",text);
                        //$('#thumb').replaceWith('<img src="' + text + '" alt="" id="thumb" />');
                    }
                });
            }
            if (json.error) {
                alert(json.error);
            }
        }
    });
}

$(document).ready(function() {
    if ($('#simple-image-upload').length){
        new AjaxUpload('simple-image-upload', {
            action: 'index.php?route=tool/simpleimgupload/upload&token='+token,
            name: 'image',
            autoSubmit: true,
            responseType: 'json',

            onChange: function(file, extension) {
                var product_id = $('#product_id').val();
                $('#image').attr('value','data/products/'+product_id+'.'+extension);
                this.setData({'directory': 'products','newFileName': product_id+'.'+extension});
                this.submit();
            },

            onSubmit: function(file, extension) {
                $('#upload').append('<img src="view/image/loading.gif" class="loading" style="padding-left: 5px;" />');
            },
            onComplete: function(file, json) {
                if (json.success) {
                    $.ajax({
                        url: 'index.php?route=common/filemanager/image&token='+token+'&image=' + encodeURIComponent($('#image').attr('value')),
                        dataType: 'text',
                        success: function(text) {
                            $('#thumb').replaceWith('<img src="' + text + '" alt="" id="thumb" />');
                        }
                    });
                }

                if (json.error) {
                    alert(json.error);
                }
            }
        });

    };

    $(".simple-image-upload").each(function(){
        addEventSimpleImageUpload($(this).attr("id"),$(this).data("image"));
    });

});
