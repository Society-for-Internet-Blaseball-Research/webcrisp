#!/bin/bash
docker build -t salmon/dam dam/
docker build -t salmon/river river/
docker build -t salmon/nginx nginx/