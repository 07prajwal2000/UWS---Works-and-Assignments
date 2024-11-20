class Account:
  balance: float
  account_number: int
  def __init__(self, name: str, phone: str):
    self.name = name
    self.phone = phone
    self.balance = 0
  
  def deposit(self, amount: float):
    self.balance += amount
    return self.balance
  
  def withdraw(self, amount: float):
    self.balance -= amount
    return self.balance
  
  def get_total_balance(self):
    return self.balance

class SavingsAccount(Account):
  account_type = "savings"
  
  def __init__(self, name: str, phone: str, interest_rate: float):
    super().__init__(name, phone)
    self.interest_rate = interest_rate

  def deposit(self, amount: float):
    super().deposit(amount)
    self.balance *= self.interest_rate

class CurrentAccount(Account):
  account_type = "current"
  
  def __init__(self, name: str, phone: str):
    super().__init__(name, phone)

class Bank:
  accounts: list[Account]

  def __init__(self, bank_name: str, branch: str):
    self.bank_name = bank_name
    self.branch = branch
    self.accounts = []
  
  def add_account(self, account: Account):
    self.accounts.append(account)
    account.account_number = len(self.accounts) + 1000
  
  def remove_account(self, number: int):
    for _, account in enumerate(self.accounts):
      if account.account_number == number:
        self.accounts.remove(account)
        return True
    return False
  
  def withdraw_money(self, account_number: int, amount: float):
    for _, account in enumerate(self.accounts):
      if account.account_number == account_number:
        if account.balance >= amount:
          return account.withdraw(amount)
    return -1
  
  def deposit_money(self, account_number: int, amount: float):
    for _, account in enumerate(self.accounts):
      if account.account_number == account_number:
        return account.deposit(amount)
    return -1

  def list_accounts(self):
    return self.accounts

  def get_balance(self, account_number: int):
    for _, account in enumerate(self.accounts):
      if account.account_number == account_number:
        return account.balance
    return -1

  def get_account(self, account_number: int):
    for _, account in enumerate(self.accounts):
      if account.account_number == account_number:
        return account
    return None