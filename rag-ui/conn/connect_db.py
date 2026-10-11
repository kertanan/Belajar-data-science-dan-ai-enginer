import os
import psycopg
from dotenv import load_dotenv
from sshtunnel import SSHTunnelForwarder

load_dotenv()

try:
    with SSHTunnelForwarder(
        ("127.0.0.1", 2222),                        # SSH ke VM lewat port forwarding
        ssh_username="vboxuser",
        ssh_password=os.environ["SSH_PASSWORD"],
        remote_bind_address=("localhost", 5432),    # PostgreSQL di dalam VM
    ) as tunnel:
        with psycopg.connect(
            dbname="rag_memory",
            user="boxuser",
            password=os.environ["DB_PASSWORD"],
            host="127.0.0.1",
            port=tunnel.local_bind_port,            # port lokal otomatis dari tunnel
        ) as conn:
            print("Database version:", conn.execute("SELECT version();").fetchone())

except Exception as e:
    print("Gagal:", e)