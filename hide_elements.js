/**
 * Created by Gerst on 31.01.2017.
 */

function hide(ID) {
    if (ID==home_ref)
    {
        document.getElementById("home").style.display = "block";
        document.getElementById("browse").style.display = "none";
        document.getElementById("account").style.display = "none";
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
}