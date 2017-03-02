import sqlite3 as sql

from flask import Flask
import unicodedata


DATABASE = '/home/jonasbrueckner/PycharmProjects/LAB2/database.db'
DATABASE_Help='/home/jonasbrueckner/PycharmProjects/LAB2/database.schema'

app = Flask(__name__)

@app.route("/help")
def get_user_email(email):
    user = None
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Client WHERE Email=?", (email))
    for row in cur.fetchall():
        firstName = str(row[0])
        familyName = str(row[1])
        gender = str(row[2])
        city = str(row[3])
        country = str(row[4])
        emailU = str(row[5])
        psw = str(row[6])
        user = {firstName, familyName, gender, city, country, emailU, psw}
    con.commit()
    cur.close()
    con.close()
    return user


def get_user(token):
    user = None
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Client WHERE Token=?", (token))
    for row in cur.fetchall():
        firstName = str(row[0])
        familyName = str(row[1])
        gender = str(row[2])
        city = str(row[3])
        country = str(row[4])
        emailU = str(row[5])
        psw = str(row[6])
        token = str(row[7])
        user = [firstName, familyName, gender, city, country, emailU, psw, token]
    con.commit()
    cur.close()
    con.close()
    return user


def get_messages(email):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Messages WHERE Writer=?", (email))
    con.commit()
    cur.close()
    con.close()


def get_messages_by_token(token):
    writer = get_user(token).emailU
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Messages WHERE Writer=?", (writer))
    con.commit()
    cur.close()
    con.close()


def find_user(email):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    row = cur.fetchall()
    if(row is not None):
        user = cur.executescript("SELECT * FROM Client WHERE Email='%s'" % email)
        print user
        if (user.arraysize is not 0):
            return True
    con.commit()
    cur.close()
    con.close()
    return False


def find_token(email):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT Token FROM Client WHERE Email=?", (email))
    con.commit()
    cur.close()
    con.close()
    return True


def delete_user(email):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("DELETE FROM Client WHERE Email=?",(email))
    con.commit()
    cur.close()
    con.close()
    return True


def insert_message(emailW, emailR, msg):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("INSERT INTO Messages (Writer, Receiver, Message)""VALUES (?,?,?)",(emailW, emailR, msg))
    con.commit()
    cur.close()
    con.close()
    return True


def delete_token(email):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("Update Client SET Token=NULL WHERE Email=?", (email))
    con.commit()
    cur.close()
    con.close()
    return True


def insert_user(email, password, firstname, familyname, gender, city, country):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    print email
    print password
    print firstname
    print familyname
    print gender
    print city
    print country
    cur.execute("INSERT INTO Client (FirstName, FamilyName, Gender, City, Country, Email, PSW) VALUES (?, ?, ?, ?, ?, ?, ?)",(firstname, familyname, gender, city, country, email, password))
    con.commit()
    con.close()
    return True


def insert_token(token):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("INSERT INTO Client (Token)""VALUES (?)",(token))
    con.commit()
    con.close()
    return True
