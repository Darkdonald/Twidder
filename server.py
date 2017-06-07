from flask import Flask, render_template, request, jsonify
from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer
from gevent import wsgi
import math
import random
import database_helper as dh
import os
from flask_bcrypt import generate_password_hash
from flask_bcrypt import check_password_hash
import binascii

app = Flask(__name__,static_folder='static', static_url_path='/static')

ws_list = {}
counter_list = {}


@app.before_first_request
def run_at_start():
    global counter_list
    counter_list['number_ws'] = 0 #Counter active websockets = number of users who are online
    counter_list['number_accounts'] = dh.count('Client','Email') #dh.count(table,row):Number of SigndUp Users / number of existing accounts
    counter_list['number_messages_receive'] = 0
    counter_list['number_messages_send'] = 0

@app.route('/', methods=['GET'])
def index():
    return render_template('client.html')



@app.route("/api")
def api():
    global ws_list #dicionary with websockets global definded
    global counter_list
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket'] #name of websocket

        while True:
            message = ws.receive() #message could be the token (SignIn/Up) or "logout" (logout-function)
            if message == "logout":
                counter_list['number_ws']=counter_list['number_ws']-1
                sendCounter('number_ws')
                return "logout"

            counter_list['number_ws'] = counter_list['number_ws'] + 1

            email = dh.get_user(message)["Email"]
            ws.send('{"content": "connected", "counter":'+str(counter_list['number_ws'])+'}') #user will be logged in
            if email in ws_list:
                ws_list[email].send('{"content": "get_out", "counter":'+str(counter_list['number_ws'])+'}') #send to Websocket: log out user on other device

            ws_list[email] = ws #assign new websocket
            update_all()  # update all couter values (logged in and Signed up users) of every active user



    return ("api close")

def update_all():
    sendCounter('number_accounts')
    sendCounter('number_ws')
    sendCounter('number_messages_receive')
    sendCounter('number_messages_send')


def sendCounter(listName):
    #update counter
    message = '{"content": "Counter sended correctly", "variable": "'+listName+'", "value":'+str(counter_list[listName])+'}'
    for websocket in ws_list.values(): #update counters for all websockets
        websocket.send(message)  #send updated numbers through websocket





@app.route('/SignIn', methods=['POST'])
def sign_in():
        global counter_list
        email = request.form['email']
        password = request.form['password']
        if (dh.find_user(email) is True):
            pswsalt= password + dh.get_salt(email)
            if check_password_hash(dh.get_hash(email), pswsalt) == True:

                if(dh.find_token(email) is False):
                    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890" #create token
                    token = ""
                    i = 0
                    while i < 36:
                        token = token +letters[int(math.floor(random.randint(0, len(letters)-1)))]
                        i=i+1
                    token.join(token)
                    dh.insert_token(email, token)
                    counter_list['number_messages_receive']=dh.count_messages(str(email),'Receiver') #Count messages where email = receiver
                    counter_list['number_messages_send'] = dh.count_messages(str(email), 'Writer') #Count messages where email = writer

                    return jsonify({"success": True, "message": "Successfully signed in", "data": token})
                else:
                    return jsonify({"success": False, "message": "Already signed in.", "data": "No Token"})
            else:
                return jsonify({"success": False, "message": "Wrong password.", "data": "No Token"})
        else:
            return jsonify({"success": False, "message": "Wrong username.", "data": "No Token"})


@app.route('/SignUp', methods=['POST'])
def sign_up():

        global counter_list
        email = request.form['email']
        password = request.form['password']
        firstname = request.form['firstname']
        familyname = request.form['familyname']
        gender = request.form['gender']
        city = request.form['city']
        country = request.form['country']

        if dh.find_user(email) is not True:
            salt = os.urandom(32)
            i = 0
            saltF = ""
            while i < 32:
                saltF = saltF + binascii.hexlify(salt[i])
                i += 1
            pswsalt= password + saltF
            pswsalt = str(pswsalt)
            hashcode = generate_password_hash(pswsalt, rounds=4)
            if ((type(email)== unicode) & (type(password)== unicode) & (type(firstname)== unicode) & (type(familyname)== unicode) & (type(gender)==unicode) & (type(city)== unicode) & (type(country)==unicode)):
                dh.insert_user(email, saltF, hashcode, firstname, familyname, gender, city, country)
                counter_list['number_accounts']=counter_list['number_accounts']+1
                sendCounter('number_accounts')

                return jsonify({"success": True, "message": "Successfully created a new user."})
            else:
                return jsonify({"success": False, "message": "Form data missing or incorrect type."})
        else:
            return jsonify({"success": False, "message": "User already exists."})


@app.route('/SignOut', methods=['POST'])
def sign_out():
        global ws_list
        token = request.form['token']
        tok ="".join(token)

        if(dh.get_user(tok) is not None):
            email = dh.get_user(tok)["Email"]
            dh.delete_token(email)

            if email in ws_list: #check if websocket is in dictionary
                ws_list.pop(email) #if key "email" could be found in dictionary, delete websocket out of dictionary
            return jsonify({"success": True, "message": "Successfully signed out."})
        else:
            return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/GetUDatabyT', methods=['POST'])
def get_user_data_by_token():

        token = request.form['token']

        if (dh.get_user(token)["Email"] is not None):
            return jsonify({"success": True, "message": "User data retrieved.", "data": dh.get_user(token)})
        else:
            return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/GetUDatabyE', methods=['POST'])
def get_user_data_by_email():

        token = request.form['token']
        recemail = request.form['email']

        if(dh.get_user(token)["Email"] is not None):

            if(dh.get_user_email(recemail) is not None):

                return jsonify({"success": True, "message": "User data found.", "data": dh.get_user_email(recemail)})

            else:
                return jsonify({"success": False, "message": "No such user."})

        else:
            return jsonify({"success": False, "message": "You are not signed in."})



@app.route('/ChangePSW', methods=['POST'])
def change_password():

        token = request.form['token']
        old_password = request.form['old_password']
        new_password = request.form['new_password']

        if (dh.get_user(token)["Email"] is not None):

            saltnew = os.urandom(32)
            i = 0
            saltF = ""
            while i < 32:
                saltF = saltF + binascii.hexlify(saltnew[i])
                i += 1
            pswsaltnew = new_password + saltF
            pswsaltnew = str(pswsaltnew)

            saltnew = os.urandom(32)
            saltold = dh.get_salt(dh.get_user(token)["Email"])
            pswsalt = old_password + saltold

            if(check_password_hash(dh.get_hash(dh.get_user(token)["Email"]), pswsalt) == True):
                dh.insert_PW(token, saltnew, generate_password_hash(pswsaltnew, rounds=4))
                return jsonify({"success": True, "message": "Password changed."})
            else:
                return jsonify({"success": False, "message": "Wrong password."})
        else:
            return jsonify({"success": False, "message": "You are not logged in."})




@app.route('/GetUMesbyT', methods=['POST'])
def get_user_messages_by_token():

    token = request.form['token']
    email = dh.get_user(token)["Email"];

    if (dh.get_user(token)["Email"] is not None):

        if (dh.find_user(dh.get_user(token)["Email"])):
            counter_list['number_messages_receive'] = dh.count_messages(str(email),'Receiver')  # Count messages where email = receiver
            counter_list['number_messages_send'] = dh.count_messages(str(email),'Writer')  # Count messages where email = writer
            sendCounter('number_messages_send')  # send with websocket
            sendCounter('number_messages_receive') #send with websocket
            return jsonify({"data": dh.get_messages_by_token(token), "success": True, "message": "Messages received."})
        else:
            return jsonify({"success": False, "message": "No data for this user.", "data": None})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/GetUMesbyE', methods=['POST'])
def get_user_messages_by_email():

    token = request.form['token']
    email = request.form['email']
    if (dh.get_user(token)["Email"] is not None):
        if(dh.get_messages_by_token(token) is not None):
            #counter_list['number_messages_receive'] = dh.count_messages(str(email),'Receiver')  # Count messages where email = receiver
            #counter_list['number_messages_send'] = dh.count_messages(str(email),'Writer')  # Count messages where email = writer
            #sendCounter('number_messages_send')  # send with websocket
            #sendCounter('number_messages_receive')  # send with websocket
            return jsonify({"data": dh.get_messages(email), "success": True, "message": "Data received."})

        else:
            return jsonify({"success": False, "message": "No data for this user.", "data": None})

    else:
        return jsonify({"success": False, "message": "You are not signed in."})



@app.route('/POSTMes', methods=['POST'])
def post_message():

        token = request.form['token']
        message = request.form['message']
        recemail = request.form['toemail']


        if(token is not None):

            if(recemail is not None):
                writer = dh.get_user(token)["Email"]
                recepient = recemail
                dh.insert_message(writer,recepient, message)
                counter_list['number_messages_receive'] = dh.count_messages(str(writer),'Receiver')  # Count messages where email = receiver
                counter_list['number_messages_send'] = dh.count_messages(str(writer),'Writer')  # Count messages where email = writer
                sendCounter('number_messages_send')  # send with websocket
                sendCounter('number_messages_receive')  # send with websocket
                return jsonify({"success": True, "message": "Message posted"})

            else:
                return jsonify({"success": False, "message": "No such user."})

        else:
            return jsonify({"success": False, "message": "You are not signed in."})


if __name__ == '__main__':
    app.debug = True
    print "Im running"
    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()

