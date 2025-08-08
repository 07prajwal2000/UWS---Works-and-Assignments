import pandas as pd
import psycopg2 as pg
import datetime

df = pd.read_csv("csv/orders_entry_new.csv")
table = "orders_entry"
connection = pg.connect(
    database="lsm_vs_btree_test",
    user="root",
    password="",
    host="localhost",
    port="26257",
)

cursor = connection.cursor()
i = 0
startTime = datetime.datetime.now()
startTranxTime = datetime.datetime.now()
totalMs = 0
colsStr = ",".join(df.columns.tolist())
placeholdersStr = ",".join(["%s"] * len(df.columns))
err = 0
for _, row in df.iterrows():
    i += 1
    try:
        if i % 10_000 == 0:
            print(i, "rows inserted")
            connection.commit()
        startTranxTime = datetime.datetime.now()
        cursor.execute(
            f"INSERT INTO {table} ({colsStr}) VALUES ({placeholdersStr})",
            row.tolist(),
        )
        endTranxTime = datetime.datetime.now()
        totalMs += (endTranxTime - startTranxTime).microseconds / 1000
    except Exception as e:
        connection.commit()
        err += 1
print("total errors: ", err)
connection.commit()
endTime = datetime.datetime.now()
diff = endTime - startTime
print("Overall:", diff)
print("Actual: ", totalMs, "ms")
cursor.close()
connection.close()
