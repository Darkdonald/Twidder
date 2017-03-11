import sqlite3 as sql
from flask import jsonify

DATABASE = 'database.db'


def get_user_email(email):
    user = {"FirstName": None, "FamilyName": None, "Gender": None, "City": None, "Country": None, "Email": None}
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Client WHERE Email='%s'" % email)
    for row in cur.fetchall():
        firstName = row[0]
        familyName = row[1]
        gender = row[2]
        city = row[3]
        country = row[4]
        emailU = row[5]
        user = {"FirstName": firstName, "FamilyName": familyName, "Gender": gender, "City": city, "Country": country, "Email": emailU}
    con.commit()
    cur.close()
    con.close()
    return user

def get_psw(email):
    psw = None
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Client WHERE Email='%s'" % email)
    for row in cur.fetchall():
        psw = row[6]
    con.commit()
    cur.close()
    con.close()
    return psw


def get_token(email):
    token = None
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Client WHERE Email='%s'" % email)
    for row in cur.fetchall():
        token = row[6]
    con.commit()
    cur.close()
    con.close()
    return token


def get_user(token):
    user = {"FirstName": None, "FamilyName": None, "Gender": None, "City": None, "Country": None, "Email": None}
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Client WHERE Token='%s'" % token)
    for row in cur.fetchall():
        firstName = row[0]
        familyName = row[1]
        gender = row[2]
        city = row[3]
        country = row[4]
        emailU = row[5]
        user = {"FirstName": firstName, "FamilyName": familyName, "Gender": gender, "City": city, "Country": country, "Email": emailU}
    con.commit()
    cur.close()
    con.close()
    return user


def get_psw_t(token):
    psw = None
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("SELECT * FROM Client WHERE Token='%s'" % token)
    for row in cur.fetchall():
        psw = row[6]
    con.commit()
    cur.close()
    con.close()
    return psw

def get_messages(email):
    rec = email
    mes = []
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    ex = cur.execute("SELECT * FROM Messages WHERE Receiver='%s'" % rec)
    for row in ex.fetchall():
        mes.append({"Message":row[3], "Writer": row[1]})
    con.commit()
    cur.close()
    con.close()
    return mes


def get_messages_by_token(token):
    rec = get_user(token)["Email"]
    mes = []
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    ex = cur.execute("SELECT * FROM Messages WHERE Receiver='%s'" % rec)
    for row in ex.fetchall():
        mes.append({"Message":row[3], "Writer": row[1]})
    con.commit()
    cur.close()
    con.close()
    return mes

def find_user(email):
    con = sql.connect(DATABASE)
    cur = con.cursor()
    ex = cur.execute("SELECT * FROM Client WHERE Email='%s'" % email)
    i = len(ex.fetchall())
    if(i > 0):
        return True
    con.commit()
    cur.close()
    con.close()
    print("dh; findUserEmail aufgerufen und return false")
    return False


def find_token(email):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    ex = cur.execute("SELECT Token FROM Client WHERE Email='%s'" % email)
    for row in ex.fetchall():
        token=row[0]
    if (token is not None):
        return True
    con.commit()
    cur.close()
    con.close()
    return False


def delete_user(email):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("DELETE FROM Client WHERE Email='%s'" % email)
    con.commit()
    cur.close()
    con.close()
    return True


def insert_message(emailW, emailR, msg):
    con = sql.connect(DATABASE)
    cur = con.cursor()
    cur.execute("INSERT INTO Messages (Writer, Receiver, Message)""VALUES (?,?,?)",(emailW, emailR, msg))
    con.commit()
    cur.close()
    con.close()
    return True


def delete_token(email):
    print("db_helper/delete Token aufgerufen")
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("Update Client SET Token=NULL WHERE Email='%s'" % email)
    con.commit()
    cur.close()
    con.close()
    print("db_helper/delete Token aufgerufen und abgeschlossen")
    return True


def insert_user(email, password, firstname, familyname, gender, city, country):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("INSERT INTO Client (FirstName, FamilyName, Gender, City, Country, Email, PSW) VALUES (?, ?, ?, ?, ?, ?, ?)",(firstname, familyname, gender, city, country, email, password))
    con.commit()
    con.close()
    return True

def insert_token(email, token):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("UPDATE Client SET Token=? WHERE Email=?",(token, email))
    con.commit()
    con.close()
    return True

def insert_PW(token, psw):
    con = sql.connect(DATABASE, timeout=5.0)
    cur = con.cursor()
    cur.execute("UPDATE Client SET PSW=? WHERE Token=?",(psw, token))
    con.commit()
    con.close()
    return True
