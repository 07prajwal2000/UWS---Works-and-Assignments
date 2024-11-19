import csv
import datetime
from task import Task, RecurringTask, PriorityTask  # Assuming Task and RecurringTask are defined in task.py


class TaskCsvDAO:
    def __init__(self, storage_path: str) -> None:
        self.storage_path = storage_path
        self.fieldnames = [
            "title", "type", "date_due", "completed",
            "interval", "completed_dates", "date_created", "description","priority"
        ]

    def get_all_tasks(self) -> list[Task]:
        task_list = []
        try:
            with open(self.storage_path, "r") as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Validate that row is a dictionary
                    if not isinstance(row, dict):
                        print(f"Skipping invalid row: {row}")
                        continue

                    # Ensure required fields are present
                    if not row.get("title") or not row.get("type") or not row.get("date_due"):
                        print(f"Skipping invalid row: {row}")
                        continue

                    task_type = row["type"]
                    title = row["title"]
                    description = row["description"]
                    try:
                        date_due = datetime.datetime.strptime(row["date_due"], "%Y-%m-%d")
                        date_created = datetime.datetime.strptime(row["date_created"], "%Y-%m-%d")
                        completed = row["completed"] == "True"
                    except (ValueError, KeyError):
                        print(f"Skipping invalid dates in row: {row}")
                        continue

                    completed_dates = []
                    if row.get("completed_dates"):
                        completed_dates = [
                            datetime.datetime.strptime(date.strip(), "%Y-%m-%d")
                            for date in row["completed_dates"].split(",") if date.strip()
                        ]

                    if task_type == "Task":
                        task = Task(title, date_due, description)
                        task.completed = completed
                        task.date_created = date_created
                    elif task_type == "RecurringTask":
                        interval = datetime.timedelta(days=int(row["interval"].split()[0]))
                        task = RecurringTask(title, date_due, description, interval)
                        # task = RecurringTask(title=title, date_due=date_due, description=description,
                        #                      interval=datetime.timedelta(days=interval))
                        task.completed_dates = completed_dates
                        task.completed = completed
                        task.date_created = date_created
                    elif task_type == "PriorityTask":
                        priority = row["priority"]
                        task = PriorityTask(title, date_due, priority, description)
                    else:
                        print(f"Unknown task type in row: {row}")
                        continue

                    task_list.append(task)
        except FileNotFoundError:
            print("Task CSV file not found. Starting fresh.")
        return task_list

    def save_all_tasks(self, tasks: list[Task]) -> None:
        try:
            with open(self.storage_path, "w", newline="") as file:
                writer = csv.DictWriter(file, fieldnames=self.fieldnames)
                writer.writeheader()
                for task in tasks:
                    try:
                        row = {
                            "title": task.title,
                            "type": task.task_type,
                            "date_due": (
                                task.date_due.strftime("%Y-%m-%d")
                                if isinstance(task.date_due, datetime.datetime)
                                else task.date_due
                            ),
                            "priority": task.priority if task.task_type == "PriorityTask" else "",
                            "completed": task.completed,
                            "description": task.description,
                            "interval": str(task.interval.days) if isinstance(task, RecurringTask) else "",
                            "completed_dates": ",".join(
                                date.strftime("%Y-%m-%d") for date in task.completed_dates
                            ) if isinstance(task, RecurringTask) else "",
                            "date_created": (
                                task.date_created.strftime("%Y-%m-%d")
                                if isinstance(task.date_created, datetime.datetime)
                                else task.date_created
                            )
                        }
                        writer.writerow(row)
                    except Exception as e:
                        print(f"Error saving task: {task.title}, {e}")
                print("Tasks saved successfully.")
        except Exception as e:
            print(f"Error saving tasks: {e}")

