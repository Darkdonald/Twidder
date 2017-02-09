/**
 * Created by Jonas Brückner & Maximilian Gerst on 19.01.17.
 */


displayView = function() {
    // Get the content to display
    var elemWelcome = document.getElementById("welcomeview");
    var elemProfile = document.getElementById("profileview");
    // Find the target element where you'll display
    var target = document.body;
    // Put it there
    if (document.getElementsByTagName("button") == true) {

        if (signIn() == true) {
            target.innerHTML = elemProfile.innerHTML;
        } else {
            target.innerHTML = elemWelcome.innerHTML;
        }

        if (signUp() == true) {
            target.innerHTML = elemProfile.innerHTML;
        } else {
            target.innerHTML = elemWelcome.innerHTML;
        }
    }else{
        target.innerHTML = elemWelcome.innerHTML
    }
};


window.onload = function(){

    displayView();


};


signIn = function () {

    var email = document.getElementsByName("emailIn");
    var pass = document.getElementsByName("psw");

    if (correct_Email(email) && correct_PW(pass)){
        var input = serverstub.signIn(email, pass);

        if (input.success === true){
            console.log(input.message);
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

    var email = document.getElementsByName("EM");
    console.log(email);
    var pass = document.getElementsByName("psw_new");
    console.log(pass);
    var fn = document.getElementsByName("unameReg");
    console.log(fn);
    var famnam = document.getElementsByName("FN");
    console.log(famnam);
    var g = document.getElementsByName("Gen");
    console.log(g);
    var ci = document.getElementsByName("City");
    console.log(ci);
    var co = document.getElementsByName("Cou");
    console.log(co);
    var psw2 = document.getElementsByName("psw_rep");
    console.log(psw2);

    if(/*correct_Email(email) == true && correct_PW(pass) == true  && */ correct_FirstName(fn) == true && correct_FamilyName(famnam) == true && correct_City(ci) == true && correct_Country(co)== true){
        console.log("hallo");
        var input = {email: email, password: pass, firstname: fn, familyname: famnam, gender: g, city: ci, country: co};
        var inputAll = serverstub.signUp(input);

        if (inputAll.success == true){
            console.log(inputAll.message);
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
    if (mailformat.test(email)){
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
    if (pw1.value.match(pw2.value)){
        return true;
    }else {
        console.log("Password not concurrent");
        return false;
    }
};

correct_FirstName = function (fn) {
    var letters = /^[a-zA-Z]$/;

    if (fn.match(letters)){
        return true;
    }else{
        console.log("First Name not confirm");
        return false;
    }
};

correct_FamilyName = function (famn) {
    var letters = /^[a-zA-Z]$/;
    if (famn.match(letters)){
        return true;
    }else{
        console.log("Family Name not confirm");
        return false;
    }
};

correct_Country = function (count) {
    var letters = /^[a-zA-Z]$/;
    if (count.value.match(letters)){
        return true;
    }else{
        console.log("Country not confirm");
        return false;
    }
};

correct_City = function (city) {
    var letters = /^[a-zA-Z]$/;
    if (city.value.match(letters)){
        return true;
    }else{
        console.log("City not confirm");
        return false;
    }
};





































