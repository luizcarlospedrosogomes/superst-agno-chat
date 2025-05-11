from flask import request
from flask_appbuilder.api import BaseApi, expose
from agno.agent import Agent
from agno.models.google import Gemini
from superset.extensions import db
from superset.models.core import Database
from agno.tools.postgres import PostgresTools

class QueryApi(BaseApi):

    route_base = "/agno"

    @expose("/query")
    #@protect()
    def query(self):
        user_question = request.args.get("question")
        database_name = request.args.get("database")

        if not user_question or not database_name:
            return self.response(400, message="Campos 'question' e 'database' são obrigatórios.")
        print(database_name)
        db_obj = self.get_database_by_name(database_name)
        if not db_obj:
            return self.response(404, message=f"Banco '{database_name}' não encontrado.")

        try:
            tool = self.build_postgres_tool_from_superset_db(db_obj)

            sql_agent = Agent(
                name="SQL Helper Agent",
                role="Você é um especialista em SQL e dados.",
                tools=[tool],
                model=Gemini(id="gemini-2.0-flash")  # ou outro modelo
            )

            result = sql_agent.run(user_question)
            return self.response(200, result=result.content)
        except Exception as e:
            return self.response(500, message=str(e))


    def get_database_by_name(self, name: str):
        return db.session.query(Database).filter_by(database_name=name).first()

    

    def build_postgres_tool_from_superset_db(self, db_obj):
        uri = db_obj.sqlalchemy_uri
        import sqlalchemy.engine.url as sa_url
        parsed = sa_url.make_url(uri)
        print(db_obj, db_obj.password, parsed.username, parsed.host, parsed.database)
        return PostgresTools(
            db_name=parsed.database,
            user=parsed.username,
            password=db_obj.password,
            host=parsed.host,
            port=str(parsed.port or 5432)
        )
