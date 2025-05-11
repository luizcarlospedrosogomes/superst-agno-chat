import os
from dotenv import load_dotenv
load_dotenv() 
from flask import send_from_directory

# Configuração do banco de dados
SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')

SECRET_KEY = os.getenv('SECRET_KEY')

CACHE_CONFIG = {
    'CACHE_TYPE': 'simple',
}

FEATURE_FLAGS = {
    "ENABLE_API": True,
    "DYNAMIC_PLUGINS": True,
    "ENABLE_CUSTOM_PLUGINS": True,
}

DASHBOARD_COMPONENTS = {
    "ChatWidget": {
        "type": "react",
        "entry": "ChatWidget.jsx",
    },
}

ADDITIONAL_STATIC_IMPORTS = [
    'teste.js'
]

def mutate_flask_app(app):
    @app.route("/static/plugins/<path:filename>")
    def serve_custom_static(filename):
        static_folder = os.path.join(os.path.dirname(__file__), "static", "plugins")
        return send_from_directory(static_folder, filename)
    from agno_ia import all_apis
    for api in all_apis:
        app.appbuilder.add_api(api)
    return app

FLASK_APP_MUTATOR = mutate_flask_app
