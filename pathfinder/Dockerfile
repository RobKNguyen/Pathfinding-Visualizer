FROM python:3.8-alpine

ENV PYTHONUNBUFFERED=1
WORKDIR /pathfinder
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .

# WORKDIR /frontend
# RUN pwd

# FROM node:12.18.1
# RUN npm install


# FROM python:3.8-alpine
# WORKDIR /pathfinder


