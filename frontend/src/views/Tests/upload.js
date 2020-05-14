import React, { createRef } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import firebase from "@firebase/app";
import "@firebase/storage";
import axios from "axios";

import firebaseConfig from "firebase-config";
import "./styles.css";

firebase.initializeApp(firebaseConfig);

export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.extractFormData = this.extractFormData.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);

    this.imgPreviewImag = createRef();

    this.state = { files: [] };
  }

  storage = firebase.storage();

  extractFormData = function(form) {
    const formData = new FormData(document.querySelector(form));
    let values = {};

    for (var pair of formData.entries()) {
      if (values[pair[0]]) {
        if (!(values[pair[0]] instanceof Array)) {
          values[pair[0]] = new Array(values[pair[0]]);
        }
        values[pair[0]].push(pair[1]);
      } else {
        values[pair[0]] = pair[1];
      }
    }
    return values;
  };

  generatePreviewData = file => {
    const fr = new FileReader();
    return new Promise((resolve, reject) => {
      fr.addEventListener("load", e => {
        const img = document.createElement("img");
        img.src = fr.result;
        img.setAttribute("class", "border rounded img-preview");
        resolve(img);
      });
      fr.addEventListener("error", e => {
        reject();
      });
      fr.readAsDataURL(file);
    });
  };

  uploadImages = () => {
    for (var i = 0; i < this.state.files.length; i++) {
      var imageFile = this.state.files[i];
      this.uploadImageAsPromise(imageFile);
    }
  };

  uploadImageAsPromise = imageFile => {
    let storage = this.storage;
    return new Promise(function(resolve, reject) {
      var storageRef = firebase.storage().ref(`csa/${imageFile.name}`);
      //Upload file
      var task = storageRef.put(imageFile);

      //Update progress bar
      task.on(
        "state_changed",
        snapshot => {
          var percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // uploader.value = percentage;
        },
        error => {
          console.log(error);
        },
        () => {
          storage
            .ref("csa")
            .child(imageFile.name)
            .getDownloadURL()
            .then(url => {
              console.log(url);
            });
        }
      );
    });
  };

  // saveImage = function(file, filename, ref, callbacks) {
  //   if (!ref) ref = firebase.storage().ref();
  //   if (!callbacks) callbacks = {};
  //   if (mimes[file.type].extensions[0]) {
  //     callbacks.success = callbacks.success || console.log;
  //     callbacks.progress = callbacks.progress || console.log;
  //     callbacks.error = callbacks.error || console.error;

  //     // Create the file metadata
  //     var metadata = {
  //       contentType: file.type
  //     };

  //     // Upload file and metadata to the object
  //     var uploadTask = ref
  //       .child(filename + "." + mimes[file.type].extensions[0])
  //       .put(file, metadata);
  //     uploadTask.on(
  //       "state_changed",
  //       callbacks.progress,
  //       callbacks.error,
  //       callbacks.success
  //     );

  //     return uploadTask.then(function(snapshot) {
  //       return snapshot.ref.getDownloadURL();
  //     });
  //   }
  // };

  // sendData = (text, files) =>
  //   Promise.all(
  //     files.map(file =>
  //       this.saveImage(
  //         file,
  //         +new Date() + "_" + Math.random(),
  //         allImagesRef,
  //         progress
  //       )
  //     )
  //   ).then(values =>
  //     userImagesRef.child(user.uid).push({
  //       status: text,
  //       pictures: values,
  //       timestamp: +new Date()
  //     })
  //   );

  removeAllChildren = el => {
    while (el.childElementCount) {
      el.removeChild(el.children[0]);
    }
  };

  renderCollection = (collection, container) => {
    this.removeAllChildren(container);
    Promise.all(collection.map(this.generatePreviewData)).then(imgs =>
      imgs.map((img, i) => {
        img.setAttribute("index", i);
        img.addEventListener("click", e => {
          collection.splice(i, 1);
          this.renderCollection(collection, container);
        });
        container.appendChild(img);
      })
    );
  };

  onChangeFile(e) {
    let fileCollection = this.state.files;
    // while (fileCollection.length) {
    // //   fileCollection.pop();
    // }
    // [].slice.call(formData.pictures).map(f => fileCollection.push(f));
    Array.from(e.target.files).map(f => fileCollection.push(f));
    this.setState({ files: fileCollection });
    this.renderCollection(this.state.files, this.imgPreviewImag.current);
    console.log(this.state.files);
  }

  render() {
    return (
      <div>
        <center>
          <form action="" className="myForm" id="my-form">
            <div ref={this.imgPreviewImag} style={{ float: "left" }} />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="icon-button-file"
              multiple
              type="file"
              onChange={this.onChangeFile}
            />
            <label htmlFor="icon-button-file" component="span">
              <Button
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
                {this.state.files.length ? "Add Images" : "Upload Images"}
              </Button>
            </label>
          </form>
        </center>
        {this.state.files.length ? <Button
                color="primary"
                component="span"
                variant="contained"
                fullWidth
                onClick={this.uploadImages}
              >
                Upload all
              </Button> : null }
      </div>
    );
  }
}
