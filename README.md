# Realtime Private Messaging [Backend]

This Realtime Chat backend built using:
- nodejs 
- express
- socket.io and 
- mongodb

This backend service may not looks efficient and has unauthorized flow, but enough to illustrate the real-time private chat concept. <br/>
This service doesnt use full 100% socket protocol, but also some REST API. Here are some service that use socket and REST:

## Services using Socket
| No  | Event  | Description  |
|---|---|---|
| 1  |`notify typing`| give an indicator to friend if we are typing a message  | 
| 2  |`get online info`| get friend online info if youre in a chat room  |
| 3  |`notify online`| notify friend if you're just online in the chat room  | 
| 4  |`init chat`| initiate a chat from friend list  | 
| 5  |`join room`| joining a room so participants can emit listener to us  |  
| 6  |`leave room`|   |
| 7  |`send message`|   | 
| 8  |`read messages`|   |  
| 9  |`get active chats`|   | 
| 11  |`fetch messages`|   | 
| 12  |`active app`|   | 
| 13  |`background app`|   | 
