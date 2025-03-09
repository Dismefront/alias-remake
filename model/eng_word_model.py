import nltk
from nltk.corpus import words
import random
import string
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB


nltk.download('words')


real_words = set(words.words())


def generate_gibberish_word():
    length = random.randint(3, 10)
    return ''.join(random.choices(string.ascii_lowercase, k=length))


gibberish_words = {generate_gibberish_word() for _ in range(len(real_words) // 10)}


data = list(real_words) + list(gibberish_words)
labels = [1] * len(real_words) + [0] * len(gibberish_words)


vectorizer = CountVectorizer(analyzer='char', ngram_range=(2, 3))
X = vectorizer.fit_transform(data)
Y = labels


X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)


model = MultinomialNB()
model.fit(X_train, Y_train)


def is_real_eng_word(word):
    word_features = vectorizer.transform([word])
    prediction = model.predict(word_features)[0]
    return prediction
