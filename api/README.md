# containers & mechanisms
`dam` -> this is the container actually running the CRiSP simulations with wine; it connects to `river` via zmq. <br \>
`river` -> flask webserver under UWSGI, connects to dam to get simulation results <br \>
`nginx` -> reserve proxy <br \>