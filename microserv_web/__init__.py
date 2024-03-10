from flask import Flask

app=Flask(__name__)

app.config['SECRET_KEY'] = 'MySecretKey'

from microserv_web import routes