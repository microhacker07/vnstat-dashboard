import bottle
import Server

bottle.run(host='0.0.0.0', port=8080, reloader=False, debug=True)
