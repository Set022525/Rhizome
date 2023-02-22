# extract_keywords.pyにいくつか処理を追加

import nltk
import spacy
import pke
from spacy.lang import ja


pke.base.stopwords['ja_ginza_electra'] = 'japanese'
stopwords = list(ja.STOP_WORDS)
nltk.corpus.stopwords.words_org = nltk.corpus.stopwords.words
nltk.corpus.stopwords.words = lambda lang : stopwords if lang == 'japanese' else nltk.corpus.stopwords.words_olg(lang)
nlp = spacy.load("ja_ginza")

# 入力された文章のキーワードを1つ抽出
def extract_phrases(text):
  extractor = pke.unsupervised.TopicRank()
  # extractor = pke.unsupervised.MultipartiteRank()
  extractor.load_document(input=text, language='ja', normalization=None)
  extractor.candidate_selection(pos={"NOUN", "PROPN", "ADJ", "NUM"})
  extractor.candidate_weighting()

  kwds_scrs = extractor.get_n_best(n=5)

  print(kwds_scrs)

  return kwds_scrs[0][0]


# 入力された2つの文章の関連度を算出（精度はわからない）
def get_similarity(s1, s2):
  doc1 = nlp(s1)
  doc2 = nlp(s2)
  return doc1.similarity(doc2)


# 文字列が入った配列 → nodesとlinksを作る
def main(strs):
  nodes = []
  links = []
  keywords = [extract_phrases(text) for text in strs]
  for i, word in enumerate(keywords): # 暫定的に、文字列のインデックスをgroupとする
    node = {"id": word, "group": i, "text": strs[i]}
    nodes.append(node)
  # print(keywords)
  for i in range(len(strs)):
    for j in range(i+1, len(strs)):
      similarity = get_similarity(strs[i], strs[j])
      if similarity >= 0.1: # ある程度関連度がある場合
        link = {"source": keywords[i], "target": keywords[j], "value": similarity}
        links.append(link)
  return {"nodes": nodes, "links": links}

strs = []
strs.append("神奈川県横須賀市とJCB、トッパン・フォームズは、大規模な災害発生による通信障害や電源途絶を想定し、マイナンバーカードアプリケーション搭載システムを活用したオフライン環境下でのキャッシュレス決済システムの実証実験を横須賀市で開始する。開始時期は2023年3月11日以降。")
strs.append("今年4月以降、マイナンバーカードを保険証として利用するためのシステムの導入を医療機関が義務付けられているのは違法だとして都内の医師ら274人が国に対して、義務がないことの確認を求める訴えを起こしました。")
strs.append("4月に札幌市である主要7カ国（G7）気候・エネルギー・環境相会合で、議長国日本がとりまとめる共同声明の「たたき台」が判明した。東京電力福島第一原発の処理水問題について「放出に向けた透明性のあるプロセスを歓迎する」、除染土を再利用する計画の「進捗（しんちょく）を歓迎する」とする表現を盛り込もうと、各国と調整している。いずれも国内で慎重論が根強い問題だが、主要国の支持を得る狙いがあるとみられる。")


print(main(strs))