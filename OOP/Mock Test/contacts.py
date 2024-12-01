class Contact: 
  def __init__(self, name, phone_number):
    self.name = name
    self.phone_number = phone_number

  def update_phone_number(self, new_number):
    self.phone_number = new_number

  def display_info(self):
    print(f"Contact\nName: {self.name}, Phone: {self.phone_number}\n")


class ProfessionalContact(Contact):
  def __init__(self, name, phone_number, job_title, company, professional_email):
    super().__init__(name, phone_number)
    self.job_title = job_title
    self.company = company
    self.professional_email = professional_email

  def display_info(self):
    print(f"Professional Contact\nName: {self.name}, Phone: {self.phone_number}, Job title: {self.job_title}, Company: {self.company}, Professional Email: {self.professional_email}\n")

    
class PersonalContact(Contact):
  def __init__(self, name, phone_number, birthday, personal_email):
    super().__init__(name, phone_number)
    self.birthday = birthday
    self.personal_email = personal_email

  def display_info(self):
    print(f"Personal Contact\nName: {self.name}, Phone: {self.phone_number}, Birthday: {self.birthday}, Personal Email: {self.personal_email}\n")