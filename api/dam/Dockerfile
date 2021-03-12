FROM debian:bullseye

RUN ["apt-get", "update"]
RUN ["apt-get", "install","git","python3","python3-zmq","python3-pip","wget","--no-install-recommends","-y"]
RUN ["apt-get","dist-upgrade","-y"]
RUN ["dpkg", "--add-architecture", "i386"]
RUN ["apt-get", "update"]
RUN ["apt-get","install", "wine", "wine32","--no-install-recommends","-y"]

RUN useradd --create-home --shell /bin/bash crisp

# this is sinful
COPY requirements.txt /root/requirements.txt
RUN ["python3","-m","pip","install","-r","/root/requirements.txt"] 

USER crisp

COPY dam.py /home/crisp/dam.py
COPY requirements.txt /home/crisp/requirements.txt
COPY broker.ini /home/crisp/broker.ini
COPY crisp.exe /home/crisp/crisp.exe
WORKDIR /home/crisp/
RUN winecfg

CMD ["python3","dam.py"]
