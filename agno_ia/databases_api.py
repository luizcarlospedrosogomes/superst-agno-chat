# agno_ai/api/databases_api.py

from flask_appbuilder.api import BaseApi, expose
from flask_appbuilder.security.decorators import protect
from superset.extensions import db
from superset.models.core import Database

class DatabaseListApi(BaseApi):
    route_base = "/agno/databases"

    @expose("/", methods=["GET"])
    #@protect()
    def list_databases(self):
        dbs = db.session.query(Database).all()
        print(dbs)
        result = [
            {
                "id": db.id,
                "name": db.database_name,
                "engine": db.backend,
                "sqlalchemy_uri": db.sqlalchemy_uri
            }
            for db in dbs if db.backend == "postgresql"
        ]
        return self.response(200, result=result)
