import React, { useEffect, useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone'
import Papa from 'papaparse'

import { 
  getFileType,
  FileTypes,
  RawStudentParaprofessionalMinutesRow,
  RawStudentSpecialEdInstructionRow 
} from './file-interfaces';

import {
  createDLScheduleDoc
} from './dl-scheduling-backend'

import {
  DLScheduleOutput
} from './dl-scheduling-constants'

import {
  createGoogleSheet
} from './create-sheet'


function MyDropzone({setAide, setSped}: {
  setAide: React.Dispatch<React.SetStateAction<null | RawStudentParaprofessionalMinutesRow[]>>,
  setSped: React.Dispatch<React.SetStateAction<null | RawStudentSpecialEdInstructionRow[]>>}) {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {

      Papa.parse(file, {
        header: true,
        complete: (results) => {
        const fileType = getFileType(results.meta.fields)
        console.log(fileType)
        if(fileType == FileTypes.AIDE_MINUTES){
          setAide(results.data as RawStudentParaprofessionalMinutesRow[])
        }
        if(fileType == FileTypes.TEACHER_MINUTES){
          setSped(results.data as RawStudentSpecialEdInstructionRow[])
        }
      }})

    })
    
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop teacher & aide minutes, or click to select files</p>
    </div>
  )
}

export function GoogleDownload() {

  const [sped, setSped] = useState<null | RawStudentSpecialEdInstructionRow[]>(null)
  const [aide, setAide] = useState<null | RawStudentParaprofessionalMinutesRow[]>(null)
  const [data, setData] = useState<DLScheduleOutput>({data: [], gradeCount: {}})

  useEffect(() => {
      handleClientLoad();
    }
  );

  useEffect(() => {
    const downloadButton = document.getElementById('download_button');
    
    if(sped && aide){
      setData(createDLScheduleDoc(sped, aide))
      if(downloadButton){
        downloadButton.style.display = "block";
      }
    }
  }, [sped, aide])


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
            signoutButton.style.display = "block"
          } else {
            authorizeButton.style.display = "block";
            signoutButton.style.display = "none";
            //downloadButton.style.display = "none";
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

    function handleDownloadClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      event.preventDefault()
      createGoogleSheet(data)
    }




  return (
      <div>

          <button id="authorize_button"  onClick={handleAuthClick}  className="block googleauth">Authorize Google Login</button>

          <button id="signout_button"  onClick={handleSignoutClick} className="block googlesignout">Sign Out of Google</button>

          <button id="download_button" onClick={handleDownloadClick} 
          className="block google" style={{display: 'none'}}>Download Data to Google Sheets</button> 

          <MyDropzone setAide={setAide} setSped={setSped}/>

      </div>
  )
}





