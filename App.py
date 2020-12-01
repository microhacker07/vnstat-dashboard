import subprocess

# Returns an json blob from a json output of vnStat
def vnStatGetJSON():
    result = subprocess.run(['vnstat', '--json'], stdout=subprocess.PIPE)
    json_blob = result.stdout.decode('utf-8')
    return json_blob

"""
Below is currently not being used
 |                             |
 V                             V
"""

# Gets a timestamp from a single point in time
def getTimestamp(time_point):
    timestamp = ''
    default_time = {'hour':0,'minute':0}
    date = time_point['date']
    #time = time_point.get('time', default_time)
    timestamp += date['year']
    timestamp += date.get('month', "0")
    timestamp += date.get('day', "0")

# Future function
def Histogram(lst):
    return None

# Modifies a json obj from json_filtered
def vnstat_graph(obj):
    obj['simple_data'] = {}

    ignore_traffic = ['total']
    traffic = obj['traffic']
    histograms = {}

    for t in traffic:
        data = traffic[t]
        if not t in ignore_traffic:
            histograms[t] = Histogram(data)
        else:
            obj['simple_data'][t] = data


    obj.pop('traffic')
    obj['histograms'] = histograms