import pandas as pd
import uuid
import random
import faker

usersDf = pd.read_csv("csv/users.csv")
products = pd.read_csv("csv/products_updated.csv")
usersDf["id"] = usersDf.index + 1
products["id"] = products.index + 1

i = 0
for chunk in range(8):  # 8 * 25k = 100k
    usersDf = usersDf.sample(25_000)
    orders = []
    allOrderEntries = []
    fakerGen = faker.Faker()
    for index, user in usersDf.iterrows():
        i += 1
        totalProducts = random.randint(1, 3)
        productsOrdered = products.sample(totalProducts)
        order = {
            "total_price": 0,
            "discounted_price": 0,
            "order_id": uuid.uuid4(),
            "user_id": user["id"],
            "date_placed": fakerGen.date_this_decade(),
        }
        orderEntries = []
        for idx, product in productsOrdered.iterrows():
            qty = random.randint(1, 3)
            totalPrice = product["price"] * qty
            discountedPrice = round(
                totalPrice * (1 - (product["discount_percent"] / 100)), 2
            )
            order["discounted_price"] += discountedPrice
            order["total_price"] += totalPrice
            orderEntries.append(
                {
                    "order_entry_id": uuid.uuid4(),
                    "order_id": order["order_id"],
                    "product_id": product["id"],
                    "price_per_unit": product["price"],
                    "quantity": qty,
                    "total_price": totalPrice,
                    "discounted_price": discountedPrice,
                    "discount_percent": product["discount_percent"],
                }
            )
        order["discounted_price"] = round(order["discounted_price"], 2)
        orders.append(order)
        allOrderEntries.extend(orderEntries)
        if i % 1000 == 0:
            print(i, "users done")

    ordersDf = pd.DataFrame(orders)
    ordersDf.to_csv("csv/orders.csv", index=False, mode="a")

    ordersEntryDf = pd.DataFrame(allOrderEntries)
    ordersEntryDf.to_csv("csv/orders_entry.csv", index=False, mode="a")
    print("chunk", chunk, "done")
