from flask import Flask, request, jsonify

from ru_word_model import is_real_ru_word
from eng_word_model import is_real_eng_word


app = Flask(__name__)


@app.route('/lifecheck', methods=['GET'])
def live():
    return "ok"


@app.route('/check_words', methods=['POST'])
def check_words():
    words = request.json

    ru_letters = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюя'
    eng_letters = 'qwertyuiopasdfghjklzxcvbnm'

    results = []

    for sentence in words:
        ok_sentence = 1
        for word in sentence.split(' '):
            ru_word = False
            eng_word = False
            for letter in list(word):
                if letter in ru_letters:
                    ru_word = True
                elif letter in eng_letters:
                    eng_word = True
            if (ru_word and eng_word) or (not ru_word and not eng_word):
                ok_sentence = 0
                break
            if ru_word:
                word_res = int(is_real_ru_word(word))
                if word_res == 0:
                    ok_sentence = 0
                    break
            elif eng_word:
                word_res = int(is_real_eng_word(word))
                if (word_res == 0):
                    ok_sentence = 0
                    break
        results.append(int(ok_sentence))
    return jsonify(results)


if __name__ == '__main__':
    app.run(host='localhost', port=8079)
