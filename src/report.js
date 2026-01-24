const nodemon = require('nodemon');
const { pool } = require('../initial');


const Report_format = async (name) => {
  console.log('aaaaaaaaaaaaaaaaaaaaaaa', name)
  let statusg = {}   // ใช้ let
  try {
    if (name === 'user_profile') {
          console.log('user_profile', name)

      statusg = await report_all_data_user()
    }
    if (name === 'salary') {
      statusg = await report_salary()
    }

    // console.log(statusg.status)
        return { status: statusg.status, msg: statusg.msg };


  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: 'ERROR', error };
  }
}


const report_all_data_user = async () => {
    const queryStr = `WITH department AS (
    SELECT
        log_depart.user_id,
        jsonb_agg(
            json_build_object(
                'department_name', tbl_department.department_name,
                'department_preflix', tbl_department.department_preflix,
                'department_id', tbl_department.department_id
            ) ORDER BY log_depart.user_id ASC
        ) AS depart
    FROM log_depart
    INNER JOIN tbl_department ON tbl_department.department_id = log_depart.department_id
    GROUP BY log_depart.user_id
),
sub_department AS (
    SELECT
        log_sub_dep.user_id,
        jsonb_agg(
            json_build_object(
                'sub_department_name', tbl_sub_department.sub_department_name,
                'sub_department_id', tbl_sub_department.sub_department_id
            ) ORDER BY log_sub_dep.user_id ASC
        ) AS subdepart
    FROM log_sub_dep
    INNER JOIN tbl_sub_department ON log_sub_dep.sub_department_id = tbl_sub_department.sub_department_id
    GROUP BY log_sub_dep.user_id
)
SELECT 
    tbl_user_profile.user_id,
    tbl_user_profile.p_name,
    tbl_user_profile.f_name,
    tbl_user_profile.l_name,
    tbl_user_profile.phone,
    tbl_user_profile.email,
    tbl_user_profile.active,
    tbl_user_profile.start_date,
    tbl_user_profile.picture,
    tbl_user_profile.cid,
    tbl_user_profile.nickname,
    tbl_user_profile.end_date,
    tbl_user_profile.religion,
    tbl_user_profile.remark_end,
    tbl_user_profile.birthday,
    tbl_user_profile.sex,
    tbl_user_profile.book,
    tbl_user_profile.emp_code,
    tbl_role.role_name,
    department.depart,
    sub_department.subdepart
FROM tbl_user_profile
INNER JOIN department ON department.user_id = tbl_user_profile.user_id
INNER JOIN sub_department ON sub_department.user_id = tbl_user_profile.user_id
LEFT JOIN tbl_role ON tbl_user_profile.role_id = tbl_role.role_id
GROUP BY   
    tbl_user_profile.user_id,
    tbl_user_profile.p_name,
    tbl_user_profile.f_name,
    tbl_user_profile.l_name,
    tbl_user_profile.phone,
    tbl_user_profile.email,
    tbl_user_profile.active,
    tbl_user_profile.start_date,
    tbl_user_profile.picture,
    tbl_user_profile.cid,
    tbl_user_profile.nickname,
    tbl_user_profile.end_date,
    tbl_user_profile.religion,
    tbl_user_profile.remark_end,
    tbl_user_profile.birthday,
    tbl_user_profile.sex,
    tbl_user_profile.book,
    tbl_user_profile.emp_code,
    tbl_role.role_name,
    department.depart,
    sub_department.subdepart
ORDER BY tbl_user_profile.user_id ASC;`;
    return await getPoolQuery(queryStr, 'get_user_profile');
}

const report_salary = async () => {
    const queryStr = `SELECT tbl_user_profile.emp_code , 
tbl_user_profile.p_name ,
tbl_user_profile.f_name,
tbl_user_profile.l_name ,
old_salary ,
 new_salary ,
  date,
  time,
  admin.p_name,
  admin.f_name,
  admin.l_name 
  
  FROM salary_transaction
INNER JOIN tbl_user_profile on salary_transaction.emp_code = tbl_user_profile.emp_code
INNER JOIN tbl_user_profile as admin ON salary_transaction.user_approve_emp_code = admin.emp_code;`;
    return await getPoolQuery(queryStr, 'report_salary');
}


const getPoolQuery = async (queryStr, funtions) => {
    try {
        return pool.query(queryStr)
            .then((result) => {
                if (result.rows.length < 1) {
                    return { status: 200, msg: [] }
                }
                return { status: 200, msg: result.rows }
            })
            .catch((error) => {
                console.log('Error Funtions ' + funtions + '() : ' + error);
                return { status: 201, msg: error }
            })
    }
    catch (error) {
        console.log('Error Connect : ' + error);
        return { status: 400, msg: error }
    }
}















const getDataAllHistory = async (startDate , endDate) => {
  const queryStr = `                     WITH disease AS (
      SELECT 
          mt.transaction_id,
          string_agg(
                '(' || md.disease_id || ' ) ' || md.disease_eng ,', '
              ) AS list
      FROM med_transaction mt
      INNER JOIN med_disease md 
          ON NULLIF(mt.disease_code, '')::int = md.disease_id
      GROUP BY  mt.transaction_id
  ),
  Drug AS (
      SELECT 
          drug_transaction.transaction_id,
          string_agg(
              drugitems.generic_name || ' : ' || drugitems.sig || '    x' || drug_transaction.qty || ' ' || drug_transaction.units, ', '
          ) AS list
      FROM drug_transaction 
      LEFT JOIN drugitems  
          ON drug_transaction.drug_id = drugitems.drug_id
      GROUP BY  drug_transaction.transaction_id
  ),
  Violence AS (
      SELECT 
          med_violence_transaction.emp_code,
          string_agg('(' || drugitems.drug_id || ') ' || drugitems.generic_name, ', ') AS danger_list
      FROM med_violence_transaction
      LEFT JOIN drugitems 
          ON med_violence_transaction.drug_id = drugitems.drug_id
      LEFT JOIN med_violence_status 
          ON med_violence_status.violence_id = NULLIF(med_violence_transaction.violence_status, '')::int
      GROUP BY med_violence_transaction.emp_code
  )
  SELECT 
      med_transaction_head.transaction_id,
      med_transaction_head.date AS tx_date,
      med_transaction_head.time AS tx_time,
      CASE
          WHEN p_name IN ('นาง','นางสาว','นส.','น.ส.') THEN 'หญิง'
          WHEN p_name = 'นาย' THEN 'ชาย'
          ELSE 'ไม่ระบุ'
      END AS sex,
      CONCAT(p_name,' ',f_name,' ',l_name) AS fullname,
      nationality,
      remark1,
      COALESCE(disease.list, '') AS disease,
      COALESCE(Drug.list, '') AS drugitems,
      COALESCE(Violence.danger_list, '') AS violence,
      location,
      remark,
      tbl_party_code.party_name,
med_transaction_head.come
  FROM med_transaction_head
  LEFT JOIN tbl_user_profile 
      ON med_transaction_head.emp_code = tbl_user_profile.emp_code
  LEFT JOIN tbl_party_code on tbl_party_code.party_code = tbl_user_profile.party_code
  LEFT JOIN disease 
      ON med_transaction_head.transaction_id = disease.transaction_id
  LEFT JOIN Drug 
      ON med_transaction_head.transaction_id = Drug.transaction_id
  LEFT JOIN Violence 
      ON med_transaction_head.emp_code = Violence.emp_code 
  WHERE date >= COALESCE(NULLIF($1, '')::timestamp, CURRENT_DATE)
         AND date <= COALESCE(NULLIF($2, '')::timestamp, CURRENT_DATE)
          AND med_transaction_head.type_people = '1'
  ORDER BY tx_date ASC , tx_time ASC; `;
  const queryValues = [startDate, endDate];
  return await pool
    .query(queryStr, queryValues)
    .then(async (result) => {
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
};










const getDataOutAllHistory = async (startDate , endDate) => {
  const queryStr = `                     WITH disease AS (
      SELECT 
          mt.transaction_id,
          string_agg(
                '(' || md.disease_id || ' ) ' || md.disease_eng ,', '
              ) AS list
      FROM med_transaction mt
      INNER JOIN med_disease md 
          ON NULLIF(mt.disease_code, '')::int = md.disease_id
      GROUP BY  mt.transaction_id
  ),
  Drug AS (
      SELECT 
          drug_transaction.transaction_id,
          string_agg(
              drugitems.generic_name || ' : ' || drugitems.sig || '    x' || drug_transaction.qty || ' ' || drug_transaction.units, ', '
          ) AS list
      FROM drug_transaction 
      LEFT JOIN drugitems  
          ON drug_transaction.drug_id = drugitems.drug_id
      GROUP BY  drug_transaction.transaction_id
  ),
  Violence AS (
      SELECT 
          med_violence_transaction.emp_code,
          string_agg('(' || drugitems.drug_id || ') ' || drugitems.generic_name, ', ') AS danger_list
      FROM med_violence_transaction
      LEFT JOIN drugitems 
          ON med_violence_transaction.drug_id = drugitems.drug_id
      LEFT JOIN med_violence_status 
          ON med_violence_status.violence_id = NULLIF(med_violence_transaction.violence_status, '')::int
      GROUP BY med_violence_transaction.emp_code
  )
  SELECT 
      med_transaction_head.transaction_id,
      med_transaction_head.date AS tx_date,
      med_transaction_head.time AS tx_time,
      CASE
          WHEN p_name IN ('นาง','นางสาว','นส.','น.ส.') THEN 'หญิง'
          WHEN p_name = 'นาย' THEN 'ชาย'
          ELSE 'ไม่ระบุ'
      END AS sex,
      CONCAT(p_name,' ',f_name,' ',l_name) AS fullname,
      nationality,
      remark1,
      COALESCE(disease.list, '') AS disease,
      COALESCE(Drug.list, '') AS drugitems,
      COALESCE(Violence.danger_list, '') AS violence,
      location,
      remark,
      tbl_party_code.party_name,
med_transaction_head.come
  FROM med_transaction_head
  LEFT JOIN tbl_user_profile 
      ON med_transaction_head.emp_code = tbl_user_profile.emp_code
  LEFT JOIN tbl_party_code on tbl_party_code.party_code = tbl_user_profile.party_code
  LEFT JOIN disease 
      ON med_transaction_head.transaction_id = disease.transaction_id
  LEFT JOIN Drug 
      ON med_transaction_head.transaction_id = Drug.transaction_id
  LEFT JOIN Violence 
      ON med_transaction_head.emp_code = Violence.emp_code 
  WHERE date >= COALESCE(NULLIF($1, '')::timestamp, CURRENT_DATE)
         AND date <= COALESCE(NULLIF($2, '')::timestamp, CURRENT_DATE)
          AND med_transaction_head.type_people = '2'
  ORDER BY tx_date ASC , tx_time ASC; `;
  const queryValues = [startDate, endDate];
  return await pool
    .query(queryStr, queryValues)
    .then(async (result) => {
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
};







module.exports = { 
report_all_data_user,
report_salary,
Report_format,
getDataAllHistory,
getDataOutAllHistory
};