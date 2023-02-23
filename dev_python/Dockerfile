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
    wget \
    zip \
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

RUN pip install -U pip &&\
    pip install --no-cache-dir git+https://github.com/boudinfl/pke.git ginza==5.1.2 ja-ginza==5.1.2 nltk==3.8.1 scipy==1.10.1 functions_framework==3.3.0 firebase_admin==6.1.0 uvicorn fastapi
    
RUN python3 -m spacy download ja_core_news_sm

WORKDIR /root/nltk_data/corpora
RUN wget "https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/stopwords.zip" -O stopwords.zip
RUN unzip stopwords.zip
# RUN python3 -m nltk.downloader stopwords

EXPOSE 8080

WORKDIR /app
COPY . ./

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]