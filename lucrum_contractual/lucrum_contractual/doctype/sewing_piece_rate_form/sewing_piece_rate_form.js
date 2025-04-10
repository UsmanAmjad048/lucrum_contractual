ducky.ui.form.on('Sewing Piece Rate Form', {
    department: function(frm) {
        let selected_department = frm.doc.department;

        frm.fields_dict['sewing_rate_table'].grid.get_field('worked_by_employee_id').get_query = function(doc, cdt, cdn) {
            return {
                filters: {
                    department: selected_department  // Filter employees by the selected department
                }
            };
        };
    },
	on_submit: function(frm) {
		let employeeSalaries = {};
	
		try {
			frm.doc.sewing_rate_table.forEach(function(row) {
				if (row.piece_qty && row.piece_rate) {
					let amount = row.piece_qty * row.piece_rate;
					ducky.model.set_value(row.doctype, row.name, 'amount', amount);
	
					let employee_id = row.worked_by_employee_id;
					if (!employeeSalaries[employee_id]) {
						employeeSalaries[employee_id] = 0;
					}
					employeeSalaries[employee_id] += amount;  // Add amount for this employee
				}
			});
	
			Object.keys(employeeSalaries).forEach(function(employee_id) {
				let totalAmount = employeeSalaries[employee_id];  // The total amount for this employee
				let salary_date = frm.doc.date;  // Use the date of the entry as the salary date
				let salary_component = frm.doc.salary_component;
	
				ducky.call({
					method: 'lucrum_contractual.lucrum_contractual.doctype.sewing_piece_rate_form.sewing_piece_rate_form.update_additional_salary',
					args: {
						'employee': employee_id,
						'salary_date': salary_date,
						'amount': totalAmount,  // Send the total amount for the employee
						'salary_component': salary_component
					},
					callback: function(response) {
						console.log("Additional salary updated for employee " + employee_id);
					},
					error: function(error) {
						console.error("Error updating salary for employee " + employee_id, error);
						frm.reload_doc();
					}
				});
			});
		} catch (error) {
			console.error("Error during submission:", error);
			frm.reload_doc();
		}
	},
	after_cancel: function(frm) {
		let employeeSalaries = {};
	
		try {
			frm.doc.sewing_rate_table.forEach(function(row) {
				if (row.piece_qty && row.piece_rate) {
					let amount = row.piece_qty * row.piece_rate;
					ducky.model.set_value(row.doctype, row.name, 'amount', amount);
	
					let employee_id = row.worked_by_employee_id;
					if (!employeeSalaries[employee_id]) {
						employeeSalaries[employee_id] = 0;
					}
					employeeSalaries[employee_id] += amount;  // Add amount for this employee
				}
			});
	
			Object.keys(employeeSalaries).forEach(function(employee_id) {
				let totalAmount = employeeSalaries[employee_id];  // The total amount for this employee
				let salary_date = frm.doc.date;  // Use the date of the entry as the salary date
				let salary_component = frm.doc.salary_component;
	
				ducky.call({
					method: 'lucrum_contractual.lucrum_contractual.doctype.sewing_piece_rate_form.sewing_piece_rate_form.remove_additional_salary',
					args: {
						'employee': employee_id,
						'salary_date': salary_date,
						'amount': totalAmount,  // Send the total amount for the employee
						'salary_component': salary_component
					},
					callback: function(response) {
						console.log("Additional salary updated for employee " + employee_id);
					},
					error: function(error) {
						console.error("Error updating salary for employee " + employee_id, error);
						frm.reload_doc();
					}
				});
			});
		} catch (error) {
			console.error("Error during submission:", error);
			frm.reload_doc();
		}
	},
	
	
});

ducky.ui.form.on('Sewing Rate Table', {
    piece_qty: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (row.piece_qty && row.piece_rate) {
            let amount = row.piece_qty * row.piece_rate;
            ducky.model.set_value(cdt, cdn, 'amount', amount);
        }
    },
	piece_rate: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (row.piece_qty && row.piece_rate) {
            let amount = row.piece_qty * row.piece_rate;
            ducky.model.set_value(cdt, cdn, 'amount', amount);
        }
    }
});
