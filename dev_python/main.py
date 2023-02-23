import os
from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import nltk
import spacy
import pke
from spacy.lang import ja
import json


app = FastAPI()


def create_certificate():
    # /app/credecial.jsonに秘密鍵を入れておく
    cred = credentials.Certificate("/app/credencial.json")
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://semiotic-bloom-378113-default-rtdb.firebaseio.com/", # データベースのurl
    })


def get_texts(id):
    ref = db.reference(f"/{id}")
    ref = ref.child("texts") 

    text_data = ref.get()
    if text_data is None:
        return []

    text_list = [{"text": text_data[i]["content"], "group": text_data[i]["group"]} for i in sorted(text_data)] 

    # text_list = []
    # text_list.append({"text": "神奈川県横須賀市とJCB、トッパン・フォームズは、大規模な災害発生による通信障害や電源途絶を想定し、マイナンバーカードアプリケーション搭載システムを活用したオフライン環境下でのキャッシュレス決済システムの実証実験を横須賀市で開始する。開始時期は2023年3月11日以降。", "group": 0})  
    # text_list.append({"text": "今年4月以降、マイナンバーカードを保険証として利用するためのシステムの導入を医療機関が義務付けられているのは違法だとして都内の医師ら274人が国に対して、義務がないことの確認を求める訴えを起こしました。", "group": 1})
    # text_list.append({"text": "4月に札幌市である主要7カ国（G7）気候・エネルギー・環境相会合で、議長国日本がとりまとめる共同声明の「たたき台」が判明した。東京電力福島第一原発の処理水問題について「放出に向けた透明性のあるプロセスを歓迎する」、除染土を再利用する計画の「進捗（しんちょく）を歓迎する」とする表現を盛り込もうと、各国と調整している。いずれも国内で慎重論が根強い問題だが、主要国の支持を得る狙いがあるとみられる。", "group": 2})


    return text_list

create_certificate()

pke.base.stopwords['ja_ginza_electra'] = 'japanese'
stopwords = list(ja.STOP_WORDS)
nltk.corpus.stopwords.words_org = nltk.corpus.stopwords.words
nltk.corpus.stopwords.words = lambda lang : stopwords if lang == 'japanese' else nltk.corpus.stopwords.words_olg(lang)
nlp = spacy.load("ja_ginza")

# 入力された文章のキーワードを1つ抽出
def extract_phrases(text):
    extractor = pke.unsupervised.TopicRank()
    extractor.load_document(input=text, language='ja', normalization=None)
    extractor.candidate_selection(pos={"NOUN", "PROPN", "ADJ", "NUM"})
    extractor.candidate_weighting()

    kwds_scrs = extractor.get_n_best(n=5)

    # print(kwds_scrs)

    return kwds_scrs[0][0] if len(kwds_scrs) else ""


# 入力された2つの文章の関連度を算出（精度はわからない）
def get_similarity(s1, s2):
    doc1 = nlp(s1)
    doc2 = nlp(s2)
    return doc1.similarity(doc2)


# 文字列が入った配列 → nodesとlinksを作る
def make_graph_data(strs):
    nodes = []
    links = []
    keywords = [extract_phrases(text_data["text"]) for text_data in strs]
    for i, word in enumerate(keywords):
        if not word:
            continue
        for i_node in range(len(nodes)):
            if nodes[i_node]["id"] == word:
                nodes[i_node]["texts"].append(strs[i]["text"])
                break
        else:
            node = {"id": word, "group": strs[i]["group"], "texts": [strs[i]["text"]]}
            nodes.append(node)
    # print(keywords)
    for i in range(len(nodes)):
        for j in range(i+1, len(nodes)):
            similarity = get_similarity(nodes[i]["texts"][0], nodes[j]["texts"][0])
            if similarity >= 0.1: # ある程度関連度がある場合
                link = {"source": nodes[i]["id"], "target": nodes[j]["id"], "value": similarity}
                links.append(link)
    return {"nodes": json.dumps(nodes, ensure_ascii=False), "links": json.dumps(links, ensure_ascii=False)}


@app.get("/")
def main(id: str):
    text_list = get_texts(id)
    if not text_list:
        return {"nodes": json.dumps({}), "links": json.dumps({})}

    print("start to make graph")
    graph_data = make_graph_data(text_list)

    return graph_data


# text_list = get_texts("0de85ff5-d569-4ebe-a2d0-5a9a4e723238")
# print(text_list)