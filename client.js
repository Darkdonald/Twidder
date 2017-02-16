/**
 * Created by Jonas Brückner & Maximilian Gerst on 19.01.17.
 */

//choose the used view through token
viewScreen = function () {

    //check: token
    if (getToken()){
        //show Profile View
        displayViewProfile();
    }
    else {
        //show Welcome View
        displayView();
    }
};

//display the Welcome View
displayView = function() {

    //Welcome Screen, No token
    //Get the content to display
    var elemWelcome = document.getElementById("welcomeview");

    //Find the target element where you'll display
    var target = document.body;

    //Put it there
    target.innerHTML = elemWelcome.innerHTML;
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

    //show the Home page when refreshing
    hide(home_ref);
    get_message('my_messages',serverstub.getUserDataByToken(getToken()).data.email.toString())
};


//show the current view
window.onload = function(){
    viewScreen();
    //document.getElementById("errorDiv").style.display = "none";
};

//Sign in function
signIn = function () {

    //Get the data of the user for login
    var email = document.getElementsByName("emailIn")["0"].value.toString();
    var pass = document.getElementsByName("psw")["0"].value.toString();

    //check: correct email format and correct password format
    if (correct_Email(email) && correct_PW(pass)){

        //Use the signIn() function of the server and save the return in a variable
        var input = serverstub.signIn(email, pass);

        //check: successful login
        if (input.success === true){

            //token created, Profile View will further show
            viewScreen();
            return true;

        }else{

            //token not created, Welcome View will further show
            return false;
        }
    }else{

        //input is not correct
        return false;
    }
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

    //check: correct email, password, first name, family name, city, country format and password is equal to repeat password
    if(correct_Email(email) == true && correct_PW(pass) == true  &&  correct_FirstName(fn) == true && correct_FamilyName(famnam) == true && correct_City(ci) == true && correct_Country(co)== true && samePW(pass, psw2) == true){

        //create a variable with all input data
        var input = {email: email, password: pass, firstname: fn, familyname: famnam, gender: g, city: ci, country: co};

        //Use the signUp() function of the server and save the return in a variable
        var inputAll = serverstub.signUp(input);

        //check: successful registration
        if (inputAll.success == true){

            //login after creating a new user
            serverstub.signIn(email, pass);
            viewScreen();
            return true;
        }else {

            //user already in system
            return false;
        }
    }else{

        //wrong input
        return false;
    }
};

//function for checking the email format
correct_Email = function(email){

    //save correct email format
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    //check: email with email format
    if (email.match(mailformat)){
        return true;
    }else{
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
        return false;
    }
};

//function for checking the concordance of two passwords
samePW = function(pw1, pw2){

    //check: first password hasn't any differnces to the second password
    if (pw1.localeCompare(pw2) == 0){
        return true;
    }else {
        return false;
    }
};

//function for checking the first name format
correct_FirstName = function (fn) {

    //save all letters in a variable as format
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;

    //check: first name with format variable
    if (letters.test(fn) == true){
        return true;
    }else{
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
        return false;
    }
};

//function for getting the current user token
getToken = function () {

    //check: currently user is logging in
    if (localStorage.getItem("loggedinusers") !== null) {

        //get the token and produce a string of it
        var pos = localStorage.getItem("loggedinusers").lastIndexOf(":");
        var tok = localStorage.getItem("loggedinusers").slice(2, pos - 1).toString();
        return tok;
    }else{
        return false;
    }
};

//function for displaying the three profile tabs
hide = function (ID) {

    //check: which tab is active
    if (ID==home_ref)
    {
        document.getElementById("home").style.display = "block";
        document.getElementById("browse").style.display = "none";
        document.getElementById("account").style.display = "none";

        //document.getElementById("errorHome").style.display = "none";

        document.getElementById("fname").innerHTML = "First Name: ".concat(serverstub.getUserDataByToken(getToken()).data.firstname);
        document.getElementById("lname").innerHTML = "Last Name: ".concat(serverstub.getUserDataByToken(getToken()).data.familyname);
        document.getElementById("gender").innerHTML = "Gender: ".concat(serverstub.getUserDataByToken(getToken()).data.gender);
        document.getElementById("city").innerHTML = "City: ".concat(serverstub.getUserDataByToken(getToken()).data.city);
        document.getElementById("country").innerHTML = "Country: ".concat(serverstub.getUserDataByToken(getToken()).data.country);
        document.getElementById("infoemail").innerHTML = "Email: ".concat(serverstub.getUserDataByToken(getToken()).data.email);
        document.getElementById("my_messages").innerHTML = serverstub.getUserMessagesByToken(getToken());

    }
    else if (ID ==browse_ref)
    {
        document.getElementById("browse").style.display = "block";
        document.getElementById("home").style.display = "none";
        document.getElementById("account").style.display = "none";
        //document.getElementById("errorBrowse").style.display = "none";

        document.getElementById("firstname").innerHTML = "First Name:";
        document.getElementById("lastname").innerHTML = "Last Name:";
        document.getElementById("genderredneg").innerHTML = "Gender:";
        document.getElementById("cityytic").innerHTML = "City:";
        document.getElementById("count").innerHTML = "Country:";
        document.getElementById("inemail").innerHTML = "Email:";
    }
    else if (ID==account_ref)
    {
        document.getElementById("account").style.display = "block";
        document.getElementById("home").style.display = "none";
        document.getElementById("browse").style.display = "none";
        //document.getElementById("errorAccount").style.display = "none";
    }
};

//function for logging out
logout = function (){

    //use function of the server
    serverstub.signOut(getToken());
    viewScreen();
};

//function for posting messages
postmessage = function (contentName, toEmail){
    var contentInBlack = document.getElementsByName(contentName)["0"].value.fontcolor("black");
     serverstub.postMessage(getToken(),contentInBlack,toEmail);
     if(document.getElementsByName(contentName)["0"].value == ""){
         error("Empty Message!","errorMessage","errorHome");
     }
     return true;
};

//function for getting a message and post it on the wall
get_message = function (id_wall,email) {

    //check if user exists
    if (serverstub.getUserDataByEmail(getToken(), document.getElementsByName("smail")["0"].value).success === false && id_wall !== 'my_messages'){

        document.getElementById(id_wall).innerHTML = "Not in System!".fontcolor("red");

    }else{
        var wall="";
        for(var i=0; i<serverstub.getUserMessagesByEmail(getToken(),email).data.length; i++)
            {
                var newPost = serverstub.getUserMessagesByEmail(getToken(),email).data[i].writer.toString() + ": " .concat(serverstub.getUserMessagesByEmail(getToken(),email).data[i].content.toString()) + "\<br>";
                wall = wall + newPost;
            }
        document.getElementById(id_wall).innerHTML = wall;
    }
};

//function for getting user information
getUserInformation = function () {

    //check: email in system
    if(serverstub.getUserDataByEmail(getToken(), document.getElementsByName("smail")["0"].value).success === true){

        //information of other user
        document.getElementById("firstname").innerHTML = "First Name: ".concat(serverstub.getUserDataByEmail(getToken(), document.getElementsByName("smail")["0"].value).data.firstname);
        document.getElementById("lastname").innerHTML = "Last Name: ".concat(serverstub.getUserDataByEmail(getToken(),document.getElementsByName("smail")["0"].value).data.familyname);
        document.getElementById("genderredneg").innerHTML = "Gender: ".concat(serverstub.getUserDataByEmail(getToken(),document.getElementsByName("smail")["0"].value).data.gender);
        document.getElementById("cityytic").innerHTML = "City: ".concat(serverstub.getUserDataByEmail(getToken(),document.getElementsByName("smail")["0"].value).data.city);
        document.getElementById("count").innerHTML = "Country: ".concat(serverstub.getUserDataByEmail(getToken(),document.getElementsByName("smail")["0"].value).data.country);
        document.getElementById("inemail").innerHTML = "Email: ".concat(serverstub.getUserDataByEmail(getToken(),document.getElementsByName("smail")["0"].value).data.email);
    }else{

        //information of other user isn't in System
        document.getElementById("firstname").innerHTML = "First Name: Not in System!".fontcolor("red");
        document.getElementById("lastname").innerHTML = "Last Name: Not in System!".fontcolor("red");
        document.getElementById("genderredneg").innerHTML = "Gender: Not in System!".fontcolor("red");
        document.getElementById("cityytic").innerHTML = "City: Not in System!".fontcolor("red");
        document.getElementById("count").innerHTML = "Country: Not in System!".fontcolor("red");
        document.getElementById("inemail").innerHTML = "Email: Not in System!".fontcolor("red");
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
         error("New password is matching old password!","errorMessage","errorAccount");
     }
    if(samePW(newPW.toString(), rNewPW.toString()) && correct_PW(newPW)){

        //use function of the server
        serverstub.changePassword(token, oldPW, newPW);
        return true;
    }else {
        return false;
    }
};
errorHide = function (div) {
    document.getElementById(div).style.display = "none";
    return true;
};

error = function (message,place,div) {
        document.getElementById(div).style.display = "block";
        message=message.bold();
        document.getElementsByName(place).innerHTML = message;
        setTimeout(errorHide,3000);
        return true;
};

clean = function(name){
    document.getElementsByName(name)["0"].value= "";
    return true;
};






















