    // File Upload
    const uploadFile = document.getElementById("upload_file");
    const uploadBtn = document.getElementById("upload-btn");
    const uploadSpace = document.getElementById("space");
    uploadBtn.addEventListener("click", function () {
      uploadFile.click();
    });
    uploadFile.addEventListener("change", function () {
      //  Format Selected File Text
      if (uploadFile.value) {
        uploadSpace.innerHTML =
          uploadFile.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1] + "🔥";
      } else {
        uploadSpace.innerHTML = "No File, Selected!😭";
      }
    
      // Image Preview
      const myfiles = uploadFile.files[0]; //files[0] - For getting first file
      //   console.log(files);
    
      if (myfiles) {
        // Showing Image and Hiding "Image Preview" Text
        preview_upimg.style.display = "block";
        preview_uptext.style.display = "none";
        //Read File
        const myfileReader = new FileReader();
    
        myfileReader.addEventListener("load", function () {
          // convert image to base64 encoded string
          preview_upimg.setAttribute("src", this.result);
          console.log(this.result);
        });
        myfileReader.readAsDataURL(myfiles);
      }
    });


// File Upload
const sideFile = document.getElementById("sideupload_file");
const sideBtn = document.getElementById("sideupload-btn");
const sideSpace = document.getElementById("sidespace");
sideBtn.addEventListener("click", function () {
  sideFile.click();
});
sideFile.addEventListener("change", function () {
  //  Format Selected File Text
  if (sideFile.value) {
    sideSpace.innerHTML =
      sideFile.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1] + "🔥";
  } else {
    sideSpace.innerHTML = "No File, Selected!😭";
  }

  // Image Preview
  const sidemyfiles = sideFile.files[0]; //files[0] - For getting first file
  //   console.log(files);

  if (sidemyfiles) {
    // Showing Image and Hiding "Image Preview" Text
    preview_sideimg.style.display = "block";
    preview_sidetext.style.display = "none";
    //Read File
    const sidemyfileReader = new FileReader();

    sidemyfileReader.addEventListener("load", function () {
      // convert image to base64 encoded string
      preview_sideimg.setAttribute("src", this.result);
      console.log(this.result);
    });
    sidemyfileReader.readAsDataURL(sidemyfiles);
  }
});

   