import bottle
import json

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
    result = subprocess.run(['vnstat', '--json'], stdout=subprocess.PIPE)
    vnstat = result.stdout.decode('utf-8')
    vnstat = json.loads(vnstat)

    # Spot for handling/adding data to the base json
    json_iface['err'] = []

    return json.dumps(vnstat)

@bottle.get('/json/<iface>')
def json_filtered(iface):
    bottle.response.content_type = 'application/json; charset=UTF8'
    json_iface = json.loads(json_dump())

    interfaces = []

    for key in json_iface['interfaces']:
        interfaces.append(key['id'])
        if key['id'] == iface:
            json_iface['interface'] = key['id']
            json_iface['created'] = key['created']
            json_iface['updated'] = key['updated']
            json_iface['traffic'] = key['traffic']
            
    json_iface.pop('interfaces')

    if json_iface.get('interface', None) == None:
        json_iface['interface'] = 'err'
        json_iface['err'] += [f"Could not find interface '{iface}' only known interfaces are {interfaces}"]

    return json.dumps(json_iface)

bottle.run(host='0.0.0.0', port=8080, debug=True)
