const nodemon = require("nodemon");
const { pool } = require("../initial");

const reqTotransaction = async (rev, vital) => {
  // console.log('vital', vital);
  console.log("rev", rev);

  try {
    await pool.query("BEGIN");
    let queryStr = "";
    let queryValue = [];
    const emp_code = rev.staffCode;
    const date = rev.visitDate;
    const time = rev.visitTime;
    const save_doctor = rev.doctorCode;
    const come = rev.come;
    const status = rev.status;
    const location = rev.location;

    const weight = rev.weight;
    const height = rev.height;
    const bmi = rev.bmi;
    const remark = rev.remark;
    const sex = rev.sex;
    const nationality = rev.country;
    const remark1 = rev.remark1;
    let type_people = "1";

    if (!emp_code || emp_code === "") {
      type_people = "2";
    }

    //insert data to table st_receive_transaction
    queryStr = `INSERT INTO med_transaction_head (
    emp_code,
    date,
    time,
    status,
    save_doctor,
    come,
    weight,
    height,
    bmi,
    location,
    remark,
    sex,
    nationality,
    remark1,
    type_people
)
VALUES (
    $1, 
    CURRENT_DATE, 
    CURRENT_TIME, 
    $2,
    $3, 
    $4, 
    $5, 
    $6, 
    $7, 
    $8, 
    $9, 
    $10, 
    $11, 
    $12, 
    $13
)
RETURNING transaction_id; `;
    queryValue = [
      emp_code,
      status,
      save_doctor,
      come,
      weight,
      height,
      bmi,
      location,
      remark,
      sex,
      nationality,
      remark1,
      type_people,
    ];
    const receive = await pool.query(queryStr, queryValue);

    const systolic = vital.sbp;
    const systolic_remark = vital.systolic_remark;
    const diastolic = vital.dbp;
    const diastolic_remark = vital.diastolic_remark;
    const sp_02 = vital.spo2;
    const sp_02_reamrk = vital.spo2_remark;
    const pulse = vital.pulse;
    const pulse_remark = vital.pulse_remark;
    const rr = vital.rr;
    const rr_remark = vital.rr_remark;
    const temp = vital.temp;
    const temp_remark = vital.temp_remark;

    queryStr = ` INSERT INTO med_standard_value (
                systolic ,
                 systolic_remark ,
                 diastolic ,
                 diastolic_remark , 
                 sp_02 , 
                 sp_02_reamrk , 
                 pulse ,
                 pulse_remark , 
                 rr , 
                 rr_remark , 
                 emp_code,
                 temp,
                 temp_remark) 
                 VALUES($1 ,$2 , $3 , $4 , $5 , $6 , $7, $8 ,$9 ,$10 ,$11 , $12, $13)`;
    queryValue = [
      systolic,
      systolic_remark,
      diastolic,
      diastolic_remark,
      sp_02,
      sp_02_reamrk,
      pulse,
      pulse_remark,
      rr,
      rr_remark,
      emp_code,
      temp,
      temp_remark,
    ];
    await pool.query(queryStr, queryValue);

    const values = [];
    const resloop = [];

    const placeholders = rev.drugs
      .map((add, i) => {
        const idx = i * 5;
        values.push(
          add.drug_id,
          add.qty,
          add.remark,
          receive.rows[0].transaction_id,
          add.units
        );
        return `( $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${
          idx + 5
        })`;
      })
      .join(", ");

    queryStr = `
      INSERT INTO drug_transaction ( drug_id, qty, remark , transaction_id , units )
     VALUES ${placeholders} RETURNING transaction_id 
    `;
    await pool.query(queryStr, values);

    for (const add of rev.drugs) {
  const queryStr = `
    UPDATE drugitems
    SET remain = remain - $1
    WHERE drug_id = $2
    RETURNING drug_id;
  `;

  const values = [add.qty, add.drug_id];
  await pool.query(queryStr, values);
}

    const send = rev.disease
      .map((add, i) => {
        const idx = i * 3;
        resloop.push(
          add.disease_id,
          add.example,
          receive.rows[0].transaction_id
        );
        return `( $${idx + 1}, $${idx + 2}, $${idx + 3})`;
      })
      .join(", ");

    queryStr = `
       INSERT INTO med_transaction ( disease_code, remark , transaction_id )
  VALUES ${send}
    `;
    await pool.query(queryStr, resloop);


    await pool.query("COMMIT");
    return { status: 200, msg: "success" };
  } catch (err) {
    await pool.query("ROLLBACK");
    console.log(err);
    return { status: 400, msg: "error" };
  }
};

const getDisease = async () => {
  //โรคประจำตัว
  const queryStr = `SELECT 
 disease_id ,
 disease_th ,
 disease_eng ,
 example 
 FROM med_disease`;
  return await pool
    .query(queryStr)
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

const getDataDrugitems = async () => {
  //โรคประจำตัว
  const queryStr = `  SELECT 
  drug_id ,
  CONCAT(trade_name,' ','|',' ',model) as  trade_name ,
  generic_name ,
  sig,
  line1,
  strength,
  units,
  model,
  remain
  FROM drugitems`;
  return await pool
    .query(queryStr)
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
const getUername = async () => {
  //โรคประจำตัว
  const queryStr = `                     SELECT 
    u.user_id,
    u.emp_code,
    u.nickname,
    u.birthday,
    u.sex,
    u.p_name,
    u.f_name,
    u.l_name,
    (u.p_name || ' ' || u.f_name || ' ' || u.l_name) AS FullName,
    p.party_name AS department_name
FROM tbl_user_profile u
INNER JOIN tbl_party_code p ON u.party_code = p.party_code`;
  return await pool
    .query(queryStr)
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

const getPersonalDisase = async () => {
  //โรคประจำตัว
  const queryStr = `    SELECT id , p_disease_th , p_disease_eng FROM tbl_personal_disease`;
  return await pool
    .query(queryStr)
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
      console.log("ERROR AT PG QUERY - getPersonalDisase");
      console.log(err);
      return {
        status: 500,
        msg: "INTERNAL ERROR",
      };
    });
};

const req_insertPersoanl = async (emp_code, data) => {
  console.log(emp_code, data);
  try {
    const resloop = [];

    await pool.query("BEGIN");

    const send = data
      .map((add, i) => {
        const idx = i * 2;
        resloop.push(emp_code, add.id);
        return `( $${idx + 1}, $${idx + 2})`;
      })
      .join(", ");

    let queryStr = `
       INSERT INTO med_pernonal_disease_history ( emp_code, personal_id )
       VALUES ${send};`;
    await pool.query(queryStr, resloop);
    await pool.query("COMMIT");
    return { status: 200, msg: "success" };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: "ERROR", error };
  }
};

const req_Violence = async (emp_code, data) => {
  console.log(emp_code, data);
  try {
    const resloop = [];

    await pool.query("BEGIN");

    const send = data
      .map((add, i) => {
        const idx = i * 2;
        resloop.push(emp_code, add.id);
        return `( $${idx + 1}, $${idx + 2})`;
      })
      .join(", ");

    let queryStr = `
       INSERT INTO med_violence_transaction ( emp_code, drug_id )
       VALUES ${send};`;
    await pool.query(queryStr, resloop);
    await pool.query("COMMIT");
    return { status: 200, msg: "success" };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: "ERROR", error };
  }
};

//-------------แพ้ยา
const getDataDrugViolence = async (emp_code) => {
  const queryStr = ` SELECT 
   med_violence_transaction.drug_id ,
   emp_code,
   generic_name ,
   violence_name ,
   remark 
   FROM med_violence_transaction
   LEFT JOIN med_violence_status ON  NULLIF(med_violence_transaction.violence_status, '')::int = med_violence_status.violence_id
   LEFT JOIN drugitems ON med_violence_transaction.drug_id = drugitems.drug_id
   WHERE med_violence_transaction.emp_code = $1 ; `;
  const queryValues = [emp_code];
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

const HistoryData = async (emp_code) => {
  const queryStr = `  WITH disease AS (
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
             drugitems.generic_name || ' : ' || drugitems.sig || ' x' || drug_transaction.qty, ', '
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
     remark
 FROM med_transaction_head
 INNER JOIN tbl_user_profile 
     ON med_transaction_head.emp_code = tbl_user_profile.emp_code
 LEFT JOIN disease 
     ON med_transaction_head.transaction_id = disease.transaction_id
 LEFT JOIN Drug 
     ON med_transaction_head.transaction_id = Drug.transaction_id
 LEFT JOIN Violence 
     ON med_transaction_head.emp_code = Violence.emp_code 
 WHERE med_transaction_head.emp_code = $1
 ORDER BY tx_date DESC;; `;
  const queryValues = [emp_code];
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

const HistoryDataByDay = async (from, to) => {
  const queryStr = `                       WITH disease AS (
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
  const queryValues = [from, to];
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

const druginStore = async (limit, offset) => {
  console.log("limit:", limit, "offset:", offset);

  const queryStr = `
    SELECT
      generic_name,
      trade_name,
      CONCAT(remain, '/', sub_total) AS stock,
      expiration_date,
      sig,
      line1 ,
      strength,
      units,
      active,
      picture,
      type_id,
      alert,
      total,
      drug_id
    FROM public.drugitems
    ORDER BY expiration_date
    LIMIT $1 OFFSET $2;
  `;

  const queryValues = [
    Number(limit), // ⭐ ต้องเป็น number
    Number(offset),
  ];

  try {
    const result = await pool.query(queryStr, queryValues);

    return {
      status: 200,
      msg: result.rows,
    };
  } catch (err) {
    console.error("ERROR AT PG QUERY - druginStore");
    console.error(err);

    return {
      status: 500,
      msg: "INTERNAL ERROR",
    };
  }
};

const insert_drug = async (data) => {
  console.log(data.data.trade_name);
  try {
    await pool.query("BEGIN");

    // สร้าง value placeholders

    const queryStr = `
     INSERT INTO drugitems (trade_name , generic_name , sig , line1 , strength , expiration_date , units , active , picture , alert , type_id , total,sub_total)
     VALUES ($1 , $2 , $3 , $4 , $5 ,$6 , $7 , $8, $9, $10 , $11 , $12,$13)
    `;
    const values = [
      data.data.trade_name,
      data.data.generic_name,
      data.data.sig,
      data.data.line1,
      data.data.strength,
      data.data.expiration_date,
      data.data.units,
      data.data.active,
      data.data.picture,
      data.data.alert,
      data.data.type_id,
      data.data.total,
    ];

    await pool.query(queryStr, values);
    await pool.query("COMMIT");
    return { status: 200, msg: "success" };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: "ERROR", error };
  }
};

const update_drug = async (data) => {
  console.log(data.data.trade_name);
  try {
    await pool.query("BEGIN");

    // สร้าง value placeholders

    const queryStr = `
     UPDATE  drugitems SET trade_name = $1 ,
      generic_name  = $2, 
      sig = $3 , 
      line1 = $4 , 
      strength = $5 ,
      expiration_date = $6 , 
      units = $7, 
      active = $8, 
      picture = $9, 
      alert = $10, 
      type_id = $11 , 
      total =  total + $12,
      sub_total = sub_total + $13

      WHERE drug_id = $14
    
    `;
    const values = [
      data.data.trade_name,
      data.data.generic_name,
      data.data.sig,
      data.data.line1,
      data.data.strength,
      data.data.expiration_date,
      data.data.units,
      data.data.active,
      data.data.picture,
      data.data.alert,
      data.data.type_id,
      data.data.total,
      data.data.total,
      data.data.drug_id,
    ];

    await pool.query(queryStr, values);
    await pool.query("COMMIT");
    return { status: 200, msg: "success" };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return { status: 400, msg: "ERROR", error };
  }
};

const getDrugtype = async () => {
  //โรคประจำตัว
  const queryStr = `    SELECT type_id , type_name FROM tbl_drug_type`;
  return await pool
    .query(queryStr)
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
      console.log("ERROR AT PG QUERY - getPersonalDisase");
      console.log(err);
      return {
        status: 500,
        msg: "INTERNAL ERROR",
      };
    });
};

module.exports = {
  getDisease,
  getDataDrugitems,
  getUername,
  reqTotransaction,
  getPersonalDisase,
  req_insertPersoanl,
  req_Violence,
  getDataDrugViolence,
  HistoryData,
  HistoryDataByDay,
  druginStore,
  insert_drug,
  getDrugtype,
  update_drug,
};
