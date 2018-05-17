# APB-auth-client
## JWT User authentication

APB-auth-client is a promise based user authentication package for javascript
clients, or frontends, using JWT and localStorage.

This package avoids the use of cookies and request headers which
are problematic when making cross-origin requests. ie. When the
client and the server (or frontend and backend) are on different
machines or ports. This package is designed to work with the
auth-server package which actually implements the JWT side of
things.

APB-auth-client uses Axios to handle ajax requests.


## Setup:
```
import { AuthClient } from './apb-auth-client/auth-client.js';
const auth = new AuthClient("http://127.0.0.1:3000");
```

## Login
```
auth.login('/login', this.state.uname, this.state.psw)
.then(function(data){
  console.log("login result:",data);
})
.catch(function (error) {
  console.log(error);
});
```

Use the login method to request a new token from the server and
automatically store it in localStorage to be used in future
authorized requests.

Returns a promise.  
Resolves with data on success.  
Rejects with error.

## Logout
```
auth.logout("/logout")
.then(function(data){
  console.log("logout result:",data);
})
.catch(function (error) {
  console.log(error);
});
```

User the logout method to request invalidation of the JWT token
by the server, and to overwrite the existing stored token.

Returns a promise.  
Resolves with confirmation message on success.  
Rejects with error.

## Authorized requests
```
auth.post("/secrets", {
  "show me secrets":"please"
})
.then(function (response) {
  console.log(response);
})
.catch(function (error) {
  console.log(error);
});
```


```
auth.get("/secrets")
.then(function (response) {
  console.log(response);
})
.catch(function (error) {
  console.log(error);
});
```

Make post / get requests using apb-auth-client to include the user
authentication token in every request automatically. If no token
is found the promise immediately rejects.

For post requests, include the data object as the second parameter.
Get requests should not contain a data object.

## Unauthorized requests
```
auth.post("/secrets", {
  "show me secrets":"please"
}, false)
.then(function (response) {
  console.log(response);
})
.catch(function (error) {
  console.log(error);
});
```

Make post / get requests with a third argument set to false to prevent
the inclusion of a token. This option just passes on the request to
Axios directly. Useful for creating accounts or doing other stuff
without authentication and without including Axios directly.

# Run Tests
Start by building the browser bundle:
> npm run-script build

Then open the test.html file in your favourite browser. 
