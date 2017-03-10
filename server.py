from flask import Flask, render_template, request, jsonify
import math
import random
import database_helper as dh
import json

app = Flask(__name__,static_folder='static', static_url_path='')


@app.route('/', methods=['GET'])
def index():
    return render_template('client.html')


@app.route('/SignIn', methods=['POST'])
def sign_in():

    email = request.form['email']
    password = request.form['password']

    if (dh.find_user(email) is True):
        if(dh.get_psw(email) == password):
            if(dh.find_token(email) is False):
                letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
                token = ""
                i = 0
                while i < 36:
                    token = token +letters[int(math.floor(random.randint(0, len(letters)-1)))]
                    i=i+1
                token.join(token)
                dh.insert_token(email, token)
                return  json.dumps({"success": True, "message": "Successfully signed in.", "data": token})
            else:
                return json.dumps({"success": False, "message": "Already signed in."})
        else:
            return json.dumps({"success": False, "message": "Wrong username or password."})
    else:
        return json.dumps({"success": False, "message": "Wrong username or password."})



@app.route('/SignUp', methods=['POST'])
def sign_up():

    email = request.form['email']
    password = request.form['password']
    firstname = request.form['firstname']
    familyname = request.form['familyname']
    gender = request.form['gender']
    city = request.form['city']
    country = request.form['country']

    if (dh.find_user(email) is not True):

        if ((type(email)== unicode) & (type(password)== unicode) & (type(firstname)== unicode) & (type(familyname)== unicode) & (type(gender)==unicode) & (type(city)== unicode) & (type(country)==unicode)):

            dh.insert_user(email, password, firstname, familyname, gender, city, country)
            return json.dumps({"success": True, "message": "Successfully created a new user."})

        else:
            return json.dumps({"success": False, "message": "Form data missing or incorrect type."})

    else:
        return json.dumps({"success": False, "message": "User already exists."})


@app.route('/SignOut', methods=['POST'])
def sign_out():

    token = request.form['token']
    tok ="".join(token)
    if(dh.get_user(tok) is not None):
        dh.delete_token(dh.get_user(tok)["Email"])
        return json.dumps({"success": True, "message": "Successfully signed out."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})


@app.route('/ChangePSW', methods=['POST'])
def change_password():

    token = request.form['token']
    old_password = request.form['old_password']
    new_password = request.form['new_password']

    if (dh.get_user(token)["Email"] is not None):
        if(dh.get_psw_t(token) == old_password):
            dh.insert_PW(token, new_password)
            return json.dumps({"success": True, "message": "Password changed."})
        else:
            return json.dumps({"success": False, "message": "Wrong password."})
    else:
        return json.dumps({"success": False, "message": "You are not logged in."})




@app.route('/GetUDatabyT', methods=['POST'])
def get_user_data_by_token():

    token = request.form['token']
    if (dh.get_user(token)["Email"] is not None):
        return json.dumps({"success": True, "message": "User data retrieved.", "data": dh.get_user(token)})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})



@app.route('/GetUDatabyE', methods=['POST'])
def get_user_data_by_email():

    email = request.form['email']
    token = request.form['token']

    if(dh.get_user(token)["Email"] is not None):
        if(dh.get_user_email(email) is not None):
            match = dh.get_user_email(email)
            return json.dumps({"success": True, "message": "User data retrieved.", "data": match})
        else:
            return json.dumps({"success": False, "message": "No such user."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})



@app.route('/GetUMesbyT', methods=['POST'])
def get_user_messages_by_token():

    token = request.form['token']
    if(dh.get_user(token)["Email"] is not None):
        if (dh.find_user(dh.get_user(token)["Email"])):
            return json.dumps({"data": dh.get_messages_by_token(token), "success": True, "message": "Data received."})
        else:
            return json.dumps({"success": False, "message": "No data for this user.", "data": None})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})


@app.route('/GetUMesbyE', methods=['POST'])
def get_user_messages_by_email():

    email = request.form['email']
    token = request.form['token']
    if (dh.get_user(token)["Email"] is not None):
        if(dh.get_messages_by_token(token) is not None):
            return json.dumps({"data": dh.get_messages(email), "success": True, "message": "Data received."})
        else:
            return json.dumps({"success": False, "message": "No data for this user.", "data": None})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})


@app.route('/POSTMes', methods=['POST'])
def post_message():

        token = request.form['token']
        recemail = request.form['emailR']
        message = request.form['message']

        if(dh.get_user(token) is not None):
            if(recemail is not None):
                writer = dh.get_user(token)["Email"]
                recipient = recemail
                dh.insert_message(writer, recipient, message)
                return json.dumps({"success": True, "message": "Message posted"})
            else:
                return json.dumps({"success": False, "message": "No such user."})
        else:
            return json.dumps({"success": False, "message": "You are not signed in."})




if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
