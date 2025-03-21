import React, { useEffect, useCallback, useState } from 'react';
import {useDropzone} from 'react-dropzone'
import Papa from 'papaparse'


//FIXME Add state for our files
function MyDropzone() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)

    })
    
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )
}

export function GoogleDownload() {

  useEffect(() => {
      handleClientLoad();
  }, []);


   // On load, called to load the auth2 library and API client library.

    function handleClientLoad() {
      window.gapi.load('client:auth2', initClient);
    }

   // Initializes the API client library and sets up sign-in state listeners.

    function initClient() {
      window.gapi.client.init({
        apiKey: import.meta.env.VITE_API_KEY,
        clientId: import.meta.env.VITE_CLIENT_ID,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        scope: "https://www.googleapis.com/auth/drive.file"
      }).then(function () {

        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      }, function(error) {
          console.log(error) // add something for error handling
      });
    }

    // Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
    
    function updateSigninStatus(isSignedIn: boolean) {
      const authorizeButton = document.getElementById('authorize_button');
      const signoutButton = document.getElementById('signout_button');
      const downloadButton = document.getElementById('download_button');
      if(authorizeButton && signoutButton && downloadButton){
          if (isSignedIn) {
            authorizeButton.style.display = "none";
            signoutButton.style.display = "block";
            downloadButton.style.display = "block";
          } else {
            authorizeButton.style.display = "block";
            signoutButton.style.display = "none";
            downloadButton.style.display = "none";
          }
        }
      }

    // Sign in the user upon button click.

    function handleAuthClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      event.preventDefault()
      window.gapi.auth2.getAuthInstance().signIn();
    }

    // Sign out the user upon button click.

    function handleSignoutClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      event.preventDefault()
      window.gapi.auth2.getAuthInstance().signOut();
    }




  return (
      <div>

          <button id="authorize_button"  onClick={handleAuthClick}  className="block googleauth">Authorize Google Login</button>

          <button id="signout_button"  onClick={handleSignoutClick} className="block googlesignout">Sign Out of Google</button>

          <button id="download_button" onClick={() => console.log('yay')} className="block google">Download Data to Google Sheets</button> 

          <MyDropzone/>

      </div>
  )
}





