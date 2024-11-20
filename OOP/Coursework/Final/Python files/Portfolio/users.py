class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

    def __str__(self):
        return f"User: {self.name}, Email: {self.email}"


class Owner(User):
    def __init__(self, name: str, email: str):
        super().__init__(name, email)

    def __str__(self):
        return f"Owner: {self.name}, Email: {self.email}"
