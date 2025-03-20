import {google} from 'googleapis'
import http from 'http'
import url from 'url'
import opn from 'open'
import destroyer from 'server-destroy'
type OAuth2Client = typeof google.prototype.auth.OAuth2.prototype;



// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
//const TOKEN_PATH = path.join(process.cwd(), 'token.json');
//const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');




const scopes = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to `/callback?code=<code>`
 */
/*
async function authenticate(scopes:string[]) {
    return new Promise((resolve, reject) => {
    const oauth2Client = new google.Auth.OAuth2Client(
        import.meta.env.VITE_CLIENT_ID,
        import.meta.env.VITE_CLIENT_SECRET,
        import.meta.env.VITE_REDIRECT_URI,
    )

      // grab the url that will be used for authorization
      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
      });
      const server = http
        .createServer(async (req, res) => {
          try {
            if (req && req.url && req.url.indexOf('/oauth2callback') > -1) {
              const qs = new url.URL(req.url, 'http://localhost:3000')
                .searchParams;
              res.end('Authentication successful! Please return to the console.');
              server.destroy();
              const {tokens} = await oauth2Client.getToken(qs.get('code') as string);
              oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
              resolve(oauth2Client);
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(3000, () => {
          // open the browser to the authorize url to start the workflow
          //window.open(authorizeUrl, '_blank')
          opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
        });
      destroyer(server);
    });
  }
*/

export function createGoogleSheet() {
    //insert logic to turn data into a sheet, formatting, all the good stuff
    const auth = 5//await authenticate(scopes)
    const service = google.sheets({version: 'v4', auth: auth as OAuth2Client})
    /*
    const service = google.sheets({version: 'v4', auth: auth as OAuth2Client})
        try {
            const spreadsheet = await service.spreadsheets.create();
            console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
            return spreadsheet.data.spreadsheetId;
        } catch (err) {
        // TODO (developer) - Handle exception
        throw err;

    }*/
}