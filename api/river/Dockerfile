FROM alpine:3.12.1
WORKDIR /root/

RUN ["apk", "--update-cache", "add", "bash", "python3", "python3-dev", "uwsgi", "libuuid", "libcap-dev", "libpcre32", "py3-pip", "uwsgi-python3", "py3-pyzmq"]
SHELL ["bash","-c"]

# alis why
COPY requirements.txt /root/requirements.txt
RUN python3 -m pip install -r requirements.txt

RUN adduser -D -g '' river
USER river

WORKDIR /home/river

COPY river.ini /home/river/river.ini
COPY river.py /home/river/river.py
COPY server.ini /home/river/server.ini
COPY wsgi.py /home/river/wsgi.py

CMD ["uwsgi","server.ini"]