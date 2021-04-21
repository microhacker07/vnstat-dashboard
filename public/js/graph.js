'use strict';

// Global Variables
let timestamp = new Date();
let selected_device = getLastSelectedDevice();

function getLastSelectedDevice() {
    let cookie = getCookie("device");
    return cookie;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function makeArray(data, key) {
    let arr = [];
    for (let d of data) {
        arr.push(d[key]);
    }
    return arr;
}

function trace(name, dates, data, text) {
    return {
        name: name,
        type: 'bar',
        x: dates,
        y: data,
        text: text,
        hoverinfo: "x+text+name"
    };
}

function layout(title) {
    return {
        title: {
            text: title + ' Data Usage',
        },

        yaxis: {
            title: {
                text: 'Data Usage (Bytes)'
            }
        },
        
        barmode: 'stack'
    };
}

const titleFromTimespan = {
    fiveminute: "Five minutes",
    hour: 'Hourly',
    day: 'Daily',
    month: 'Monthly',
    year: 'Yearly'
}

const config = {
    displaylogo: false,
    responsive: true,
};

// Uses the given parameters of the 'raw' json, timespan key, and element id name for the graph
function makePlot(graph_data, timespan, element) {
    let traffic_data = graph_data[timespan]

    const dates = makeArray(traffic_data, 'datetime')
    const rx = makeArray(traffic_data, 'rx');
    const tx = makeArray(traffic_data, 'tx');
    const rxText = rx.map(x => formatBytes(x));
    const txText = tx.map(x => formatBytes(x))
      
    const data = [trace('rx', dates, rx, rxText), trace('tx', dates, tx, txText)];
      
    Plotly.newPlot(element, data, layout(titleFromTimespan[timespan]), config);
}

function on_response(response) {
    const result = JSON.parse(response);

    const vnstat_elm = document.getElementById('vnstatversion');
    vnstat_elm.innerHTML = result['vnstatversion'];

    let date = result['updated']['date'];
    let time = result['updated']['time'];

    let minuteStr = 'minute'
    if (result['jsonversion'] == "1") {
        minuteStr += 's';
    }
    
    timestamp = new Date(date.year, date.month-1, date.day, time.hour, time[minuteStr]);
    sinceUpdate();

    let timespan_data = [];
    for (let i in result['graph_data']) {
        timespan_data.push(i);
    }

    generateDivList('plots', timespan_data);

    for (let t of timespan_data) {
        makePlot(result['graph_data'], t, t);
    }
}


function getData() {
    if (selected_device != "") {
        ajaxGetRequest("/plotly_graph/" + selected_device, on_response);
    }
}

function sinceUpdate() {
    let last_updated_elm = document.getElementById('last_updated');
    // Difference in milliseconds
    let diff = Date.now() - timestamp;
    // Now in seconds
    diff = Math.round(diff / 1000);
    
    if (diff >= 60) {
        diff = Math.round(diff / 60);
        let text_min = "minutes";
        if (diff == 1) {
            text_min = "minute";
        }
        last_updated_elm.innerHTML = diff + " " + text_min + " ago";
    } else {
        
        last_updated_elm.innerHTML = "just now";
    }
    
}

function runWithInterval(func, milliseconds) {
    func();
    setInterval(func, milliseconds);
}

function setDevice(deviceStr) {
    selected_device = deviceStr;
    setCookie("device", selected_device, 355)
    ajaxGetRequest("/plotly_graph/" + selected_device, on_response);
}

function getDevices(response) {
    let result = JSON.parse(response);
    generateButtons("devices_buttons", setDevice, result)
}

ajaxGetRequest("/interfaces", getDevices);

runWithInterval(getData, 1 * 60 * 1000);