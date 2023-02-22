import os
import functions_framework
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


def create_certificate():
    # 関数のデプロイ時に環境変数をセットしておく
    #     cred_key = <秘密鍵の中身>
    key = os.environ["cred_key"]
    with open("/tmp/credencial.json", mode="w") as f:
        f.write(key)
    
    cred = credentials.Certificate("/tmp/credencial.json")

    firebase_admin.initialize_app(cred, {
        "databaseURL": "",
            'databaseAuthVariableOverride': {
            'uid': 'my-service-worker' # 必要なら入れる
        }
    })


def get_texts():
    ref = db.reference("/resource") # データベースへのパス
    ref = ref.child("child")

    text_data = ref.get()

    # ここに適切な処理を入れる
    text_list = text_data

    return text_list


# キーワード抽出になる
def _nlp(text):
    print(text)


@functions_framework.http
def main(request):
    create_certificate()
    text_list = get_texts()
    for text in text_list:
        _nlp(text_list[text])

    return {"result": "success"} # nodeやlinkとかが入ったjson文字列になる？

