import threading
import zmq
import configparser
import json
from salmon_lib import Sim

def sim_thread(url, crisp_path, wine_path, context=None):
    context = context or zmq.Context.instance()
    # Socket to talk to dispatcher
    socket = context.socket(zmq.REP)

    socket.connect(url)

    while True:
        try:
            obj = socket.recv_json()
            sim = Sim()
            sim.from_sibr_conf(obj)
            res = sim.run(crisp_path,wine_path=wine_path)
            if res[0].returncode != 0:
                socket.send_string(json.dumps({"err": True}))
            else:
                socket.send_string(json.dumps(res[1]))
        except Exception as e:
            pass 
def main():
    # broker/dam 
    print("configuring server<->crisp broker")
    config = configparser.ConfigParser()
    config.read('broker.ini')

    url_worker = "inproc://workers"
    url_client = config['broker'].get('url','tcp://*:5555')

    # zmq context
    context = zmq.Context.instance()

    # client endpoint
    clients = context.socket(zmq.ROUTER)
    clients.bind(url_client)

    # threads endpoint
    workers = context.socket(zmq.DEALER)
    workers.bind(url_worker)

    # launch threads
    for i in range(config['broker'].getint('threads',4)):
        print("Starting simulator thread #" + str(i))
        thread = threading.Thread(target=sim_thread, args=(url_worker,config['broker']['crisp'],config['broker'].get('wine_path','wine32')))
        thread.daemon = True
        thread.start()

    print("Starting server<-> crisp broker")

    zmq.proxy(clients, workers)

    # for niceness
    clients.close()
    workers.close()
    context.term()


if __name__ == "__main__":
    main()