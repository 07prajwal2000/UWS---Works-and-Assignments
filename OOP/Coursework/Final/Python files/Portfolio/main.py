from users import Owner
from task import Task  # Import the Owner class
from task import RecurringTask, PriorityTask
from tasklist import TaskList
from taskdao import TaskCsvDAO
import datetime


def view_options():
    options = [
        "1. Add a new task to the list.",
        "2. View the completed and uncompleted tasks  in the list.",
        "3. Remove a task from the list.",
        "4. Select a Task to perform \n (Complete Task/ description/Change due date).",
        "5. Change the title of a task.",
        "6. View Task Overdue.",
        "7. Quit and exit the program.",
    ]
    print("----------MENU------------")
    for items in options:
        print("|", items)
    print("--------------------------")

def list_options(task_list: TaskList) -> TaskList:
    """
    Adds a list of predefined tasks to the TaskList for demonstration purposes.

    Parameters:
    - task_list (TaskList): The TaskList object to populate with tasks.

    Returns:
    - TaskList: The TaskList object with added tasks.
    """
    # task_list.add_task(Task("Buy groceries", datetime.datetime.now() - datetime.timedelta(days=4), "Buy groceries"))
    # task_list.add_task(Task("Do laundry", datetime.datetime.now() - datetime.timedelta(days=2), "Do laundry"))
    # task_list.add_task(Task("Clean room", datetime.datetime.now() - datetime.timedelta(days=1), "Clean room"))
    # task_list.add_task(Task("Do homework", datetime.datetime.now() + datetime.timedelta(days=3), "Do homework"))
    # task_list.add_task(Task("Walk dog", datetime.datetime.now() + datetime.timedelta(days=5), "Walk dog"))
    # task_list.add_task(Task("Do dishes", datetime.datetime.now() + datetime.timedelta(days=6), "Do dishes"))
    return task_list


def main():
    # Create an Owner instance
    owner = Owner("Group4", "Group4@example.com")

    # Create TaskList with the owner
    task_list = TaskList(owner)

    # Use TaskCsvDAO for task persistence
    storage_path = "tasks.csv"
    task_dao = TaskCsvDAO(storage_path)

    # Load tasks from the CSV file
    try:
        task_list.tasks = task_dao.get_all_tasks()
        print(f"{len(task_list.tasks)} tasks loaded from CSV.")
    except FileNotFoundError:
        print("No existing tasks found. Starting fresh.")

    while True:
        view_options()
        try:
            choice = int(input("Please make a selection from (1-6): "))
        except ValueError:
            print("Invalid input. Please enter a number.")
            continue

        if choice == 1:
            option1 = input("Select task Type(normal/recurring/priority) task: ").lower().strip()
            if option1 == "normal":
                new_task = input("Add your task please: ")
                create_date = input("Set the date (YYYY-mm-dd) :").strip()
                describe = (input("Write a description for this task (or press Enter to skip): ")
                            or "No description provided")
                new_date = datetime.datetime.strptime(create_date, "%Y-%m-%d")
                task_list.title = Task(new_task, new_date, describe)
                task_list.add_task(task_list.title)

            elif option1 == "recurring":
                new_task = input("Add your task please: ")
                create_date = input("Set the due date (YYYY-mm-dd) :").strip()
                recurring_num = input("Set the recurring number:").strip()
                describe = (input("Write a description for this task (or press Enter to skip): ")
                            or "No description provided")
                interval = datetime.timedelta(days=int(recurring_num))
                new_date = datetime.datetime.strptime(create_date, "%Y-%m-%d")
                task_list.title = RecurringTask(new_task, new_date, describe, interval)
                task_list.add_task(task_list.title)
            elif option1 == "priority":
                new_task = input("Add your task please: ")
                create_date = input("Set the date (YYYY-mm-dd) :").strip()
                describe = (input("Write a description for this task (or press Enter to skip): ")
                            or "No description provided")
                priority = input("Enter the priority (low,medium,high): ")
                if not (priority in ["low", "medium", "high"]):
                    print("Invalid priority. Please enter a valid priority")
                    continue
                new_date = datetime.datetime.strptime(create_date, "%Y-%m-%d")
                task_list.title = PriorityTask(new_task, new_date, priority, describe)
                task_list.add_task(task_list.title)

        elif choice == 2:
            select_task = input("Select a task to view (completed / uncompleted)?: ").lower()
            if select_task == "completed":
                task_list.view_tasks_complete()

            elif select_task == "uncompleted":
                task_list.view_tasks()

        elif choice == 3:
            index = int(input("Select task to remove: "))
            task_list.remove_task(index)
            task_list.view_tasks()

        elif choice == 4:

            # Display all tasks to the user
            task_list.view_tasks()

            # Prompt user for the type of action
            select_task = input(
                "Select a task to perform (complete a task / change due date / change description)?: "
            ).lower()

            if select_task == "complete a task":
                try:
                    # Get task index from user input
                    a = int(input("Which of the above tasks is completed: ")) - 1  # Adjust for 0-based indexing

                    # Check if the selected index is valid
                    if 0 <= a < len(task_list.tasks):
                        selected_task = task_list.tasks[a]

                        # Print selected task
                        print(f"Selected task: {selected_task}")

                        if isinstance(selected_task, RecurringTask):
                            # Indicate recurring task completion
                            print("Completing recurring task...")
                            selected_task.mark_completed()
                            print(f"Recurring task updated: {selected_task}")
                        else:
                            # Indicate regular task completion
                            print("Completing regular task...")
                            selected_task.mark_completed()
                            print(f"Task updated: {selected_task}")
                    else:
                        print("Invalid selection.")
                except ValueError:
                    print("Invalid input. Please enter a valid number.")

            elif select_task == "change due date":
                try:
                    a = int(input("Which of the above tasks due date do you want to change:")) - 1
                    change_date = input("Type the new Date:")
                    new_due_date = datetime.datetime.strptime(change_date, "%Y-%m-%d")
                    if 0 <= a < len(task_list.tasks):
                        task_list.tasks[a].change_date_due(new_due_date)
                    else:
                        print("Index out of range")
                except ValueError:
                    print("Invalid input. Please enter a number.")

            elif select_task == "change description":
                try:
                    a = int(input("Which of the above tasks description do you want to change:")) - 1
                    description = input("Type the new description:")
                    if 0 <= a < len(task_list.tasks):
                        task_list.tasks[a].change_description(description)
                    else:
                        print("Index out of range")
                except ValueError:
                    print("Invalid input. Please enter a number.")

        elif choice == 5:
            task_list.view_tasks()
            try:
                a = int(input("Which of the above tasks do you want to change:")) - 1
                new_title = input("Type the new title:")
                if 0 <= a < len(task_list.tasks):
                    task_list.tasks[a].change_title(new_title)
                else:
                    print("Index out of range")
            except ValueError:
                print("Invalid input. Please enter a number.")

        elif choice == 6:
            task_list.view_overdue_tasks()

        elif choice == 7:
            # Save tasks before exiting
            task_dao.save_all_tasks(task_list.tasks)
            print("System ends")
            break


# Run the main function
if __name__ == "__main__":
    main()
