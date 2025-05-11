# agno_ai/services/query_service.py

from agno.agent import Agent
from agno.tools.postgres import PostgresTools
from agno.models.google import Gemini
import os

postgres_tools = PostgresTools(
    db_name=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT", "5432")
)

sql_agent = Agent(
    name="SQL Helper Agent",
    role="Especialista em banco de dados",
    tools=[postgres_tools],
    model=Gemini(id="gemini-2.0-flash")
)

def run_sql_query(question):
    return sql_agent.run(question)
