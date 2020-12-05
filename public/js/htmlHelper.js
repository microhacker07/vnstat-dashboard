"use strict";

function generateDivList(elementID, lst) {
    let plot_elm = document.getElementById(elementID);
    if (plot_elm.innerHTML == "") {
        for (let i of lst) {
            plot_elm.innerHTML += "<div id='"+ i +"'></div>";
        }   
    }
}

function generateInterfaceButtons(elementID, lst) {
    let button_elm = document.getElementById(elementID);
    if (button_elm.innerHTML == "") {
        for (let i of lst) {
            button_elm.innerHTML += "<button onclick='setWatchInterface("+ i +")'>"+ i +"</button>"
        }   
    }
}