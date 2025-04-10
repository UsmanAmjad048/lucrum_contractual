ducky.ui.form.on('Sewing Piece Rate Form', {
    department: function(frm) {
        // Get the selected department from the main form
        let selected_department = frm.doc.department;

        // Apply filter to the 'worked_by_employee_id' field in the child table
        frm.fields_dict['sewing_rate_table'].grid.get_field('worked_by_employee_id').get_query = function(doc, cdt, cdn) {
            return {
                filters: {
                    department: selected_department  // Filter employees by the selected department
                }
            };
        };
    }
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
