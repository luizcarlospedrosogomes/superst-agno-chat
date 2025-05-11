import os
from agno.agent import Agent
from agno.models.google import Gemini

from dotenv import load_dotenv
load_dotenv() 
openai_api_key = os.getenv("OPENAI_API_KEY")
from agno.tools.postgres import PostgresTools

postgres_tools = PostgresTools(
    db_name=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT", "5432")
)

sql_agent = Agent(
    name="SQL Helper Agent",
    role=(
        "Você é um especialista em bancos de dados. "
        "Quando o usuário fizer perguntas sobre estrutura ou conteúdo do banco, "
        "você deve usar a ferramenta 'postgres_tools' para executar consultas e responder."
    ),
    tools=[postgres_tools],
    model=Gemini(id="gemini-2.0-flash")
)
