import pandas as pd


def findCategoryId(series, category):
    for i in range(len(series)):
        if series[i] == category:
            return i + 1


df = pd.read_csv("csv/products.csv")

df["category"] = df["category"].apply(lambda x: x.split(" ")[0])
category = df["category"].unique()
categoryTable = pd.DataFrame({"category": category, "id": range(1, len(category) + 1)})

df["category"] = df["category"].apply(
    lambda x: findCategoryId(categoryTable["category"], x)
)

df.to_csv("csv/products_updated.csv", index=False)

categoryTable.to_csv("csv/category.csv", index=False)

print(df["category"])
