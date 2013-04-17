<?php //Bismillah
?>
<head>
<title>File Upload Test</title>
<link rel="stylesheet" href="styles/jqueryui.css">
<link rel="stylesheet" href="styles/jquery.fileupload-ui.css">

<script src="http://buet73.asifrc.com/scripts/jquery.js"></script>
<script src="http://buet73.asifrc.com/scripts/jqueryui.js"></script>

</head>
<body>

<!-- The file upload form used as target for the file upload widget -->
    <form id="fileupload" action="//jquery-file-upload.appspot.com/" method="POST" enctype="multipart/form-data">
        <!-- Redirect browsers with JavaScript disabled to the origin page -->
        <noscript><input type="hidden" name="redirect" value="http://blueimp.github.com/jQuery-File-Upload/"></noscript>
        <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
        <div class="row fileupload-buttonbar">
            <div class="span7">
                <!-- The fileinput-button span is used to style the file input field as button -->
                <span id="btnup" class="btn btn-success fileinput-button">
                    <i class="icon-plus icon-white"></i>
                    <span>Upload Picture</span>
                    <input type="file" name="files[]" multiple>
                </span>
                <button type="button" class="mybut">
                    <span>Remove</span>
                </button>
            </div>
        </div>
        <!-- The loading indicator is shown during file processing -->
        <div class="fileupload-loading"></div>
        <br>
        <!-- The table listing the files available for upload/download -->
        <table role="presentation" class="table table-striped"><tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody></table>
    </form>

    
<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td class="preview"><span class="fade"></span></td>
        <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
        {% if (file.error) { %}
            <td class="error" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>
        {% } else if (o.files.valid && !i) { %}
            <td>
                <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div>
            </td>
            <td class="start">{% if (!o.options.autoUpload) { %}
                <button class="btn btn-primary">
                    <i class="icon-upload icon-white"></i>
                    <span>Save</span>
                </button>
            {% } %}</td>
        {% } else { %}
            <td colspan="2"></td>
        {% } %}
        <td class="cancel">{% if (!i) { %}
            <button class="btn btn-warning">
                <i class="icon-ban-circle icon-white"></i>
                <span>Cancel</span>
            </button>
        {% } %}</td>
    </tr>
{% } %}
</script>
<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">

</script>

<script src="scripts/tmpl.min.js"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="scripts/load-image.min.js"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<script src="scripts/canvas-to-blob.min.js"></script>
<!-- jQuery Image Gallery -->
<script src="scripts/jquery.image-gallery.min.js"></script>
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="scripts/jquery.iframe-transport.js"></script>
<!-- The basic File Upload plugin -->
<script src="scripts/jquery.fileupload.js"></script>
<!-- The File Upload file processing plugin -->
<script src="scripts/jquery.fileupload-fp.js"></script>
<!-- The File Upload user interface plugin -->
<script src="scripts/jquery.fileupload-ui.js"></script>
<!-- The File Upload jQuery UI plugin -->
<script src="scripts/jquery.fileupload-jui.js"></script>


<!-- The main application script -->
<script src="scripts/ppup01.js"></script>
</body>
