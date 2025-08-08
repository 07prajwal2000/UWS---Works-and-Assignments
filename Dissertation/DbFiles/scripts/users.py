import faker
import random
import csv
import os
import pandas as pd

users = pd.read_csv("csv/users_1.csv")
users["id"] = users.index + 1

users.to_csv("csv/users_2.csv", index=False, header=True)


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
fileExist = os.path.isfile("users.csv")
with open("users.csv", "a") as csvFile:
    for count in range(100):  # 1M
        users = []
        for i in range(10_000):
            isMale = random.randint(1, 2) == 1
            userData = {
                "first_name": (
                    fakerGen.first_name_male()
                    if isMale
                    else fakerGen.first_name_female()
                ),
                "last_name": fakerGen.last_name(),
                "email": fakerGen.email(),
                "password": fakerGen.password(),
                "picture": fakerGen.image_url(),
                "address": fakerGen.address(),
                "phone": fakerGen.phone_number(),
                "notifications_allowed": random.randint(1, 10) > 3,  # 70% chance
                "date_joined": fakerGen.date_this_decade(),
            }
            users.append(userData)
        print("Bulk ", count + 1, "inserted")
        writer = csv.DictWriter(csvFile, columns)
        if not fileExist:
            writer.writeheader()
        writer.writerows(users)
