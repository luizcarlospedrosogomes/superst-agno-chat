# agno_ai/api.py
from flask_appbuilder.api import BaseApi, expose
from flask import request
from flask_appbuilder.security.decorators import protect
import requests

class AgnoLogin(BaseApi):
    route_base = "/agno"

    @expose("/login")
    def login(self):
        base_url = request.host_url 
        print(base_url)
        login_url= "http://127.0.0.1:8088/api/v1/security/login"
        data = {
            "username": "admin",
            "password": "<senha>",
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
    
    @expose("/teste-login")
    #@protect()
    def test(self):
        current_user = g.user  # usuário logado
        print(f"Usuário autenticado: {current_user.username}")