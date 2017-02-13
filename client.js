/**
 * Created by Jonas Brückner & Maximilian Gerst on 19.01.17.
 */
viewScreen = function () {
    if (getToken()){
        console.log("true");
        displayViewProfile();
    }
    else {
        console.log("false");
        displayView();
    }
}

displayView = function() {
//Welcome Screen, No tocken
    // Get the content to display
    var elemWelcome = document.getElementById("welcomeview");

    // Find the target element where you'll display
    var target = document.body;
    // Put it there
    target.innerHTML = elemWelcome.innerHTML;


};

displayViewProfile = function () {
    // Profile View, token exists
    var elemProfile = document.getElementById("profileview");
    var target = document.body;
    target.innerHTML = elemProfile.innerHTML;
    onload=hide(home_ref);
};



window.onload = function(){
    viewScreen();
};


signIn = function () {

    var email = document.getElementsByName("emailIn")["0"].value.toString();
    var pass = document.getElementsByName("psw")["0"].value.toString();

    if (correct_Email(email) && correct_PW(pass)){
        var input = serverstub.signIn(email, pass);
        if (input.success === true){
            console.log(input.message);
            viewScreen()
            return true;

        }else{
            console.log(input.message);
            return false;

        }
    }else{
        console.log("No correct input!");
        return false;
    }

};

signUp = function () {

    var email = document.getElementsByName("EM")["0"].value.toString();
    console.log(email);
    var pass = document.getElementsByName("psw_new")["0"].value.toString();
    console.log(pass);
    var fn = document.getElementsByName("unameReg")["0"].value.toString();
    console.log(fn);
    var famnam = document.getElementsByName("FN")["0"].value.toString();
    console.log(famnam);
    var g = document.getElementsByName("Gen")["0"].value.toString();
    console.log(g);
    var ci = document.getElementsByName("City")["0"].value.toString();
    console.log(ci);
    var co = document.getElementsByName("Cou")["0"].value.toString();
    console.log(co);
    var psw2 = document.getElementsByName("psw_rep")["0"].value.toString();
    console.log(psw2);

    if(correct_Email(email) == true && correct_PW(pass) == true  &&  correct_FirstName(fn) == true && correct_FamilyName(famnam) == true && correct_City(ci) == true && correct_Country(co)== true && samePW(pass, psw2) == true){

        var input = {email: email, password: pass, firstname: fn, familyname: famnam, gender: g, city: ci, country: co};
        var inputAll = serverstub.signUp(input);

        if (inputAll.success == true){
            console.log(inputAll.message);
            var input = serverstub.signIn(email, pass);
            viewScreen();
            return true;
        }else {
            console.log(inputAll.message);
            return false;
        }

    }else{
        console.log("Wrong entry!");
        return false;


    }
};


correct_Email = function(email){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)){
        return true;
    }else{
        console.log("Email not confirm");
        return false;
    }
};

correct_PW = function (psw) {
    var psw_length = psw.length;
    if (psw_length >= 8){
        return true;
    }else{
        console.log("Password not confirm");
        return false;
    }
};

samePW = function(pw1, pw2){
    if (pw1.localeCompare(pw2) == 0){
        return true;
    }else {
        console.log("Password not concurrent");
        return false;
    }
};

correct_FirstName = function (fn) {
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;
    if (letters.test(fn) == true){
        return true;
    }else{
        console.log("First Name not confirm");
        return false;
    }
};

correct_FamilyName = function (famn) {
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;
    if (letters.test(famn)){
        return true;
    }else{
        console.log("Family Name not confirm");
        return false;
    }
};

correct_Country = function (count) {
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;
    if (letters.test(count)){
        return true;
    }else{
        console.log("Country not confirm");
        return false;
    }
};

correct_City = function (city) {
    var letters = /^[a-zA-Z\u00fc\u00c4\u00e4\u00d6\u00f6\u00dc\u00df]+$/;
    if (letters.test(city)){
        return true;
    }else{
        console.log("City not confirm");
        return false;
    }
};
getToken = function () {
   var pos = localStorage.getItem("loggedinusers").lastIndexOf(":");
   var tok = localStorage.getItem("loggedinusers").slice(2,pos-1).toString();
   return tok;
}

hide = function (ID) {
    if (ID==home_ref)
    {
        document.getElementById("home").style.display = "block";
        document.getElementById("browse").style.display = "none";
        document.getElementById("account").style.display = "none";
        document.getElementById("fname").innerHTML = "First Name: ".concat(serverstub.getUserDataByToken(getToken()).data.firstname);
        document.getElementById("lname").innerHTML = "Last Name: ".concat(serverstub.getUserDataByToken(getToken()).data.familyname);
        document.getElementById("gender").innerHTML = "Gender: ".concat(serverstub.getUserDataByToken(getToken()).data.gender);
        document.getElementById("city").innerHTML = "City: ".concat(serverstub.getUserDataByToken(getToken()).data.city);
        document.getElementById("country").innerHTML = "Country: ".concat(serverstub.getUserDataByToken(getToken()).data.country);
        document.getElementById("infoemail").innerHTML = "Email: ".concat(serverstub.getUserDataByToken(getToken()).data.email);

        document.getElementById("my_messages").innerHTML = serverstub.getUserMessagesByToken(getToken());
        console.log(getToken()); //Test welcher User eingeloggt ist: Max

    }

    else if (ID ==browse_ref)
    {
        document.getElementById("browse").style.display = "block";
        document.getElementById("home").style.display = "none";
        document.getElementById("account").style.display = "none";
    }

    else if (ID==account_ref)
    {
        document.getElementById("account").style.display = "block";
        document.getElementById("home").style.display = "none";
        document.getElementById("browse").style.display = "none";
    }
};

logout = function (){
    console.log(serverstub.signOut(getToken()));
    viewScreen();
}

postmessage = function (token, content, toEmail){
     serverstub.postMessage(getToken(),"TEST",serverstub.getUserDataByToken(getToken()).data.email);
}

searchEmail = function (){
    var smail = document.getElementsByName("smail")["0"].value;
    return true;
};

getUserInformation = function () {


    console.log("Hallo");
    document.getElementById("firstname").innerHTML = "First Name: ".concat(serverstub.getUserDataByEmail(getToken(), searchEmail().smail).data.firstname); //Jonas information about other User
    document.getElementById("lastname").innerHTML = "Last Name: ".concat(serverstub.getUserDataByEmail(getToken(),searchEmail().smail).data.familyname); //Jonas information about other User
    document.getElementById("genderredneg").innerHTML = "Gender: ".concat(serverstub.getUserDataByEmail(getToken(),searchEmail().smail).data.gender); //Jonas information about other User
    document.getElementById("cityytic").innerHTML = "City: ".concat(serverstub.getUserDataByEmail(getToken(),searchEmail().smail).data.city); //Jonas information about other User
    document.getElementById("count").innerHTML = "Country: ".concat(serverstub.getUserDataByEmail(getToken(),searchEmail().smail).data.country); //Jonas information about other User
    document.getElementById("inemail").innerHTML = "Email: ".concat(serverstub.getUserDataByEmail(getToken(),searchEmail().smail).data.email); //Jonas information about other User
};

