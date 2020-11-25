from flask import g, Flask, app, request
import configparser
import zmq

def create_app():
    config = configparser.ConfigParser()
    config.read('river.ini')
    app = Flask(__name__)
    app.config['ZMQURL'] = config['app']['zmq_url']

    def get_sock():
        if 'ctx' not in g:
            g.ctx = zmq.Context.instance()
        if 'sock' not in g:
            g.sock = g.ctx.socket(zmq.REQ)
            print("connecting")
            g.sock.connect(app.config['ZMQURL'])
            print("connected")
        return g.sock

    @app.teardown_appcontext
    def teardown_appcontext(e):
        sock = g.pop('sock',None)
        if sock is not None:
            sock.close()

    @app.route('/sim',methods=['POST'])
    def sim():
        sock = get_sock()
        sock.send_json(request.get_json(force=True))
        s = sock.recv_string()
        return s

    return app

