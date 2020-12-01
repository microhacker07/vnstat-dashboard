import bottle
import json
import App
import vnStatJSONhandler as statHandler

@bottle.route('/')
def server_html():
    return bottle.static_file('index.html', root='./public/')

@bottle.route('/js/<file>')
def server_js(file):
    return bottle.static_file(file, root='./public/js')

@bottle.route('/css/<file>')
def server_css(file):
    return bottle.static_file(file, root='./public/css')

@bottle.get('/json')
def json_dump():
    bottle.response.content_type = 'application/json; charset=UTF8'
    result = App.vnStatGetJSON()
    json_iface = json.loads(result)

    # Spot for handling/adding data to the base json

    return json.dumps(json_iface)

@bottle.get('/json/<iface>')
def json_filtered(iface):
    bottle.response.content_type = 'application/json; charset=UTF8'
    json_iface = json.loads(json_dump())

    all_interfaces = []
    network_name_key = statHandler.network_name_key[ json_iface['jsonversion'] ]

    for single_interface in json_iface['interfaces']:
        interface_name = single_interface[network_name_key]
        all_interfaces.append(interface_name)
        if interface_name == iface:
            json_iface['interface'] = interface_name
            json_iface['created'] = single_interface['created']
            json_iface['updated'] = single_interface['updated']
            json_iface['traffic'] = single_interface['traffic']
            
    json_iface.pop('interfaces')
    json_iface['all_interfaces'] = all_interfaces

    if json_iface.get('interface', None) == None:
        # Possible error handling
        pass

    return json.dumps(json_iface)
