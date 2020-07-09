Dropzone.options.FormUploadFile = {
  maxFilesize: 10,
  acceptedFiles: "image/*",
  init: function () {
    this.on("completemultiple", function (files, response) {
      location.reload(true);
    });
  },
};
