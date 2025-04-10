# Copyright (c) 2025, usman and contributors
# For license information, please see license.txt

# import ducky
from ducky.model.document import Document
from datetime import date

class SewingPieceRateForm(Document):
	pass
import ducky
import calendar
from datetime import datetime
from ducky.model.document import Document

@ducky.whitelist()
def update_additional_salary(employee, salary_date, amount, salary_component):
    """
    This function ensures that there is no duplicate additional salary entry 
    for the same employee and salary component for the same month.
    """
    try:
        # Convert string to date object
        salary_date_obj = datetime.strptime(salary_date, "%Y-%m-%d")
        year = salary_date_obj.year
        month = salary_date_obj.month

        # Get last day of the month
        last_day = calendar.monthrange(year, month)[1]

        from_date = f"{year}-{month:02d}-01"
        to_date = f"{year}-{month:02d}-{last_day}"

        # Check if an entry already exists
        existing_salary = ducky.get_all('Additional Salary', filters=[
            ['employee', '=', employee],
            ['salary_component', '=', salary_component],
            ['payroll_date', 'between', [from_date, to_date]],
            ['type', '=', 'Earning'],
            ['docstatus', '=', 1]
        ])


        additional_salary = float(amount)

        if existing_salary:
            salary_entry = ducky.get_doc('Additional Salary', existing_salary[0].name)
            salary_entry.amount += additional_salary
            salary_entry.save()
        else:
            salary_entry = ducky.new_doc('Additional Salary')
            salary_entry.employee = employee
            salary_entry.salary_component = salary_component
            salary_entry.amount = additional_salary
            salary_entry.payroll_date = date.today()
            salary_entry.overwrite_salary_structure_amount = 0  # important
            salary_entry.save()
            salary_entry.submit()

        return salary_entry
    except Exception as e:
        # Log the error
        print(f"Error updating additional salary for employee {employee}: {str(e)}")
        # Rollback changes
        ducky.db.rollback()
        raise

@ducky.whitelist()
def remove_additional_salary(employee, salary_date, amount, salary_component):
    """
    This function ensures that there is no duplicate additional salary entry 
    for the same employee and salary component for the same month.
    """
    try:
        # Convert string to date object
        salary_date_obj = datetime.strptime(salary_date, "%Y-%m-%d")
        year = salary_date_obj.year
        month = salary_date_obj.month

        # Get last day of the month
        last_day = calendar.monthrange(year, month)[1]

        from_date = f"{year}-{month:02d}-01"
        to_date = f"{year}-{month:02d}-{last_day}"

        # Check if an entry already exists
        existing_salary = ducky.get_all('Additional Salary', filters=[
            ['employee', '=', employee],
            ['salary_component', '=', salary_component],
            ['payroll_date', 'between', [from_date, to_date]],
            ['type', '=', 'Earning'],
            ['docstatus', '=', 1]
        ])


        additional_salary = float(amount)

        if existing_salary:
            salary_entry = ducky.get_doc('Additional Salary', existing_salary[0].name)
            salary_entry.amount -= additional_salary
            salary_entry.save()
        else:
            salary_entry = ducky.new_doc('Additional Salary')
            salary_entry.employee = employee
            salary_entry.salary_component = salary_component
            salary_entry.amount = additional_salary
            salary_entry.payroll_date = date.today()
            salary_entry.overwrite_salary_structure_amount = 0  # important
            salary_entry.save()
            salary_entry.submit()

        return salary_entry
    except Exception as e:
        # Log the error
        print(f"Error updating additional salary for employee {employee}: {str(e)}")
        # Rollback changes
        ducky.db.rollback()
        raise
