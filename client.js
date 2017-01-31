/**
 * Created by Jonas Brückner & Maximilian Gerst on 19.01.17.
 */
displayView = function(){
    // Get the content to display
    var elem = document.getElementById("welcomeview");
    // Find the target element where you'll display
    var target = document.body;
    // Put it there
    target.innerHTML = elem.innerHTML;
};

window.onload = function(){

    displayView();
};




samePW = function(){
    if (document.getElementById("pw1").innerHTML.isEqual(document.getElementById("pw2").innerHTML)){
        return "Concurrent";
    }else {
        return "Password not concurrent!";
    }
}
