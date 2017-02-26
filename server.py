import os
from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, flash
import math
import random
# import sqlite3 as sql
import database_helper as dh

app = Flask(__name__)

users=None
loggedInUsers=None

@app.route("/")
def main():
    return render_template('client.html')

def sign_in(email, password):
    if (dh.find_user(email) == True):
        letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        token = ""
        i = 0
        while i < 36:
            token += letters[math.floor(random.randint(0, len(letters)))]
        return {"success": True, "message": "Successfully signed in.", "data": token}
    else:
        return {"success": False, "message": "Wrong username or password."}


def sign_up(email, password, firstname, familyname, gender, city, country):

    if (dh.find_user(email) == None):
        if ((type(email)=='str') & (type(password)=='str') & (type(firstname)=='str') & (type(familyname)=='str') & (type(gender)=='str') & (type(city)=='str') & (type(country)=='str')):
            dh.insert_user(email, password, firstname, familyname, gender, city, country)
            return {"success": True, "message": "Successfully created a new user."}
        else:
            return {"success": False, "message": "Form data missing or incorrect type."}
    else:
        return {"success": False, "message": "User already exists."}


def sign_out(token):
    if(dh.get_user(token) != None):
        dh.delete_token(dh.get_user(token).emailU)
        return {"success": True, "message": "Successfully signed out."}
    else:
        return {"success": False, "message": "You are not signed in."}


def change_password(token, old_password, new_password):
    if (dh.get_user(token) != None):
        if(dh.get_user(token).psw == old_password):
            dh.get_user(token).psw = new_password
            return {"success": True, "message": "Password changed."}
        else:
            return {"success": False, "message": "Wrong password."}
    else:
        return {"success": False, "message": "You are not logged in."}


def get_user_data_by_token(token):
    return dh.get_user(token)


def get_user_data_by_email(token, email):
    if(dh.get_user(token) != None):
        if(dh.get_user_email(email) != None):
            match = dh.get_user_email(email)
            match.psw = None
            return {"success": True, "message": "User data retrieved.", "data": match};
        else:
            return {"success": False, "message": "No such user."};
    else:
        return {"success": False, "message": "You are not signed in."};


def get_user_messages_by_token(token):
    if (dh.find_user(dh.get_user(token).emailU)):
        return dh.get_messages_by_token(token)
    else:
        return None

def get_user_messages_by_email(token, email):
    if(dh.get_messages_by_token(token) != None):
        return dh.get_messages(email)
    else:
        return None


def post_message(token, message, email):
    fromEmail = dh.get_user(token).emailU;
    if(fromEmail is not None):
        if(email is None):
            email = fromEmail
        if(dh.get_user_email(email) is not None):
            recipient = dh.get_user_email(email)
            dh.insert_message(fromEmail, recipient, message)
            return {"success": True, "message": "Message posted"};
        else:
            return {"success": False, "message": "No such user."};
    else:
        return {"success": False, "message": "You are not signed in."};
