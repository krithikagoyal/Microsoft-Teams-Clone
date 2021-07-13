# Microsoft-Engage-2021
This is a microsoft teams clone built under the microsoft engage program. This project aims at building a platform to act as a forum for a set of people to engage in focussed discussions through text and video chat.

# Features

|                            ||
| -------------------------- | :----------------:|
| Calender Invite            |         ✔️         |
| Chat Rooms                 |         ✔️         |
| Copy Link button           |         ✔️         |
| Pin button                 |         ✔️         |
| Authentication   |         ✔️         |
| Emojis in Chat  |         ✔️         |
| Switch on/off camera       |         ✔️         |
| Switch on/off Mic         |         ✔️         |

# How to run locally
Clone the master branch then run the following commands inside the project repository in the terminal:
```
npm i
yarn start
```
Open a new terminal, in the new terminal inside the project repository, run the following commands:
```
cd client
npm i
yarn start
```

# Directory Structure
```
Microsoft-Engage-2021
|
|-client
    |-public
        |
        |-index.html
    |-src
        |
        |-Authentication
            |
            |-components
                |
                |-ForgotPassword.js
                |-Login.js
                |-PrivateRoute.js
                |-Signup.js
            |-contexts
                |
                |-AuthContext.js
            |-firebase.js
        |-CreateRoom
            |
            |-ScheduleMeet
                |
                |-CalenderApi.js
                |-EventMessage.js
                |-ScheduleMeetForm.js
                |-TimeZoneSelect.js
            |-CreateRoom.js
        |-Room
            |
            |-Chat
                |
                |-Chat.js
                |-ChatRoom.js
                |-Navbar.js
                |-SendMessageForm.js
            |-Controls
                |
                |-Controls.js
            |-Home
                |
                |-Home.js
            |-Videos
                |-Videos.js
        |-App.js
        |-index.js
|-docs
|-server.js
```

# Latest Deployed version
The live link to the website can be found [here](https://krithikagoyalteams.herokuapp.com/).

# Video Demo
https://youtu.be/sBbfN7Yz3fI

# Documentation
https://docs.google.com/document/d/1X_uYif86FqyCMhYtfSmx_Dlk32Llk8XOz32ac2srz6U/edit?usp=sharing
