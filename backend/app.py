from flask import Flask

app = Flask(__name__)

@app.route("/")
def yo_world():
    return "<p>Yo, World!</p>"

@app.route("/world")
def hello_world():
    return "<p>Hello, World!</p>"