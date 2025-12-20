const { pool } = require('../initial');

const insert_log_data = async (data , log_name) => {
  try {
    await pool.query("BEGIN");
    const queryStr = `
      INSERT INTO log_data 
      ( data_log, log_name)
      VALUES ($1,$2)
    `;
    const queryValues = [data, log_name];

    await pool.query(queryStr, queryValues);
    await pool.query("COMMIT");

    return { status: 200, msg: 'success' };

  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: 'ERROR', error };
  }
};
const transaction_insert = async (data, name) => {
  console.log('aaaaaaaaaaaaaaaaaaaaaaa', name)
  let statusg = {}   // ใช้ let

  try {
    if (name === 'salary_transaction') {
      statusg = await insert_salary_transaction(data, name)
    }
    if (name === 'department_transaction') {
      statusg = await insert_department_transaction(data, name)
    }

    // console.log(statusg.status)
        return { status: statusg.status, msg: 'success' };


  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: 'ERROR', error };
  }
}



const insert_salary_transaction = async (data ,name) => {
  console.log('data na ja', data);
  try {
    await pool.query("BEGIN");

    // สร้าง value placeholders
    const values = [];
    const placeholders = data.map((add, i) => {
      const idx = i * 4;
      values.push(add.emp_code, add.old_salary, add.new_salary, add.user_approve_emp_code);
      return `( $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`;
    }).join(", ");

    const queryStr = `
      INSERT INTO salary_transaction 
      ( emp_code, old_salary, new_salary, user_approve_emp_code)
      VALUES ${placeholders}
    `;

    await pool.query(queryStr, values);
    await pool.query("COMMIT");
    await insert_log_data(data , name)
    return { status: 200, msg: 'success' };

  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: 'ERROR', error };
  }
};




const insert_department_transaction = async (data,name) => {
  try {
    await pool.query("BEGIN");

    // สร้าง value placeholders
    const values = [];
    const placeholders = data.map((add, i) => {
      const idx = i * 4;
      values.push(add.emp_code, add.old_department, add.new_department, add.user_approve_emp_code);
      return `( $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`;
    }).join(", ");

    const queryStr = `
      INSERT INTO department_transaction 
      ( emp_code, old_department, new_department, user_approve_emp_code)
      VALUES ${placeholders}
    `;

    await pool.query(queryStr, values);
    await pool.query("COMMIT");
    await insert_log_data(data , name)
    return { status: 200, msg: 'success' };

  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: 'ERROR', error };
  }
};


module.exports = { 
transaction_insert
};