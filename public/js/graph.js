'use strict';

// Global Variables
let timestamp = new Date();


function reduceData(data, x) {
    let acc = 0;
    while (acc < x) {
        for (let i in data) {
            data[i] = data[i] / 1024;
        }
        acc += 1;
    }
    return data
}

function makeArray(data, key) {
    let arr = [];
    for (let d of data) {
        arr.push(d[key]);
    }
    return arr;
}

function getDates(data, time_type) {
    let arr = [];
    let acc = 0;
    for (let d of data) {
        let d_short = d['date'];
        let str = d_short['year'] + "-" + d_short['month'];
        if (time_type != 'months') {
            str += "-" + d_short['day'];
            if (time_type == 'hours') {
                str += " " + acc;
            }
        }
        arr.push(str);
        acc += 1;
    }
    return arr;
}

function makePlot(vnstat_json, timespan, element) {
    let traffic_data = vnstat_json['traffic'][timespan]

    let dates = getDates(traffic_data, timespan);

    let rx = makeArray(traffic_data, 'rx');
    let tx = makeArray(traffic_data, 'tx');

    if (timespan === 'hours') {
        rx = reduceData(rx, 1);
        tx = reduceData(tx, 1);
    } else {
        rx = reduceData(rx, 2);
        tx = reduceData(tx, 2);
    }

    let traceRX = {
        x: dates,
        y: rx,
        name: 'rx',
        type: 'bar'
      };
    
    let traceTX = {
        x: dates,
        y: tx,
        name: 'tx',
        type: 'bar'
    };
      
    let data = [traceRX, traceTX];

    let title = element.charAt(0).toUpperCase() + element.slice(1);

    let data_unit = 'MiB';
    if (timespan != 'hours') {
        data_unit = 'GiB';
    }
      
    let layout = {
        title: {
            text: title + ' data usage',
            font: {
                family: 'Courier New, monospace',
                size: 24
            },
            xref: 'paper'
        },

        xaxis: {
            title: {
                text: 'Time',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            },
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
        
        barmode: 'group'
    };

    let config = {
        displaylogo: false,
        responsive: true,
    };
      
    Plotly.newPlot(element, data, layout, config);
}

function on_response(response) {
    let result = JSON.parse(response);

    let vnstat_elm = document.getElementById('vnstatversion');
    vnstat_elm.innerHTML = result['vnstatversion'];
    let date = result['updated']['date'];
    let time = result['updated']['time'];
    
    if (time['minutes'] < 10) {
        time['minutes'] = "0" + JSON.stringify(time['minutes']);
    }
    timestamp = new Date(date['year'], date['month'] - 1, date['day'], time['hour'], time['minutes']);
    
    makePlot(result, 'hours', 'hourly');
    makePlot(result, 'days', 'daily');
    makePlot(result, 'months', 'monthly');
}

function getData() {
    ajaxGetRequest("/json/eth0", on_response);
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

        last_updated_elm.innerHTML = diff + " seconds ago";
    }

}

function runWithInterval(func, milliseconds) {
    func();
    setInterval(func, milliseconds);
}

runWithInterval(getData, 1 * 60 * 1000);
runWithInterval(sinceUpdate, 1000);

