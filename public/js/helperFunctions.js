// path is URL we are sending request
// callback function that JS calls when server replies
function ajaxGetRequest(path, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (this.readyState===4&&this.status===200) {
            callback(this.response);
        }
    };
    request.open("GET", path);
    request.send();
}

// path is URL we are sending request
// data is JSON blob being sent to the server
// callback function that JS calls when server replies
function ajaxPostRequest(path, data, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState===4&&this.status===200) {
            callback(this.response);
        }
    };
    request.open("POST", path);request.send(data);
}

// set a cookie in the browser
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// get a cookie from the browser
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function generateDivList(elementID, lst) {
    let plot_elm = document.getElementById(elementID);
    if (plot_elm.innerHTML == "") {
        for (let i of lst) {
            plot_elm.innerHTML += "<div id='"+ i +"'></div>";
        }   
    }
}

function generateButtons(elementID, func, lst) {
    let button_elm = document.getElementById(elementID);
    if (button_elm.innerHTML == "") {
        for (let i of lst) {
            button_elm.innerHTML += "<button onclick='"+ func.name +"(\""+ i +"\");'>"+ i +"</button>"
        }   
    }
}