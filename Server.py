import bottle
import json
import App

@bottle.route('/')
def server_html():
    return bottle.static_file('index.html', root='./public/')

@bottle.get('/favicon.ico')
def serve_favicon():
    return bottle.static_file('favicon.ico', root='./public/icon/')

@bottle.route('/js/<file>')
def serve_js(file):
    return bottle.static_file(file, root='./public/js')

@bottle.route('/css/<file>')
def serve_css(file):
    return bottle.static_file(file, root='./public/css')

@bottle.get('/json')
def json_dump():
    bottle.response.content_type = 'application/json; charset=UTF8'
    result = App.vnStatGetJSON()
    json_iface = json.loads(result)

    # Spot for handling/adding data to the base json

    return json.dumps(json_iface)

# Dictionary with the version with the related network name
network_name_key = {
    "1":"id",
    "2":"name"
}

@bottle.get('/json/<iface>')
def json_filtered(iface):
    bottle.response.content_type = 'application/json; charset=UTF8'
    json_iface = json.loads(json_dump())

    network_name = network_name_key[ json_iface['jsonversion'] ]

    for single_interface in json_iface['interfaces']:
        interface_name = single_interface[network_name]

        if interface_name == iface:
            json_iface['interface'] = interface_name
            json_iface['created'] = single_interface['created']
            json_iface['updated'] = single_interface['updated']
            json_iface['traffic'] = single_interface['traffic']
            
    json_iface.pop('interfaces')

    return json.dumps(json_iface)

@bottle.get('/interfaces')
def all_interfaces():
    bottle.response.content_type = 'application/json; charset=UTF8'
    json_iface = json.loads(json_dump())

    all_interfaces = []
    network_name = network_name_key[ json_iface['jsonversion'] ]

    for single_interface in json_iface['interfaces']:
        interface_name = single_interface[network_name]
        all_interfaces.append(interface_name)

    return json.dumps(all_interfaces)

@bottle.get('/plotly_graph/<interface>')
def plotly_data(interface):
    bottle.response.content_type = 'application/json; charset=UTF8'
    json_blob = json.loads(json_filtered(interface))

    App.vnstat_graph(json_blob)

    return json.dumps(json_blob)