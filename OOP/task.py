from datetime import datetime, timedelta


class Task:
    def __init__(
        self, title: str, date_due: datetime, description: str = "", task_type="Task"
    ):
        self.date_due = date_due
        self.title = title
        self.description = description
        self.completed = False
        self.date_created = datetime.now()
        self.task_type = task_type

    def __str__(self):
        return (
            f"Task-{self.title} (created: {self.date_created}, due: {self.date_due}, "
            f"Completed: {self.completed}). {self.description}"
        )
        # return f"Task(title={self.title}, due={self.date_due.strftime('%Y-%m-%d')}, completed={self.completed})"

    def mark_completed(self):
        self.completed = True

    def change_title(self, new_title: str):
        self.title = new_title

    def change_date_due(self, new_due_date: datetime):
        self.date_due = new_due_date

    def change_description(self, new_description: str):
        self.description = new_description


class PriorityTask(Task):
    def __init__(
        self, title: str, date_due: datetime, priority="low", description: str = ""
    ):
        super().__init__(title, date_due, description, "PriorityTask")
        self.priority = priority

    def __str__(self):
        status = "Completed" if self.completed else "Not Completed"
        return f"{self.title} - Priority - {self.priority} (created: {self.date_created.strftime("%Y-%m-%d")}, status: {status})"


class RecurringTask(Task):
    def __init__(
        self, title: str, date_due: datetime, description: str, interval: timedelta
    ):
        super().__init__(title, date_due, description, "RecurringTask")
        self.interval = interval
        self.completed_dates = []

    def __str__(self):
        completed_dates_str = ", ".join(
            date.strftime("%Y-%m-%d") for date in self.completed_dates
        )
        # completed_dates_str = ", ".join(datetime.date( self.completed_dates).strftime('%Y-%m-%d')
        # for date in self.completed_dates)
        status = "Completed" if self.completed else "Not Completed"
        return (
            f"{self.title} - Recurring (created: {self.date_created.strftime('%Y-%m-%d')}, "
            f"due: {self.date_due.strftime('%Y-%m-%d')}, completed dates: [{completed_dates_str}], "
            f"status: {status}, description: {self.description})"
        )
        # return (
        #         f"RecurringTask-{self.title} - (created: {self.date_created}, due: {self.date_due}, "
        #         f"completed dates: [{completed_dates_str}, interval: {self.interval}])"
        # )
        # return (
        #     f"RecurringTask(title={self.title}, due={self.date_due.strftime('%Y-%m-%d')}, "
        #     f"interval={self.interval.days} days, completed_dates=[{completed_dates_str}])"
        # )

    def _compute_next_due_date(self) -> datetime:
        if isinstance(self.date_due, str):
            self.date_due = datetime.strptime(self.date_due, "%Y-%m-%d")
        return self.date_due + self.interval

    def mark_completed(self):
        self.completed_dates.append(self.date_due)
        self.date_due = self._compute_next_due_date()
