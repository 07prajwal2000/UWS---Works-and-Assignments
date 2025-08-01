import pandas as pd
import datetime

products = pd.read_csv("csv/products_updated.csv")
products["date_created"] = products["date_created"].apply(
    lambda x: datetime.datetime.strptime(x, "%d-%m-%Y").strftime("%Y-%m-%d")
)
products.to_csv("csv/products_updated.csv", index=False, header=True)
