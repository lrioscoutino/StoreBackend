FROM python:3.6-alpine

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV FLASK_APP=manage.py
ENV FLASK_RUN_HOST=0.0.0.0

# install dependencies
RUN pip install --upgrade pip
RUN apk add build-base gcc musl-dev python3-dev libffi-dev openssl-dev make postgresql-dev

RUN mkdir /usr/src/app/
WORKDIR /usr/src/app/
COPY . /usr/src/app/

EXPOSE 5000
RUN pip install -r requirements.txt

CMD ["python", "manage.py" ]