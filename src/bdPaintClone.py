import sqlite3
import click
from flask import current_app, g

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect("./instance/dbmsclone.sqlite")
    return db

#registrar user
def registerUser(username, password):
    db = get_db()
    query = "SELECT username from user WHERE username = '"+username+"'"
    table = db.cursor().execute(query).fetchall()
    if( table.__len__() > 0 ):
        close_db()
        return False
    
    query = "INSERT INTO user(username, pass) VALUES('"+username+"','"+password+"')"
    db.cursor().execute(query)
    db.commit()
    close_db()
    return True
#salvar desenho
def saveDrawing(titleDrawing, drawing, date, editValue, username, id=None):
    db = get_db()
    edit_on = str(editValue)
    if(id is None):
        query = "INSERT INTO drawing(title, drawURL, edit, usernameD, createdDate) VALUES('"+titleDrawing+"','"+drawing+"', '"+edit_on+"','"+username+"','"+date+"')"
    else:
        query = "UPDATE drawing SET drawURL = '"+drawing+"' WHERE id = "+str(id)+" "
    db.cursor().execute(query)
    db.commit()
    close_db()

def commentInTable(username, text, idDComment):
    db = get_db()
    query = "INSERT INTO comment(usernameComment, comentario, idDrawingComment) VALUES('"+username+"', '"+text+"', '"+str(idDComment)+"')"
    db.cursor().execute(query)
    db.commit()
    close_db()
    return



def myComments(idComment):
    db = get_db()
    query = "SELECT usernameComment, comentario from comment WHERE idDrawingComment = '"+str(idComment)+"'"
    result = db.cursor().execute(query).fetchall()
    db.commit()
    close_db()
    return result


def show_my_canvas(username):
    db = get_db()
    query = "SELECT usernameD,drawURL FROM drawing WHERE usernameD = '"+username+"'"
    result = db.cursor().execute(query).fetchall()
    close_db()
    return result

def show_all_canvas():
    db = get_db()
    query = "SELECT usernameD, drawURL, createdDate, id FROM drawing"
    result = db.cursor().execute(query).fetchall()
    close_db()
    return result

def user_valid(username, password):
    db = get_db()
    query = "SELECT username from user WHERE username = '"+username+"' "
    table = db.cursor().execute(query).fetchall()
    if( table.__len__() <= 0 ):
        close_db()
        return False

    query = "SELECT pass from user WHERE pass = '"+password+"' "
    table = db.cursor().execute(query).fetchall()
    close_db()
    if( table.__len__() <= 0 ):
        return False
    return True

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    with current_app.open_resource('paintclonedb.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
def init_db_command():
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
