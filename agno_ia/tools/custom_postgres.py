from agno.tools.postgres import PostgresTools
from typing import Optional

class CustomPostgresTools(PostgresTools):
    def __init__(self, *args, **kwargs):
        # Você pode alterar os parâmetros ou adicionar novos aqui
        super().__init__(*args, **kwargs)

        # Registrar uma nova ferramenta se quiser
        self.register(self.my_custom_tool)
        self.register(self.find_table_keys)
        self.register(self.show_view_definition)
        self.register(self.get_view_dependencies)
        self.register(self.get_comments)

    def my_custom_tool(self, table: str) -> str:
        """Uma função personalizada para contar registros de uma tabela"""
        stmt = f"SELECT COUNT(*) FROM {self.table_schema}.{table};"
        result = self.run_query(stmt)
        return f"A tabela {table} contém {result} registros."
    
    def find_table_keys(self, table: str) -> str:
        """Encontra as chaves primárias e estrangeiras de uma tabela"""
        query = f"""
        SELECT
            tc.constraint_type,
            kcu.column_name,
            ccu.table_name AS foreign_table,
            ccu.column_name AS foreign_column
        FROM
            information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.table_name = '{table}' AND tc.table_schema = '{self.table_schema}';
        """
        try:
            result = self.run_query(query)
            return f"Chaves da tabela {table}:\n{result}"
        except Exception as e:
            return f"Erro ao encontrar chaves da tabela {table}: {str(e)}"
        
    def show_view_definition(self, view: str) -> str:
        query = f"""
        SELECT definition
        FROM pg_views
        WHERE viewname = '{view}' AND schemaname = '{self.table_schema}';
        """
        return self.run_query(query)
    
    def get_view_dependencies(self, view: str) -> str:
        query = f"""
        SELECT
            v.viewname,
            t.relname AS dependent_table
        FROM
            pg_depend d
        JOIN pg_rewrite r ON r.oid = d.objid
        JOIN pg_class v ON v.oid = r.ev_class
        JOIN pg_class t ON t.oid = d.refobjid
        WHERE v.relname = '{view}';
        """
        return self.run_query(query)
   
    def get_comments(self, table: Optional[str] = None) -> str:
        """
        Lê os comentários de tabelas e colunas no schema atual.

        :param table: Nome da tabela para buscar os comentários. Se None, busca todas.
        :return: String formatada com os comentários.
        """
        with self.connection.cursor() as cursor:
            if table:
                # Comentários para colunas de uma tabela específica
                query = f"""
                    SELECT
                        cols.column_name,
                        pgd.description
                    FROM
                        pg_catalog.pg_statio_all_tables as st
                    INNER JOIN
                        pg_catalog.pg_description pgd ON (pgd.objoid = st.relid)
                    INNER JOIN
                        information_schema.columns cols
                            ON (cols.ordinal_position = pgd.objsubid AND cols.table_schema = st.schemaname AND cols.table_name = st.relname)
                    WHERE
                        cols.table_name = %s AND cols.table_schema = %s;
                """
                cursor.execute(query, (table, self.table_schema))
                column_comments = cursor.fetchall()

                # Comentário da tabela
                query_table = """
                    SELECT obj_description(%s::regclass, 'pg_class');
                """
                cursor.execute(query_table, (f"{self.table_schema}.{table}",))
                table_comment = cursor.fetchone()[0]

                output = [f"🧾 Comentário da tabela '{table}': {table_comment or 'Nenhum'}"]
                for col, comment in column_comments:
                    output.append(f"  🧩 {col}: {comment or 'Nenhum'}")
                return "\n".join(output)
            else:
                # Comentários de todas as tabelas
                query = f"""
                    SELECT
                        c.relname AS table_name,
                        obj_description(c.oid) AS comment
                    FROM
                        pg_class c
                    JOIN
                        pg_namespace n ON n.oid = c.relnamespace
                    WHERE
                        c.relkind = 'r'
                        AND n.nspname = %s;
                """
                cursor.execute(query, (self.table_schema,))
                table_comments = cursor.fetchall()

                return "\n".join(
                    [f"📁 {tbl}: {comment or 'Nenhum'}" for tbl, comment in table_comments]
                )
