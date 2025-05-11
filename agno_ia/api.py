# agno_ai/api.py
from flask_appbuilder.api import BaseApi, expose
from flask import request
from flask_appbuilder.security.decorators import protect
from .query import run_sql_query

class AgnoApi(BaseApi):
    route_base = "/agno"

    @expose("/query", methods=["POST"])
    @protect()
    def query(self):
        user_question = request.json.get("question")
        if not user_question:
            return self.response(400, message="Faltando campo 'question'.")
        try:
            response = run_sql_query(user_question)
            return self.response(200, message="Resposta gerada", result=response)
        except Exception as e:
            return self.response(500, message=f"Erro ao gerar resposta: {str(e)}")
