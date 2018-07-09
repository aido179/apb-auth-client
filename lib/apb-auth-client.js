const axios = require('axios');

class AuthClient {
  constructor(authServerURL, printLog = false){
    this.authServerURL = authServerURL;
    this.axiosInstance = axios.create({baseURL: this.authServerURL})
    this.printLog = printLog;
  }


  login(endpoint, username, password){
    this.log("AuthClient.login");
    return new Promise((resolve, reject)=>{
      this.axiosInstance({
        method: 'post',
        url: endpoint,
        data: {
          "username": username,
          "password": password
        },
        headers: { 'content-type': 'application/json' },
      })
      .then((response)=>{
        this.storeToken(response.data.token);
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
    });

  }

  logout(endpoint = ""){
    this.log("AuthClient.logout");

    return new Promise((resolve, reject)=>{
      if(endpoint === ""){
        localStorage.setItem("AuthClientJWTtoken", "Token Invalidated by AuthClient.logout");
        resolve("Logged out successfully [Locally, no endpoint provided]");
      }else{
        this.post(endpoint)
        .then(function (response) {
          localStorage.setItem("AuthClientJWTtoken", "Token Invalidated by AuthClient.logout");
          resolve("Logged out successfully [Server confirmed]");
        })
        .catch(function (error) {
          reject(error);
        });
      }
    });

  }

  storeToken(token){
    this.log("AuthClient.storeToken");
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("AuthClientJWTtoken", token);
    } else {
      throw new Error("AuthClient.storage: Browser does not support localStorage.");
    }
  }
  getToken(){
    this.log("AuthClient.getToken");
    if (typeof(Storage) !== "undefined") {
      return localStorage.getItem("AuthClientJWTtoken");
    } else {
      throw new Error("AuthClient.storage: Browser does not support localStorage.");
    }
  }

  put(endpoint, body, useToken=true){
    //insert the JWT token by default
    if(useToken){
      let token = this.getToken();
      if(token === null){
        return Promise.reject("No authorization token found.");
      }
      return this.axiosInstance.put(endpoint, {
        token: token,
        data: body
      });
    }else{
      //if useToken is false, just pass the post request on to axios
      return this.axiosInstance.put(endpoint, body);
    }

  }
  post(endpoint, body, useToken=true){
    //insert the JWT token by default
    if(useToken){
      let token = this.getToken();
      if(token === null){
        return Promise.reject("No authorization token found.");
      }
      return this.axiosInstance.post(endpoint, {
        token: token,
        data: body
      });
    }else{
      //if useToken is false, just pass the post request on to axios
      return this.axiosInstance.post(endpoint, body);
    }
  }
  postMultipart(endpoint, inputFormData, inputConfig, useToken=true){
    var config = Object.assign(inputConfig, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    //insert the JWT token by default
    // inputFormData must be a formData object
    if(useToken){
      let token = this.getToken();
      if(token === null){
        return Promise.reject("No authorization token found.");
      }
      // Ensure the token field is inserted at the start of the formData...
      // The only reliable way is to create a new FormData
      let outputFormData = new FormData()
      outputFormData.append('token', token)     //add the token first
      for (var key of inputFormData.keys()) {   //iterate over input to populate output
         outputFormData.append(key, inputFormData.get(key))
      }
      return this.axiosInstance.post(endpoint, outputFormData, config);
    }else{
      //if useToken is false, just pass the post request on to axios
      return this.axiosInstance.post(endpoint, body, config);
    }
  }
  get(endpoint, inputConfig={}, useToken=true){
    if(useToken){
      let token = this.getToken();
      if(token === null){
        return Promise.reject("No authorization token found.");
      }
      var config = inputConfig
      config.params = inputConfig.params || {}
      config.params.token = token
      return this.axiosInstance.get(endpoint, config)
    }else{
      //if useToken is false, just pass the request on to axios
      return this.axiosInstance.get(endpoint, config);
    }

  }
  delete(endpoint, inputConfig, useToken=true){
    if(useToken){
      let token = this.getToken();
      if(token === null){
        return Promise.reject("No authorization token found.");
      }
      var config = inputConfig
      config.params = inputConfig.params || {}
      config.params.token = token
      return this.axiosInstance.delete(endpoint, config)
    }else{
      //if useToken is false, just pass the request on to axios
      return this.axiosInstance.delete(endpoint, config);
    }

  }

  //toggleable logging
  log(message){
    if(this.printLog){
      console.log(message);
    }
  }
}

module.exports = AuthClient;
// Allow use of default import syntax in TypeScript
module.exports.default = AuthClient;
