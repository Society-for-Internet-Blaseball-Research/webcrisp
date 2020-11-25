# containers & mechanisms
`dam` -> this is the container actually running the CRiSP simulations with wine; it connects to `river` via zmq.
`river` -> flask webserver under UWSGI, connects to dam to get simulation results
`nginx` -> reserve proxy