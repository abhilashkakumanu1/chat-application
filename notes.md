## 2022-12-19

1. Send messages typed in FE to the server & broadcast them
2. Display messages typed by one user for everyone who connected
3. **Identify users** - username functionality - (imp)
4. show if someone is Typing...(interesting!) => emit an event whenever the active state of input box changes & toggle isActive inside the eventListener on server
5. Show list of online users - UI to see list of active users
6. Maintain a history of messages (Good to have) => DB? In-Memory array will do for now
7. serve the website from localhost to the world (multi users can connect without putting it on server) - for testing multi-chat support locally => very very cool thing
8. user login support to identify separate users - instead of taking each connection as a new user (ask him username) + chat anonymous => give cool random usernames like pink-unicorn etc (like how Google Docs does it)

## Ideas

1. From next app onwards
   1. create a plan - entity relationship diagram, class diagram, use cases diagrams
   2. divide work
   3. work parallel & review each other's code

## 2022-12-20

1. Problem faced not able to share frontend and backend environment variables - didn't realize until now due to webpack used to solve this react.
2. 