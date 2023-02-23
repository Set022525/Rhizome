FROM ubuntu:20.04

RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Tokyo 

RUN apt-get update && apt-get install -y \
    openssh-client \
    git \
    python3.8 \
    swig3.0 \
    build-essential \
    python3-pip \
    curl \
    locales \
    default-libmysqlclient-dev \
    && locale-gen en_US.UTF-8

RUN apt-get autoremove -y &&\
    apt-get clean &&\
    rm -rf /usr/local/src/*

# ENV LANG=en_US.UTF-8
# ENV LANGUAGE=en_US:en
# ENV LC_ALL=en_US.UTF-8
ENV PYTHONPATH=/app/utils:$PYTHONPATH

WORKDIR /app

COPY . ./

RUN pip install -U pip &&\
    pip install --no-cache-dir -r requirements.txt
    
EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]