import pandas as pd
import random
from uuid import uuid4 as v4
import datetime

orders = pd.read_csv("csv/orders_new.csv")
# orders = orders.sample(5)
transactions = []
CHUNK_SIZE = 50_000
idx = 0
header = True
for i, order in orders.iterrows():
    idx += 1
    if str(order["date_placed"]) == "date_placed":
        continue
    initial_date = datetime.datetime.strptime(str(order["date_placed"]), "%Y-%m-%d")
    while True:
        txDate = initial_date + datetime.timedelta(minutes=random.randint(1, 5))
        success_rate = random.randint(1, 100)
        status = "completed"
        if success_rate > 30:  # 70% success rate
            status = "completed"
        else:
            status = "failed"
        transaction = {
            "transaction_id": v4(),
            "order_id": order["order_id"],
            "user_id": order["user_id"],
            "amount": order["discounted_price"],
            "payment_method": random.choice(["credit_card", "paypal", "bank_transfer"]),
            "status": status,
            "date": str(txDate),
        }
        initial_date = txDate
        transactions.append(transaction)
        if transaction["status"] == "completed":
            break
    if len(transactions) >= CHUNK_SIZE:
        df = pd.DataFrame(transactions)
        df.to_csv("csv/transactions_new.csv", mode="a", header=header, index=False)
        transactions = []
        header = False
    if idx % CHUNK_SIZE == 0:
        print("Chunk", idx / CHUNK_SIZE, "inserted")

if len(transactions) != 0:
    df = pd.DataFrame(transactions)
    df.to_csv("csv/transactions_new.csv", mode="a", header=header, index=False)
