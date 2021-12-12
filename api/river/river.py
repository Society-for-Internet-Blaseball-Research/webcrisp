from flask import g, Flask, app, request, Response
from salmon_lib import *
import configparser
import zmq


def create_app():
    config = configparser.ConfigParser()
    config.read("river.ini")
    app = Flask(__name__)
    app.config["ZMQURL"] = config["app"]["zmq_url"]

    def get_sock():
        if "ctx" not in g:
            g.ctx = zmq.Context.instance()
        if "sock" not in g:
            g.sock = g.ctx.socket(zmq.REQ)
            g.sock.setsockopt(zmq.REQ_CORRELATE, 1)
            print("connecting")
            g.sock.connect(app.config["ZMQURL"])
            print("connected")
        return g.sock

    @app.teardown_appcontext
    def teardown_appcontext(e):
        sock = g.pop("sock", None)
        if sock is not None:
            sock.close()

    def run_sim(config, sock):
        sock.send_json(config)
        return sock.recv_string()

    def run_simple_sim(config, sock):
        sim = Sim()
        stocks = [Stock(sim, config=stock_config) for stock_config in config["stocks"]]
        fisheries = [
            Fishery(sim, config=fishery_config)
            for fishery_config in config["fisheries"]
        ]

        for s in stocks:
            s.build()

        for f in fisheries:
            f.build()

        sock.send_json(sim.to_sibr_conf())
        return sock.recv_string()

    @app.route("/sim", methods=["POST"])
    def sim():
        sock = get_sock()
        return Response(
            run_sim(request.get_json(force=True), sock), mimetype="application/json"
        )

    # build from simplified model, as in https://github.com/alisww/yuuko/blob/main/yuuko/clockwork/salmon.py
    @app.route("/simple_sim", methods=["POST"])
    def simplified_sim():
        sock = get_sock()

        return Response(
            run_simple_sim(request.get_json(force=True), sock),
            mimetype="application/json",
        )

    @app.route("/batch_simple_sim", methods=["POST"])
    def batch_simplified_sim():
        sock = get_sock()
        data = request.get_json(force=True)

        return Response(
            json.dumps([json.loads(run_simple_sim(config, sock)) for config in data]),
            mimetype="application/json",
        )

    return app
