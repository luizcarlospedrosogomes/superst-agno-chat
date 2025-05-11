# agno_ai/query.py
from agno.tools.postgres import PostgresTools
from agno.agent import Agent
import os

# Configuração de conexão com o banco de dados
postgres_tools = PostgresTools(
    db_name=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT", "5432")
)

# Agente para executar consultas SQL
sql_agent = Agent(
    name="SQL Helper Agent",
    role=(
        "Você é um especialista em bancos de dados. "
        "Quando o usuário fizer perguntas sobre estrutura ou conteúdo do banco, "
        "você deve usar a ferramenta 'postgres_tools' para executar consultas e responder."
    ),
    tools=[postgres_tools],
    model=None  # Defina o modelo conforme necessário
)

def run_sql_query(query):
    try:
        return sql_agent.run(query)
    except Exception as e:
        return str(e)
