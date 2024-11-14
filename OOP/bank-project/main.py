from bank import Bank, SavingsAccount, CurrentAccount, Account

bank = Bank("UWS BANK", "London")

def print_options():
  print("___UWS BANK___")
  print("No | Options")
  print("------------------------")
  options = ["Create Account", "Delete Account", "Withdraw", "Deposit", "Check Balance", "Bank Info", "Show Accounts", "Close App"]
  for i, o in enumerate(options):
    print(f"{i + 1}  | {o}")

def create_account_option():
  name = input("Please enter your name: ")
  phone = input("Please enter your phone: ")

  if not name or not phone:
    print("You entered invalid details")
    return

  print("Select Account type to create")
  print("1. Savings. Interest when deposited")
  print("2. Current. No Interest")
  option = input()
  account = None
  if option == "1":
    account = SavingsAccount(name, phone, 1.5)
  elif option == "2":
    account = CurrentAccount(name, phone)
  if account != None:
    bank.add_account(account)
    print("Your account created successfully")
    print(f"Your New Account Number is {account.account_number} and balance is {account.balance} GBP.")
  else:
    print("You entered a invalid account type. Please try again")

def delete_account_option():
  account = get_account_details()
  if account == None:
    return
  
  print_account_details(account)
  confirmation = input("Are you sure want to delete your account!\nYes\nNo\n")
  if confirmation == "yes":
    bank.remove_account(account.account_number)
    print("Account Removed successfully ✅")

def get_account_details():
  number = input("Please enter your account number: ")
  if not number.isdigit():
    print("Invalid account number")
    return None
  account = bank.get_account(int(number))
  if account == None:
    print("No account found with the number you provided")
  return account

def withdraw_option():
  account = get_account_details()
  if account == None:
    return
  print(f"Available balance: {account.balance}")
  amount = input("Enter a valid amount to withdraw: ")
  if not amount.isdigit():
    print("Invalid amount. please try again.")
    return
  
  amount = float(amount)
  balance = bank.withdraw_money(account.account_number, amount)
  if balance == -1:
    print("Failed to withdraw. Please try again")
    return

  # print(f"Withdraw successfully. Here is your money 💵 {amount} GBP")
  print(f"New Balance after withdraw: {account.balance} GBP")

def deposit_option():
  account = get_account_details()
  if account == None:
    return
  amount = input("Enter amount to deposit: ")
  if not amount.isdigit():
    print("Invalid amount. Please try again")
    return
  amount = float(amount)
  balance = bank.deposit_money(account.account_number, amount)
  is_savings = account.account_type == "savings"
  if balance != -1:
    print(f"Your updated balance is {account.balance} {f"With Interest of {account.interest_rate}x" if is_savings else ""}")
  else:
    print("Failed to deposit money")

def print_account_details(account: Account):
  print("--------------------------------------")
  print("Account Info")
  print("--------------------------------------")
  print(f"Account Number: {account.account_number}")
  print(f"Account Holder: {account.name}")
  print(f"Account Balance: {account.balance}")
  print(f"Account Type: {account.account_type}")
  print(f"Phone number: {account.phone}")
  print("--------------------------------------")

def check_balance_option():
  account = get_account_details()
  if account == None:
    return
  print_account_details(account)

def print_bank_info_option():
  print(f"Bank Name: {bank.bank_name}")
  print(f"Bank Branch: {bank.branch}")

def print_accounts_option():
  print(f"Total Accounts: {len(bank.accounts)}")
  print("----------------------------------------")
  print("  No  |  Name")
  print("----------------------------------------")
  for _, account in enumerate(bank.accounts):
    print(f"{account.account_number}  |  {account.name}")
  print("----------------------------------------")

while True:
  print_options()
  option = input("Please select an option: ")
  if option == "1":
    create_account_option()
  if option == "2":
    delete_account_option()
  if option == "3":
    withdraw_option()
  if option == "4":
    deposit_option()
  if option == "5":
    check_balance_option()
  if option == "6":
    print_bank_info_option()
  if option == "7":
    print_accounts_option()
  if option == "8":
    print("Bye 👋")
    break