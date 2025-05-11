# agno_ai/auth.py
from flask import request
from flask_appbuilder.security.manager import AUTH_DB
from flask_appbuilder.security.decorators import has_access
import jwt
import os

# Função para verificar se o token é válido
def verify_token(token):
    try:
        # Decodificando o JWT para verificar se é válido
        decoded_token = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Decorator para proteger a rota
def protect_with_token(func):
    @has_access
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return {"message": "Token não fornecido"}, 401

        token = token.split(" ")[1]  # Pegando o token após 'Bearer'
        if verify_token(token) is None:
            return {"message": "Token inválido ou expirado"}, 401

        return func(*args, **kwargs)
    return wrapper
