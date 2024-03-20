from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import relationship

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
socketio = SocketIO(app)
db = SQLAlchemy(app)

class Message(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  message_id = db.Column(db.String(200), nullable=False)
  message = db.Column(db.String(200), nullable=False)
  user_id = db.Column(db.String(200), nullable=False)
  user_name = db.Column(db.String(200), nullable=False)
  createdAt = db.Column(db.DateTime, default=datetime.now)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)

@socketio.on('connect')
def connect():
   print('client connected')

@socketio.on('disconnect')
def disconnect():
   print('client disconnected')

@socketio.on('message')
def handle_message(data):
  print('handle message')
  newMessage = Message(
    message = data['message'],
    message_id = data['id'],
    user_id = data['userId'],
    user_name = data['userName']
  )
  db.session.add(newMessage)
  db.session.commit()
  allMessages = Message.query.order_by(Message.createdAt.desc()).all()
  history = [
     {
        'id': msg.message_id,
        'text': msg.message,
        'createdAt': datetime.strftime(msg.createdAt, '%Y-%m-%d %H:%M:%S'),
        'userId': msg.user_id,
        'userName': msg.user_name
      }
  for msg in allMessages]
  socketio.emit('message', history)


if __name__ == '__main__':
    with app.app_context():
      db.create_all()
    socketio.run(app, host='0.0.0.0', debug=True, port=8000)