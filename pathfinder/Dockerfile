FROM python:3.9-alpine
ENV PYTHONUNBUFFERED 1

WORKDIR /pathfinder
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
COPY ./entrypoint.sh /
ENTRYPOINT ["sh", "entrypoint.sh"]

RUN apk update
RUN apk add
RUN apk add npm
COPY ./frontend/package.json /frontend/package.json
COPY ./frontend/package-lock.json  /frontend/package-lock.json
RUN cd frontend/ && npm install
RUN cd frontend/ && pwd