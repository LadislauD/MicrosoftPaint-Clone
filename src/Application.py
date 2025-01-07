import os
from flask import Flask
#from flask import render_template
from flask import request
from flask_cors import CORS
from flask import session

app = Flask(__name__)
CORS(app)
app.secret_key = 'laubonito'

@app.route("/")
def initSite():
    return "OK"
    
@app.route("/drawshared")
def sharedDraw():
    response = bdPaintClone.show_all_canvas()
    return response

@app.route("/newaccountregister", methods=['POST', 'GET'])
def register_new_user():
    validation = True
    if request.method == 'POST':
        jsonData = request.get_json()
        validation = bdPaintClone.registerUser(jsonData['new_username'], jsonData['new_password'])
        if not validation:
            return {
                    "validation":validation,
                    "responseJson": "Conta já existente!"
                }
        session['username'] = jsonData['new_username']
        return {
            "responseJson":"Conta registrada!",
            "validation": validation
            }

@app.get("/register")
def register():
    return {
                "respose":"Success",
                "code":"OK"
            }
    
@app.get("/canvasDrawed")
def getCanvas():
    return bdPaintClone.show_test_canvas()

@app.post("/saveDrawing")
def save_draw():
        jsonData = request.get_json()
        if(not jsonData['id']):
            bdPaintClone.saveDrawing(jsonData['title'], jsonData['drawURL'], jsonData['date'], jsonData['editValue'], jsonData['username'])
        else:
            bdPaintClone.saveDrawing(jsonData['title'], jsonData['drawURL'], jsonData['date'], jsonData['editValue'], jsonData['username'], jsonData['id'])
        return 'Desenho salvo!'
    
@app.post("/postComentDraw")
def commentPost():
    jsonData = request.get_json()
    bdPaintClone.commentInTable(jsonData['username'], jsonData['comment'], jsonData['idComment'])
    return {
            "response":'Comment Done',
            "code":"OK"
    }

@app.get("/getComentDraw/<string:id>")
def commentGet(id=None):
    if id != "null":
        return bdPaintClone.myComments(id)
    return {
        "response": 'No comments',
        "validation": False,
        "code":"OK"
        }

@app.post("/login")
def loging():
    isValid = False
    response = ""
    data = request.get_json()
    isValid = bdPaintClone.user_valid(data['username'], data['password'])
    if isValid:
        response = "Dados Válidos"
        session['username'] = data['username']
    else:
        response = "Dados incorrectos ou inexistentes"
    return  {
                "response": response,
                "validation": isValid,
                "code": "OK"
            }

@app.route("/initmsclone")
def init_paintClone():
    return {
                "response": "Success",
                "code":"OK"
            }
    
@app.route("/painthob")
def painthob():
    return 'OK'

import bdPaintClone
bdPaintClone.init_app(app)

if __name__ == "__main__":
    app.run(host="localhost", port=5001, debug=True)