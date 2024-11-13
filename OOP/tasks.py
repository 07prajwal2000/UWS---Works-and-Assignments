from users import Owner
from datetime import datetime, timedelta

class Task:
	title: str
	description: str
	completed: bool = False
	date_created: datetime
	due_date: datetime

	def __init__(self, created_date: datetime = None):
		self.date_created = created_date if created_date else datetime.now()
	
	def set_title(self, title: str):
		self.title = title
	
	def set_status(self, completed: bool):
		self.completed = completed
	
	def set_description(self, description: str):
		self.description = description
	
	def set_duedate(self, due_date: datetime):
		self.due_date = due_date

class RecurringTask(Task):
	next_recurring_date: datetime

	def __init__(self, title: str, interval: timedelta, created_date: datetime = None):
		self.date_created = created_date if created_date else datetime.now()
		self.set_title(title)
		self.interval = interval
		self.next_recurring_date = self.date_created + interval
	
	def set_status(self, completed: bool):
		super().set_status(completed)
		self.next_recurring_date += self.interval
	
	def change_interval(self, interval: timedelta):
		self.interval = interval

class TaskList:
	tasks: list[Task] = []
	owner: Owner

	def add_task(self, task: Task):
		self.tasks.append(task)
	
	def remove_task_by_index(self, index: int):
		if index < 0 or index >= len(self.tasks):
			print("Invalid index")
			return
		for i, task in enumerate(self.tasks):
			if i == index:
				self.tasks.remove(task)
				break
	
	def set_owner(self, owner: Owner):
		self.owner = owner
	
	def remove_task(self, task):
		self.tasks.remove(task)
	
	def view_tasks(self):
		print("Id | Title | Completed")
		for i, task in enumerate(self.tasks):
			completed = task.completed
			if type(task) == RecurringTask:
				print(f"{i + 1} | {task.title} | {"✅" if completed else "❌"} | {task.next_recurring_date}")
			else:
				print(f"{i + 1} | {task.title} | {"✅" if completed else "❌"}")

	def print_options(self):
		print("_Task List Menu_")
		print("----------------")
		print("1. View Tasks")
		print("2. Create Tasks")
		print("3. Create Recurring Tasks")
		print("4. Delete Tasks")
		print("5. Print Menu")
		print("6. Quit")

	def view_overdue_tasks(self):
		print("Overdue Tasks")
		print("Id | Title")
		for i, task in enumerate(self.tasks):
			if task.due_date < datetime.now() and not task.completed:
				print(f"{i + 1} | {task.title}")

	def get_task_by_index(self, index: int):
		for i, task in enumerate(self.tasks):
			if i == index:
				return task
		return None
prajwal = Owner("Prajwal aradhya", "prajwal@email.com")
if __name__ == "__main__":
	task_list = TaskList()
	task_list.set_owner(prajwal)
	task_list.print_options()
	while True:
		option = input("Choose an option:\n")

		if option == "1":
			task_list.view_tasks()
			
		elif option == "2":
			title = input("Enter title:\n")
			if not title:
				continue
			new_task = Task()
			new_task.set_title(title)
			new_task.set_duedate(datetime.now() + timedelta(7))
			task_list.add_task(new_task)
			
		elif option == "3":
			title = input("Enter title:\n")
			if not title:
				continue
			day = input("Enter recurring day")
			if not day or not day.isdigit() or int(day) <= 0:
				print("Invalid day")
				continue
			new_task = RecurringTask(title, timedelta(int(day)))
			task_list.add_task(new_task)

		elif option == "4":
			index = input("Enter the index to delete the task:\n")
			if not index.isdigit():
				print("Invalid Index")
				continue
			task_list.remove_task_by_index(int(index) - 1)
			
		elif option == "5":
			task_list.print_options()
			
		elif option == "6":
			print("Bye 👋")
			break
		
		else:
			print("Invalid option")
			task_list.print_options()