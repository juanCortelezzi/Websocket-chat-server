# WebSocket server for chat application

This is the beginning of my websocket server with socket.io, express and
typescript

Websocket client at: [chat
client](https://github.com/juancortelezzi/websocket-chat-client)

## Docs (sort of...)

The whole logic of the project lives on the index.ts file, here we start an
Express server and a Socket.io server instance.

The Socket.io server instance, has available a CORS endpoint, which is set to my
client deployment when on production, or localhost:3000 at development.

Upon connection `io.on("connecion", () => {})`, we instantiate all the event
listeners for the client to call later on.

### User store

This class is basically our in memory database, which will store the users, as
long as they are using the chat.

The `UserStore` class, lives in the `userStore`.ts file. It contains all the
active users in an array, and has different methods to interact with them.

- `findUser`, which takes the `userID` and returns the user if exists
- `saveUser`, which takes the `user` and saves it if it did not exist before. 
- `deleteUser`, which takes the `userID` and deletes the user if existent
- `getRoomUsers`, which takes the `room` and returns an array of users in that
  room


### Events

#### Login

When a `login` event is triggered, the server receives the selected `name` and
`room` of the user (both strings) and a callback function to let the client know
if there were any errors at login, as parameters.

All parameters are passed through the corresponding `joi` schema validation to
ensure that the values are the expected. Should an error occur in the validation
process, the callback function would be sent to the client with said error
`return callback({ error: "__error to return here__", user: undefined });`

After validation, the server stores the `socket.id` along with the `name` and
`room` to create a user object in the `UserStore` class.

Finally, we join the user/socket to the requested room, notify all the users in
the room, besides the user/socket, that a new user is joining, with the
`notification` event. We send to all the room users, the updated array of room
users, with the `users`event, and we return the callback function with no errors
to indicate the client that the have successfully logged in.

#### Logout

When a `logout` event is triggered, the server receives a callback as a
parameter to make the client know the have logged out successfully. First we remove the user from the `UserStore`, we
remove the user/socket from the room, and we notify the remaining room users,
that this user is gone, with the `notification` event. Finally we send the
updated user list with the `users` event, and call the callback function to let
the client know that all went good.

#### Room message
When the `roomMessage` event is triggered, the server receives the encrypted
message from the client, gets the user data from the
`UserStore.findUser(userid)` call, and sends the message to the user's room,
with the `roomMessage` event.

#### Ping
Mostly for debugging purposes, but it returns the socket's id and runs the
callback function, which in the client, it will tell the amount of ping between
the client and the server.
