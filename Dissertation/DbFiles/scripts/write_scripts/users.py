import pandas as pd
import faker
import random
import csv
import os


def new_users():
    fakerGen = faker.Faker()
    columns = [
        "first_name",
        "last_name",
        "email",
        "password",
        "picture",
        "address",
        "phone",
        "notifications_allowed",
        "date_joined",
    ]
    users_data = {
        "first_name": [],
        "last_name": [],
        "email": [],
        "password": [],
        "picture": [],
        "address": [],
        "phone": [],
        "notifications_allowed": [],
        "date_joined": [],
    }
    for count in range(5):  # 100k
        for i in range(10_000):
            isMale = random.randint(1, 2) == 1
            users_data["first_name"].append(
                fakerGen.first_name_male() if isMale else fakerGen.first_name_female()
            )
            users_data["last_name"].append(fakerGen.last_name())
            users_data["email"].append(fakerGen.email())
            users_data["password"].append(fakerGen.password())
            users_data["picture"].append(fakerGen.image_url())
            users_data["address"].append(
                fakerGen.address().replace("\n", "").replace(",", "")
            )
            users_data["phone"].append(fakerGen.phone_number())
            users_data["notifications_allowed"].append(
                random.randint(1, 10) > 3
            )  # 70% chance
            users_data["date_joined"].append(fakerGen.date_this_decade())
    usersDf = pd.DataFrame(users_data)
    usersDf.to_csv("csv/users_new.csv", index=False, header=True)


def update_existing_users():
    fake = faker.Faker()
    usersDf = pd.read_csv(
        "D:\\UWS\\Dissertation\\DbFiles\\scripts\\csv\\users_exported.csv"
    )
    usersDf = usersDf.sample(25000)
    usersDf["password"] = usersDf["password"].apply(lambda x: fake.password())
    usersDf["picture"] = usersDf["picture"].apply(lambda x: fake.image_url())
    usersDf["phone"] = usersDf["phone"].apply(lambda x: fake.phone_number())
    usersDf.to_csv(
        "csv/users_updated.csv",
        index=False,
        header=True,
    )


# update_existing_users()
new_users()
