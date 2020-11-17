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
