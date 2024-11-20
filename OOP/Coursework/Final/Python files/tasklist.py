from operator import index

from users import Owner
from task import Task
import datetime


class TaskList:
    def __init__(self, owner: Owner):
        self.owner = owner
        self.tasks = []

    def add_task(self, task: Task):
        self.tasks.append(task)

    def remove_task(self, x: int):
        if 0 <= x < len(self.tasks):
            del self.tasks[x]
        else:
            print("Invalid index: Try again")

    def view_tasks(self):
        print("\n----------------TASK LIST-----------------")
        print(f"Task list owner: {self.owner}")
        print("------------------------------------------")
        for i, task in enumerate(self.uncompleted_tasks, start=1):  # Enumerate over uncompleted tasks
            print(f"{i}. {task} ({task.task_type})")
        print("------------------------------------------")

    def view_tasks_complete(self):
        print("\n----------------TASK LIST-----------------")
        print(f"Task list owner: {self.owner}")
        print("------------------------------------------")
        for i, task in enumerate(self.completed_tasks, start=1):  # Enumerate over uncompleted tasks
            print(f"{i}. {task} ({task.task_type})")
        print("------------------------------------------\n")

    def view_overdue_tasks(self):
        print("\n----------------TASK LIST-----------------")
        new_date = datetime.datetime.now()
        overdue_task = [task for task in self.tasks if task.date_due < new_date and not task.completed]
        if overdue_task:
            print("This tasks are Over-due")
            for i, items in enumerate(overdue_task):
                print(i, items)
        else:
            print("No over-due task available")
        print("------------------------------------------\n")

    @property
    def uncompleted_tasks(self) -> list[Task]:
        return [task for task in self.tasks if not task.completed]

    @property
    def completed_tasks(self) -> list[Task]:
        return [task for task in self.tasks if task.completed]
    #     new_date = datetime.datetime.now()
    #     uncompleted_task = [task for task in self.tasks if task.date_due > new_date and not task.completed]
    #     if uncompleted_task:
    #         print("This tasks are yet to be done")
    #         for i, items in enumerate(uncompleted_task):
    #             print(i, items)
    #     else:
    #         print("No uncompleted task available")
