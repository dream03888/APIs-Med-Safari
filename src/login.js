const { pool } = require('../initial');

const hashPassword = (password) => {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(password))
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    });
}


const userLogin = async (username, password) => {
    console.log('username', username);
      const encodedPassword = await hashPassword(password);
      console.log('encodedPassword', encodedPassword);
      
      
      const queryStr = `SELECT 
      tbl_user_profile.user_id,
      tbl_user_login.emp_code,
      tbl_user_profile.nickname,
      tbl_user_profile.sex,
      p_name,
      f_name,
      l_name
      FROM tbl_user_profile
      LEFT JOIN tbl_party_code ON tbl_user_profile.party_code = tbl_party_code.party_code
      LEFT JOIN tbl_user_login ON tbl_user_profile.emp_code = tbl_user_login.emp_code
      WHERE tbl_user_login.username = $1 AND password = $2; `;
      const queryValues = [username, encodedPassword];
      return await pool.query(queryStr, queryValues)
      .then(async (result) => {
    await log_login(username, encodedPassword, result.rows[0].emp_code);
            if (result.rows && result.rows.length > 0) {
                return {
                    status: 200,
                    msg: result.rows,
                    
                };
            } else {
                return {
                    status: 204,
                    msg: [],
                };
            }
        })
        .catch((err) => {
            console.log("ERROR AT PG QUERY - getdataProductid");
            console.log(err);
            return {
                status: 500,
                msg: "INTERNAL ERROR",
            };
        });

}


const log_login = async (data) => {
  try {
    await pool.query("BEGIN");

    // สร้าง value placeholders
    
    const queryStr = `
     INSERT INTO log_login (user_name, passwrod  , emp_code ,date , time) VALUES ($1,$2,$3,CURRENT_DATE,CURRENT_TIME);
    `;
    const values = [data.user_name, data.passwrod, data.emp_code];

    await pool.query(queryStr, values);
    await pool.query("COMMIT");
    return { status: 200, msg: 'success' };

  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: 'ERROR', error };
  }
};

module.exports = { 
userLogin 

};