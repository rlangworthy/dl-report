import React, { useEffect } from 'react';


export function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  const form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  const params: {[key: string]: string} = {'client_id': import.meta.env.VITE_CLIENT_ID,
                'redirect_uri': import.meta.env.VITE_REDIRECT_URI,
                'response_type': 'token',
                'scope': 'https://www.googleapis.com/auth/drive.file',
                'include_granted_scopes': 'true',
                'state': 'pass-through value'};

  // Add form parameters as hidden input values.
  for (const p in params) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  //FIXME make this actually open a new page? maybe it'll be fine once the rest of this logic is sorted out
  const newWindow = window.open("about:blank", "_blank");
  if (newWindow !== null){
    newWindow.document.body.appendChild(form)
  }

  form.submit();
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

      </div>
  )
}





