from flask import Flask, render_template, request
import math
import random
import database_helper as dh
import json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('client.html')


@app.route('/SignIn/<email>/<password>')
def sign_in(email, password):
    if (dh.find_user(email) == True & dh.get_user_email(email).psw == password):
        letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        token = ""
        i = 0
        while i < 36:
            token += letters[math.floor(random.randint(0, len(letters)))]
        return json.dump({"success": True, "message": "Successfully signed in.", "data": token}, fp=list)
    else:
        return json.dump({"success": False, "message": "Wrong username or password."}, fp=list)


@app.route('/SignUp/<email>/<password>/<firstname>/<familyname>/<gender>/<city>/<country>', methods=['GET', 'POST'])
def sign_up(email, password, firstname, familyname, gender, city, country):

    if (dh.find_user(email) != True):
        print email
        print password
        print firstname
        print familyname
        print gender
        print city
        print country
        if ((type(email)== unicode) & (type(password)== unicode) & (type(firstname)== unicode) & (type(familyname)== unicode) & (type(gender)==unicode) & (type(city)== unicode) & (type(country)==unicode)):
            dh.insert_user(email, password, firstname, familyname, gender, city, country)
            return json.dumps({"success": True, "message": "Successfully created a new user."})
        else:
            return json.dumps({"success": False, "message": "Form data missing or incorrect type."})
    else:
        return json.dumps({"success": False, "message": "User already exists."})


@app.route('/SignOut')
def sign_out(token):
    if(dh.get_user(token) != None):
        dh.delete_token(dh.get_user(token).emailU)
        return json.dump({"success": True, "message": "Successfully signed out."}, fp=list)
    else:
        return json.dump({"success": False, "message": "You are not signed in."}, fp=list)

@app.route('/ChangePSW')
def change_password(token, old_password, new_password):
    if (dh.get_user(token) != None):
        if(dh.get_user(token).psw == old_password):
            dh.get_user(token).psw = new_password
            return json.dump({"success": True, "message": "Password changed."}, fp=list)
        else:
            return json.dump({"success": False, "message": "Wrong password."}, fp=list)
    else:
        return json.dump({"success": False, "message": "You are not logged in."}, fp=list)


@app.route('/GetUDatabyT')
def get_user_data_by_token(token):
    return json.dump(dh.get_user(token), fp=dict)

@app.route('/GetUDatabyE')
def get_user_data_by_email(token, email):
    if(dh.get_user(token) != None):
        if(dh.get_user_email(email) != None):
            match = dh.get_user_email(email)
            match.psw = None
            return json.dump({"success": True, "message": "User data retrieved.", "data": match}, fp=list)
        else:
            return json.dump({"success": False, "message": "No such user."},fp=list)
    else:
        return json.dump({"success": False, "message": "You are not signed in."}, fp=list)

@app.route('/GetUMesbyT')
def get_user_messages_by_token(token):
    if (dh.find_user(dh.get_user(token).emailU)):
        return json.dump(dh.get_messages_by_token(token), fp=dict)
    else:
        return json.dump(None, fp=None)

@app.route('/GetUMesbyE')
def get_user_messages_by_email(token, email):
    if(dh.get_messages_by_token(token) != None):
        return json.dump(dh.get_messages(email), fp=dict)
    else:
        return json.dump(None, fp=None)

@app.route('/POSTMes')
def post_message(token, message, email):
    fromEmail = dh.get_user(token).emailU;
    if(fromEmail is not None):
        if(email is None):
            email = fromEmail
        if(dh.get_user_email(email) is not None):
            recipient = dh.get_user_email(email)
            dh.insert_message(fromEmail, recipient, message)
            return json.dump({"success": True, "message": "Message posted"}, fp=list)
        else:
            return json.dump({"success": False, "message": "No such user."}, fp=list)
    else:
        return json.dump({"success": False, "message": "You are not signed in."}, fp=list)


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
