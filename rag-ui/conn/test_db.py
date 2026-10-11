import psycopg

with psycopg.connect("dbname=rag_memory user=boxuser password=123 host=127.0.0.1 port=5433 connect_timeout=5") as conn:
    print(conn.execute("SELECT version();").fetchone())
    conn.execute(
        "INSERT INTO messages (session_id, role, content) VALUES (%s, %s, %s)",
        ("s1", "user", "tes dari python"),
    )
    print(conn.execute("SELECT * FROM messages").fetchall())