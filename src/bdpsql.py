import psycopg2

connect = psycopg2.connect(
    database="mspaintclonedb",
    host="localhost",
    user="postgres",
    password="1234",
    port="5432"
)