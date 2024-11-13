class User:
  def __init__(self, name, email):
    self.name = name
    self.email = email
  

class Owner(User):  
  def __init__(self, name, email):
    super().__init__(name, email)