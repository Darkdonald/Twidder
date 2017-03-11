/**
 * Created by Jonas Brückner & Maximilian Gerst on 19.01.17.
 */

var websocket=null;






//Sign in function
signIn = function () {

    //Get the data of the user for login
    var email = document.getElementsByName("emailIn")["0"].value.toString();
    var pass = document.getElementsByName("psw")["0"].value.toString();

    //check: correct email format and correct password format
    if (correct_Email(email) && correct_PW(pass)){
        //Use the signIn() function of the server and save the return in a variable

        var signInStr = "email="+email + "&password="+pass; //create String for SignIn
        var input = sendToServer("/SignIn",signInStr); //Send SignIn Post-method to server and store return data

        //check: successful login
        if (input.success === true){ //check if one can get the information with .sucess
            //token created, Profile View will further show
            localStorage.setItem('token',input.data);

            if("WebSocket" in window){
                websocket = new WebSocket('ws://' + document.domain + ":5000/api/");

                console.log("client.js/SignIn: Websocket open" + websocket);


                // When the connection is open, send some data to the server
                websocket.onopen = function () {
                        websocket.send(localStorage.getItem("token")); // Send the token to the server
                        console.log("client.js, websocket.onopen: send token to server.py");
                };

                console.log("token created, Profile View is going to be shown further on");

                viewScreen();
                return true;

            }else {
                console.log("token not created, Websocket is not supported");
                error("WebSoket is not supported by your browser!", "errorWelcome");
                return false;
            }

        }else{
            //token not created, Welcome View will further show
            error("Wrong passwort or wrong username!", "errorWelcome");
            console.log("token not created, Welcome View is going to be shown further on");
            return false;
        }
    }else{
        //input is not correct
        error("Wrong passwort or wrong username!", "errorWelcome");
        return false;
    }
};

//function for logging out
logout = function (){

    var logoutStr = "token="+getToken();

    //use function of the server
    sendToServer("/SignOut",logoutStr);
    localStorage.removeItem("token");
    websocket.close();
    viewScreen();

    //Close Weboscket connenction
    //websocket = null;
    console.log("client.js/WbSocket closed");

    return true;
};









//show the current view
window.onload = function(){
    viewScreen();
    //document.getElementById("errorDiv").style.display = "none";
};

//choose the used view with existence of token
viewScreen = function () {

    //check: token
    if (getToken()){
        //show Profile View
        displayViewProfile();
        get_message('my_messages','false');
    }
    else {
        //show Welcome View
        welcomeView();
    }
};

//display the Welcome View
welcomeView = function() {

    //Welcome Screen, No token
    //Get the content to display
    var elemWelcome = document.getElementById("welcomeview");

    //Find the target element where you'll display
    var target = document.body;

    //Put it there
    target.innerHTML = elemWelcome.innerHTML;
    document.getElementById("errorWelcome").style.display = "none";
};

//display the Profile View
displayViewProfile = function () {

    //Profile View, token exists
    //Get the content to display
    var elemProfile = document.getElementById("profileview");

    //Find the target element where you'll display
    var target = document.body;

    //Put it there
    target.innerHTML = elemProfile.innerHTML;

    //show the Home page when page is refreshed
    hide(home_ref);
    //Show Message Wall when page is refreshed

};


//Sign up function
signUp = function () {

    //Get the data of the user for Sign up
    var email = document.getElementsByName("EM")["0"].value.toString();
    var pass = document.getElementsByName("psw_new")["0"].value.toString();
    var fn = document.getElementsByName("unameReg")["0"].value.toString();
    var famnam = document.getElementsByName("FN")["0"].value.toString();
    var g = document.getElementsByName("Gen")["0"].value.toString();
    var ci = document.getElementsByName("City")["0"].value.toString();
    var co = document.getElementsByName("Cou")["0"].value.toString();
    var psw2 = document.getElementsByName("psw_rep")["0"].value.toString();

    //create string to give it to signUp function on server
    var user = "email="+email + "&password="+pass + "&firstname="+fn +"&familyname="+famnam + "&gender="+g + "&city="+ci +"&country="+co;

    //check: correct email, password, first name, family name, city, country format and password is equal to repeat password
    if(correct_FirstName(fn) == true && correct_FamilyName(famnam) == true && correct_City(ci) == true && correct_Country(co)== true && correct_Email(email) == true && correct_PW(pass) == true  &&  samePW(pass, psw2) == true){
        //Use the signUp() function of the server and save the return in a variable
        var inputAll = sendToServer("/SignUp",user);
        //check: successful registration
        if (inputAll["success"] == true){

            //login after creating a new user
            var signInStr = "email="+email + "&password="+pass;

            var input = sendToServer("/SignIn",signInStr);

            localStorage.setItem('token',input.data);
            viewScreen();

           return true;
        }else {
            //user already in system
            error("User is already existing", "errorWelcome");
            return false;
        }
    }else{
        //wrong input
        console.log("Wrong Input in SignUp");
        return false;
    }
};

//function for getting the current user token
getToken = function () {

    //check: currently user is logging in
    if (localStorage.getItem("token") !== null) {


        //get the token of localStorage
        var tok = localStorage.getItem("token")
        return tok;

    }else{
        console.log("Problems with getting a token from the server.");
        return false;
    }
};

//get User informations, either by token [email="false", myWall] or by email
getUserData = function (token,email) {

    var getUserDataTStr ="token="+ token.toString();

    if (email == "false") {
        //Get user Data by Token, if no email is submitted
        var input1 = sendToServer("/GetUDatabyT",getUserDataTStr);
        return input1; //"success": True, "message": "User data found.", "data": get_user(token)[list] ([firstName, familyName, gender, city, country, emailU, psw, token])

    } else {
        //Get user data by Email
        var getUserDataEStr = "email="+email + "&token="+token;
        var input2 = sendToServer("/GetUDatabyE",getUserDataEStr.toString());
        return input2; //"success": True, "message": "User data found.", "data": dh.get_user_email(recemail)[list] ([firstName, familyName, gender, city, country, emailU, psw, token])
    }
};


//get Messages of User, either by token [email="false", myWall] or by email
getUserMessages = function (token,email) {

    if (email == 'false') { //If email is false, use GetMessageByToken --> MyMessages
        //Get user Message by Token, if no email is submitted
        var tokenStr = "token="+getToken();

        var mArrayT = sendToServer("/GetUMesbyT",tokenStr.toString());
        return mArrayT; //contains List with 2D Array for messages; "data": dh.get_messages_by_token(token), "success": True, "message": "Messages received."

    } else {
        //Get user message by Email
        var uMesByE = "token="+getToken() + "&email="+email;
        var mArrayE = sendToServer("/GetUMesbyE",uMesByE.toString());
        return mArrayE; //contains List with 2D Array for messages; "data": dh.get_messages_by_token(token), "success": True, "message": "Messages received."
    }
};

//function for posting messages
postmessage = function (contentName, toEmail, errorId){
     if(document.getElementsByName(contentName)["0"].value !== ""){ //check if message is empty

         var contentInBlack = document.getElementsByName(contentName)["0"].value//.fontcolor("black"); //To make message seen, because of [Object object] error
         var postMesStr = "token="+getToken() + "&message="+contentInBlack + "&toemail="+toEmail;
         sendToServer("/POSTMes",postMesStr); //post message

         return true;
     }

     else{
         error("Empty Message!", errorId); //show error message if posted message is empty
         return false;
     }
};

//function for getting a message and post it on the wall
get_message = function (id_wall,email) {

    //check if user exists
    if (getUserData(getToken(), document.getElementsByName("smail")["0"].value)["success"] === false && id_wall !== 'my_messages'){

        document.getElementById(id_wall).innerHTML = "Not in System!".fontcolor("red");
        error("User is not existing", "errorBrowse");

        document.getElementById("informationOther").style.display = "none";
        document.getElementById("wallOther").style.display = "none";

    }else{ //user exists
        var wall="";

        for(var i=0; i<getUserMessages(getToken(),email)['data'].length; i++)
            {
                var newPost = getUserMessages(getToken(),email)['data'][i.toString()]['Writer'] + ": " .concat(getUserMessages(getToken(),email)['data'][i.toString()]['Message']) + "\<br>";
                wall = wall + newPost;

            }
        document.getElementById(id_wall).innerHTML = wall;
    }
};

//function for getting user information
getUserInformation = function () {

    //check: email in system
    if(getUserData(getToken(), document.getElementsByName("smail")["0"].value)["success"] === true) {

        document.getElementById("informationOther").style.display = "block";
        document.getElementById("wallOther").style.display = "block";

        //information of other user
        document.getElementById("firstname").innerHTML = getUserData(getToken(), document.getElementsByName("smail")["0"].value)["data"]["FirstName"];
        document.getElementById("lastname").innerHTML = getUserData(getToken(), document.getElementsByName("smail")["0"].value)["data"]["FamilyName"];
        document.getElementById("genderredneg").innerHTML = getUserData(getToken(), document.getElementsByName("smail")["0"].value)["data"]["Gender"];
        document.getElementById("cityytic").innerHTML = getUserData(getToken(), document.getElementsByName("smail")["0"].value)["data"]["City"];
        document.getElementById("count").innerHTML = getUserData(getToken(), document.getElementsByName("smail")["0"].value)["data"]["Country"];
        document.getElementById("inemail").innerHTML = getUserData(getToken(), document.getElementsByName("smail")["0"].value)["data"]["Email"];
    }else {
        document.getElementById("informationOther").style.display = "none";
        document.getElementById("wallOther").style.display = "none";
    }
    };

//function for displaying the three profile tabs
hide = function (ID) {

    //check: which tab is active
    if (ID==home_ref) {
        document.getElementById("home").style.display = "block";
        document.getElementById("browse").style.display = "none";
        document.getElementById("account").style.display = "none";

        document.getElementById("errorHome").style.display = "none";



        //get_message('my_messages',getUserData(getToken(),'false')['data']['Email']);

        document.getElementById("fname").innerHTML = getUserData(getToken(),"false")["data"]["FirstName"];
        document.getElementById("lname").innerHTML = getUserData(getToken(),"false")["data"]["FamilyName"];
        document.getElementById("gender").innerHTML = getUserData(getToken(),"false")["data"]["Gender"];
        document.getElementById("city").innerHTML = getUserData(getToken(),"false")["data"]["City"];
        document.getElementById("country").innerHTML = getUserData(getToken(),"false")["data"]["Country"];
        document.getElementById("infoemail").innerHTML = getUserData(getToken(),"false")["data"]["Email"];
        document.getElementById("my_messages").innerHTML = getUserMessages(getToken(),"false");

    } else if (ID==account_ref) {
        document.getElementById("account").style.display = "block";
        document.getElementById("home").style.display = "none";
        document.getElementById("browse").style.display = "none";
        document.getElementById("errorAccount").style.display = "none";

    } else if (ID ==browse_ref) {
        document.getElementById("browse").style.display = "block";
        document.getElementById("home").style.display = "none";
        document.getElementById("account").style.display = "none";
        document.getElementById("errorBrowse").style.display = "none";

        if (document.getElementsByName("smail")["0"].value == "") {
            document.getElementById("informationOther").style.display = "none";
            document.getElementById("wallOther").style.display = "none";
        }
    }

};


errorHideHome = function (){
    console.log("Delete error message");
    document.getElementById("errorHome").style.display = "none";
    return true;
};

errorHideAccount = function (){
    console.log("Delete error message");
    document.getElementById("errorAccount").style.display = "none";
    return true;
};

errorHideBrowse = function (){
    console.log("Delete error message");
    document.getElementById("errorBrowse").style.display = "none";
    return true;
};

errorHideWelcome = function (){
    console.log("Delete error message");
    document.getElementById("errorWelcome").style.display = "none";
    return true;
};

error = function (message, errorId) {
    console.log("Show error message");
    document.getElementById(errorId).style.display = "block";
    message = message.bold();

    var errorMes = document.getElementsByName("errorMessage");
    var i;
    for (i = 0; i < errorMes.length; i++) {
        errorMes[i].innerHTML = message;
    }

    if (errorId == "errorHome") {
        setTimeout(errorHideHome, 3000);
    } else if (errorId == "errorAccount") {
        setTimeout(errorHideAccount, 3000);
    } else if (errorId == "errorBrowse") {
        setTimeout(errorHideBrowse, 3000);
    } else if (errorId == "errorWelcome") {
        setTimeout(errorHideWelcome, 3000);
    }
};

clean = function(name){
    document.getElementById(name).value= "";


   //var field = document.getElementById(name);
   //field.value = field.defaultValue;
    return true;
};







//function for checking the first name format
correct_FirstName = function (fn) {
    //save all letters in a variable as format
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;

    //check: first name with format variable
    if (letters.test(fn) == true){
        return true;
    }else{
        error("First name is not correct", "errorWelcome");
        return false;
    }
};

//function for checking the family name format
correct_FamilyName = function (famn) {

    //save all letters in a variable as format
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;

    //check: family name with format variable
    if (letters.test(famn)){
        return true;
    }else{
        error("Familiy name is not correct", "errorWelcome");
        return false;
    }
};

//function for checking the city format
correct_City = function (city) {

    //save all letters in a variable as format
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;

    //check: city with format variable
    if (letters.test(city)){
        return true;
    }else{
        error("City is not correct", "errorWelcome");
        return false;
    }
};

//function for checking the country format
correct_Country = function (count) {

    //save all letters in a variable as format
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;

    //check: country with format variable
    if (letters.test(count)){
        return true;
    }else{
        error("Country is not correct", "errorWelcome");
        return false;
    }
};

//function for checking the email format
correct_Email = function(email){

    //save correct email format
    var mailformat = /(@)(.+)$/;

    //check: email with email format
    if (email.match(mailformat)){
        return true;
    }else{
        console.log("Wrong email format");
        error("Wrong email format", "errorWelcome");
        return false;
    }
};

//function for checking the password format
correct_PW = function (psw) {

    //save length of password
    var psw_length = psw.length;

    //check: length of password not smaller than 8 sign
    if (psw_length >= 8){
        return true;
    }else{
        console.log("Wrong Password");
        if(getToken()){
            console.log("PW too short");
            error("The password has to consist of at least eight characters", "errorAccount");
        }else{
            error("The password has to consist of at least eight characters", "errorWelcome");
        }
        return false;
    }
};

//function for checking the concordance of two passwords
samePW = function(pw1, pw2){

    //check: first password hasn't any differnces to the second password
    if (pw1.localeCompare(pw2) == 0){
        return true;
    }else {
        if(getToken()){
            error("New Passwords are not matching", "errorAccount");
        }else{
            error("Passwords are not matching", "errorWelcome");
        }
        return false;
    }
};

//function for changing password
changePW = function () {
    //read in all necessary data
    var token = getToken();
    var oldPW = document.getElementsByName("OPW")["0"].value;
    var newPW = document.getElementsByName("NPW")["0"].value;
    var rNewPW = document.getElementsByName("RNPW")["0"].value;



    //check: new password is the same like the repeated password and the password format is correct
    if(samePW(newPW.toString(), oldPW.toString())){
         error("New password is matching old password!","errorAccount");
         console.log("samePW true");
         return false;
     }
     else{
        console.log("samePW false");
        if(samePW(newPW.toString(), rNewPW.toString())){
            //use function of the server

            if(correct_PW(newPW)) {
                var pwStr = "token="+token + "&old_password="+oldPW + "&new_password="+newPW;

                if(sendToServer("/changePassword",pwStr).success == true) {
                    error("Password changed", "errorAccount");
                    return true;

                }else{
                    error("Old Password is not correct", "errorAccount");
                }

            }else{
                return false;
            }
        }else {
            console.log("change PW false");
            return false;
    }
    }


};



var obj;
sendToServer =function (app,string) {

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",app, false);

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200){

            var response =this.responseText;
            obj = JSON.parse(response);


        }
    };

    //xhttp.setRequestHeader("Content-length", string.length);
    //xhttp.setRequestHeader("Connenction", "close");

    xhttp.send(string);
    return obj;

};



// Log errors
websocket.onerror = function (error) {
    console.log('WebSocketError ' + error);
};

// Log messages from the server
websocket.onmessage = function (e) {
    console.log('Server: ' + e.data);

    if(e.data=="closeWS"){ //Log out old User if same user logs in twice
        console.log("User logged in twice: will be logged out");
        logout();
    }
};





