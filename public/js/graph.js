'use strict';

// Global Variables
let timestamp = new Date();

function reduceData(data, power, humanReadable = false) {
    let reduction = 1000 + 24 * !humanReadable;
    let acc = 0;
    while (acc < power) {
        for (let i in data) {
            data[i] = data[i] / reduction;
        }
        acc += 1;
    }
    return data;
}

function makeArray(data, key) {
    let arr = [];
    for (let d of data) {
        arr.push(d[key]);
    }
    return arr;
}

function layout(title, data_unit) {
    return {
        title: {
            text: title + ' data usage',
            font: {
                family: 'Courier New, monospace',
                size: 24
            },
            xref: 'paper'
        },

        yaxis: {
            title: {
                text: 'Data Usage (' + data_unit + ')',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            }
        },
        
        barmode: 'stack'
    };
}

// Uses the given parameters of the 'raw' json, timespan key, and element id name for the graph
function makePlot(graph_data, timespan, element) {
    let traffic_data = graph_data[timespan]

    let dates = makeArray(traffic_data, 'datetime')
    let rx = makeArray(traffic_data, 'rx');
    let tx = makeArray(traffic_data, 'tx');

    let data_unit = '';
    if (timespan === 'hours') {
        // Converts data from KiB to MiB
        rx = reduceData(rx, 1);
        tx = reduceData(tx, 1);
        data_unit = 'MiB';
    } else {
        // Converts data from KiB to GiB
        rx = reduceData(rx, 2);
        tx = reduceData(tx, 2);
        data_unit = 'GiB';
    }

    // Received data bars
    let traceRX = {
        x: dates,
        y: rx,
        name: 'rx',
        type: 'bar'
      };
    
    // Transmitted data bars 
    let traceTX = {
        x: dates,
        y: tx,
        name: 'tx',
        type: 'bar'
    };
      
    let data = [traceRX, traceTX];

    let title = element.charAt(0).toUpperCase() + element.slice(1);
    title = title.replace('s ', 'ly ');

    let config = {
        displaylogo: false,
        responsive: true,
    };
      
    Plotly.newPlot(element, data, layout(title, data_unit), config);
}

function on_response(response) {
    let result = JSON.parse(response);

    let vnstat_elm = document.getElementById('vnstatversion');
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
    ajaxGetRequest("/plotly_graph/eth0", on_response);
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

runWithInterval(getData, 1 * 60 * 1000);

