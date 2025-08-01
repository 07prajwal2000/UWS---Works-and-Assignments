import pandas as pd
import random
from uuid import uuid4 as v4

orders = pd.read_csv("csv/orders.csv").sample(125_875)
dummy_reviews = pd.read_csv("csv/dummy_reviews.csv").sample(orders.size)

reviews = []
idx = 0
for i, order in orders.iterrows():
    review = {
        "review_id": v4(),
        "order_id": order["order_id"],
        "user_id": order["user_id"],
        "rating": random.randint(1, 5),
        "review_text": dummy_reviews["review_text"].iloc[idx],
    }
    reviews.append(review)
    idx += 1
reviewsDf = pd.DataFrame(reviews)
reviewsDf.to_csv("csv/reviews.csv", index=False)
print("completed generating reviews")
