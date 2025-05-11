
from flask_appbuilder.api import BaseApi, expose
from flask import g
from flask_appbuilder.security.decorators import protect
from flask_appbuilder import ModelRestApi
import requests
from .sql_agent import sql_agent

class AgnoApi(BaseApi):
    route_base = "/agno"

    @expose("/query", methods=["POST"])
    @protect()
    def query(self):
        user_question = request.json.get("question")
        if not user_question:
            return self.response(400, message="Faltando campo 'question'.")

        try:
            response = sql_agent.run(user_question)
            return self.response(200, message="Resposta gerada", result=response)
        except Exception as e:
            return self.response(500, message=f"Erro ao gerar resposta: {str(e)}")
    
    @expose("/login")
    def login(self):
        login_url= "http://127.0.0.1:8088/api/v1/security/login"
        data = {
            "username": "admin",
            "password": "SPRO@150935",
            "provider": "db",  # Tipo de autenticação, pode ser 'db' para banco de dados ou outro
            "refresh": True,  # Se você quer um token de refresh
        }
        response = requests.post(login_url, json=data)
        if response.status_code == 200:
            token = response.json()["access_token"]
            print("Token de Acesso: ", token)
            return self.response(200, message="Resposta gerada", result=token)
        else:
            return self.response(500, message=f"Erro ao gerar resposta: {str(response)}")