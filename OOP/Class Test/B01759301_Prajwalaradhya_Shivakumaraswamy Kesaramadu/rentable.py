from abc import abstractmethod, ABC

class RentableObject(ABC):
  '''
  Base Class
  '''
  def __init__(self, name: str, available: bool = True):
    self.name = name
    self.available = available
    self.customer = ""
    self.days = 0
    self.rental_history = []
  
  @abstractmethod
  def rent_item(self, customer: str, days: int):
    '''
    Rent an item
    '''
    pass

  def return_item(self):
    '''
    Return the rented item
    '''
    self.customer = ""
    self.available = True
    self.days = 0

class Book(RentableObject):
  '''
  Book sub class which inherits RentableObject
  '''
  def __init__(self, name: str, author: str, available: bool = True):
    self.author = author
    super().__init__(name, available)
  
  def __str__(self) -> str:
    if not self.available:
      return f"Book - {self.name} by {self.author} (Book) - Rented By {self.customer} for {self.days} day(s)"
    return f"Book - {self.name} by {self.author} (Book) - Available: {self.available}"

  def rent_item(self, customer: str, days: int = 14):
    '''
    Rent the Book
    '''
    self.customer = customer
    self.days = days
    self.available = False
    self.rental_history.append(f"{self.name} Book rented by {customer} for {days} day(s)")

  def return_item(self):
    '''
    Return the Book
    '''
    self.rental_history.append(f"{self.name} Book returned by {self.customer}")
    super().return_item()

class DVD(RentableObject):
  '''
  DVD sub class which inherits RentableObject
  '''
  def __init__(self, name: str, director: str, available: bool = True):
    self.director = director
    super().__init__(name, available)
  
  def __str__(self) -> str:
    if not self.available:
      return f"DVD - {self.name} by {self.director} - Rented By {self.customer} for {self.days} day(s)"
    return f"DVD - {self.name} by {self.director} - Available: {self.available}"

  def rent_item(self, customer: str, days: int = 7):
    '''
    Rent the DVD
    '''
    self.customer = customer
    self.days = days
    self.available = False
    self.rental_history.append(f"{self.name} DVD rented by {customer} for {days} day(s)")

  def return_item(self):
    '''
    Return the DVD
    '''
    self.rental_history.append(f"{self.name} DVD returned by {self.customer}")
    super().return_item()

def main():
  book1 = Book("Harry Potter", "JK Rowling")

  book1.rent_item("Prajwal Aradhya")
  book1.return_item()
  
  book1.rent_item("Aman", 5)
  book1.return_item()
  
  batman = DVD("The Dark Knight", "Christopher Nolan")

  batman.rent_item("Rakshith Aradhya", 2)
  batman.return_item()
  
  batman.rent_item("Ali", 8)
  batman.return_item()
  
  for history in book1.rental_history:
    print(history)
  print("\n---------------------------------\n")
  for history in batman.rental_history:
    print(history)

if __name__ == "__main__":
  main()