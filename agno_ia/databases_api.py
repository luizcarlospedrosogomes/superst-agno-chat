# agno_ai/api/databases_api.py

from flask_appbuilder.api import BaseApi, expose
from flask_appbuilder.security.decorators import protect, has_access_api, has_access
from superset.extensions import db
from superset.models.core import Database
from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP
from flask_appbuilder import permission_name
class DatabaseListApi(BaseApi):
    
    route_base = "/agno/databases"
    @expose("/", methods=["GET"])
    @has_access_api
    def list_databases(self):
        print("read start")
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
