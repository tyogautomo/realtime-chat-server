# Realtime Private Messaging [Backend]

This Realtime Chat backend built using:
- nodejs 
- express
- socket.io and 
- mongodb

The client/ frontend repo refer to this link:
[Frontend Repository](https://github.com/tyogautomo/realtime-chat-client)

This backend service may not looks efficient and has unauthorized flow, but enough to illustrate the real-time private chat concept. <br/>
This service doesnt use full 100% socket protocol, but also some REST API. <br/>

## Usage
To run the app simply doing this step
1. Clone the repo
2. Install all depedencies using 
```
yarn
```
3. Run the app using
```
yarn start
```

<br/>

## Services
### Services using Socket
| No  | Event  | Description  |
|---|---|---|
| 1  |`notify typing`| give an indicator to friend if we are typing a message  |
| 2  |`get online info`| get friend online info if youre in a chat room  |
| 3  |`notify online`| notify friend if you're just online in the chat room  |
| 4  |`init chat`| initiate a chat from friend list  |
| 5  |`join room`| joining a room so participants can emit listener to us  |
| 6  |`leave room`| leaving a room, you cant get the emit event if youre already leave the room  |
| 7  |`send message`| send a message to server and broadcast it to the room in realtime |
| 8  |`read messages`| read all unread message in a room, so your friend can get the read receipt  |
| 9  |`get active chats`| get all the active rooms (joined rooms)  |
| 11  |`fetch messages`| fetch all messages according where the room you are  | 
| 12  |`active app`| give online information to all your friend  |
| 13  |`background app`| give offline information to all your friend  |

<br/>

### Services using REST API
| No  | Method | Endpoint  | Description  |
|---|---|---|---|
| 1  | POST |`/user/`| sign up a user  |
| 2  | POST |`/user/signin`| sign in a user, and give some payload to frontend  |
| 3  | GET |`/user/search?q=`| search some new friends to add  |
| 4  | GET |`/user/:userId`| get user data from persisted id in frontend  |