import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';
import config from '../config';

function CalenderApi() {

    // Client ID and API key from the Developer Console
    var CLIENT_ID = config.config[0].CLIENT_ID;
    var API_KEY = config.config[0].API_KEY;

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar";

    var authorizeButton;
    var signoutButton;

    /**
     *  On load, called to load the auth2 library and API client library.
     */

    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.defer = true;

        document.body.appendChild(script);

        authorizeButton = document.getElementById('authorize_button');
        signoutButton = document.getElementById('signout_button');
        handleClientLoad();

        return () => {
            document.body.removeChild(script);
        }
    }, [])

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        }, function (error) {
            appendPre(JSON.stringify(error, null, 2));
        });
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            authorizeButton.style.display = 'none';
            signoutButton.style.display = 'block';
            createEvent()
        } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
    }

    // Refer to the JavaScript quickstart on how to setup the environment:
    // https://developers.google.com/calendar/quickstart/js
    // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
    // stored credentials.
    function createEvent() {
        var event = {
            'summary': 'Engage testing',
            'location': '800 Howard St., San Francisco, CA 94103',
            'description': 'testing api for engage project.',
            'start': {
                'dateTime': '2021-07-2T09:00:00-07:00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': '2021-07-2T17:00:00-07:00',
                'timeZone': 'America/Los_Angeles'
            },
            'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=2'
            ],
            'attendees': [
                { 'email': 'tproject730@gmail.com' },
            ],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 }
                ]
            }
        };

        var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });

        request.execute(function (event) {
            appendPre('Event created: ' + event.htmlLink);
        });
    }

    return (
        <div>
            <button id="authorize_button" style={{ display: "none" }}>Authorize</button>
            <button id="signout_button" style={{ display: "none" }}>Sign Out</button>
            <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>
        </div>
    )
}

export default CalenderApi;
