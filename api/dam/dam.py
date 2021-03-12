import threading
import zmq
import configparser
import json
from salmon_lib import Sim
import logging

def sim_thread(url, crisp_path, wine_path, context=None):
    context = context or zmq.Context.instance()
    # Socket to talk to dispatcher
    socket = context.socket(zmq.REP)

    socket.connect(url)

    while True:
        try:
            obj = socket.recv_json()
            with open("aaa.json","w") as f:
                f.write(json.dumps(obj))
            logging.debug('recv')
            sim = Sim()
            logging.debug('here?')
            sim.from_sibr_conf(obj)
            logging.debug(sim.__dict__)
            res = sim.run(crisp_path,wine_path=wine_path)
            logging.debug(res)
            if res[0].returncode != 0:
                socket.send_string(json.dumps({"err": True}))
            else:
                socket.send_string(json.dumps(res[1]))
        except Exception as e:
            pass 
def main():
    # broker/dam 
    logging.basicConfig(level=logging.DEBUG,format='%(relativeCreated)6d %(threadName)s %(message)s',filename='please.log',filemode='w')
    logging.debug("configuring server<->crisp broker")
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
        logging.debug("Starting simulator thread #" + str(i))
        thread = threading.Thread(target=sim_thread, args=(url_worker,config['broker']['crisp'],config['broker'].get('wine_path','wine32')))
        thread.daemon = True
        thread.start()

    logging.debug("Starting server<-> crisp broker")

    zmq.proxy(clients, workers)

    # for niceness
    clients.close()
    workers.close()
    context.term()


if __name__ == "__main__":
    main()
