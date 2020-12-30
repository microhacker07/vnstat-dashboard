import subprocess

# Returns an json blob from a json output of vnStat
def vnStatGetJSON():
    result = subprocess.run(['vnstat', '--json'], stdout=subprocess.PIPE)
    json_blob = result.stdout.decode('utf-8')
    return json_blob

#================================================
# time handling stuff
#================================================

def numberStringSize(integer, minsize, align_right=True):
    num_text = str(integer)
    empty_zeros = '0' * (minsize - len(num_text))
    if align_right:
        num_text = empty_zeros + num_text
    else:
        num_text = num_text + empty_zeros
    return num_text

# Gets a timestamp obj from a single point in time from vnstat
# This works for JSON V2
def getTimestamp(time_point):
    year   = time_point['date']['year']
    month  = time_point['date'].get('month', 0)
    day    = time_point['date'].get('day', 0)
    time   = time_point.get('time', { })
    hour   = time.get('hour', 0)
    minute = time.get('minute', 0)
    timestamp = {'year':year, 'month':month, 'day':day, 'hour':hour, 'minute':minute}
    return timestamp

# Returns a timestamp string from a timestamp obj
def timeStr(timeObj):
    year   = str(timeObj['year'])
    month  = numberStringSize(timeObj['month'], 2)
    day    = numberStringSize(timeObj['day'], 2)
    hour   = numberStringSize(timeObj['hour'],  2)
    minute = numberStringSize(timeObj['minute'], 2)
    timestamp = year + "-" + month + "-" + day + " " + hour + ":" + minute
    return timestamp

#================================================
# graph handling functions
#================================================

# Future function
def histogramFormat(timespan, data, json_version):
    data_points = []

    for i in data:
        if json_version == "1" and timespan == "hours":
            i['time'] = {}
            i['time']['hour'] = i['id']
        datetimeObj = getTimestamp(i)
        datetimeStr = timeStr(datetimeObj)
        data_points.append({'rx':i['rx'], 'tx':i['tx'], 'datetime':datetimeStr})

    return data_points

# Modifies a json obj from json_filtered
def vnstat_graph(obj):
    obj['simple_data'] = {}

    # ignore certain types of data
    ignore_traffic = ['total']
    traffic = obj['traffic']
    histograms = {}

    for t in traffic:
        data = traffic[t]
        if not t in ignore_traffic:
            histograms[t] = histogramFormat(t, data, obj['jsonversion'])
        else:
            obj['simple_data'][t] = data


    obj.pop('traffic')
    obj['graph_data'] = histograms