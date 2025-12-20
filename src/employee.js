const nodemon = require('nodemon');
const { pool } = require('../initial');


// const get_user_profile = async (limit , offset) => {

  
//     const queryStr = `WITH department AS (
//     SELECT
//         log_depart.user_id,
//         jsonb_agg(
//             json_build_object(
//                 'department_name', tbl_department.department_name,
//                 'department_preflix', tbl_department.department_preflix,
//                 'department_id', tbl_department.department_id
//             ) ORDER BY log_depart.user_id ASC
//         ) AS depart
//     FROM log_depart
//     INNER JOIN tbl_department ON tbl_department.department_id = log_depart.department_id
//     GROUP BY log_depart.user_id
// ),
// sub_department AS (
//     SELECT
//         log_sub_dep.user_id,
//         jsonb_agg(
//             json_build_object(
//                 'sub_department_name', tbl_sub_department.sub_department_name,
//                 'sub_department_id', tbl_sub_department.sub_department_id
//             ) ORDER BY log_sub_dep.user_id ASC
//         ) AS subdepart
//     FROM log_sub_dep
//     INNER JOIN tbl_sub_department ON log_sub_dep.sub_department_id = tbl_sub_department.sub_department_id
//     GROUP BY log_sub_dep.user_id
// )
// SELECT 
//     tbl_user_profile.user_id,
//     tbl_user_profile.p_name,
//     tbl_user_profile.f_name,
//     tbl_user_profile.l_name,
//     tbl_user_profile.phone,
//     tbl_user_profile.email,
//     tbl_user_profile.active,
//     tbl_user_profile.start_date,
//     tbl_user_profile.picture,
//     tbl_user_profile.cid,
//     tbl_user_profile.nickname,
//     tbl_user_profile.end_date,
//     tbl_user_profile.religion,
//     tbl_user_profile.remark_end,
//     tbl_user_profile.birthday,
//     tbl_user_profile.sex,
//     tbl_user_profile.book,
//     tbl_user_profile.emp_code,
//     tbl_role.role_name,
//     department.depart,
//     sub_department.subdepart
// FROM tbl_user_profile
// INNER JOIN department ON department.user_id = tbl_user_profile.user_id
// INNER JOIN sub_department ON sub_department.user_id = tbl_user_profile.user_id
// LEFT JOIN tbl_role ON tbl_user_profile.role_id = tbl_role.role_id
// GROUP BY   
//     tbl_user_profile.user_id,
//     tbl_user_profile.p_name,
//     tbl_user_profile.f_name,
//     tbl_user_profile.l_name,
//     tbl_user_profile.phone,
//     tbl_user_profile.email,
//     tbl_user_profile.active,
//     tbl_user_profile.start_date,
//     tbl_user_profile.picture,
//     tbl_user_profile.cid,
//     tbl_user_profile.nickname,
//     tbl_user_profile.end_date,
//     tbl_user_profile.religion,
//     tbl_user_profile.remark_end,
//     tbl_user_profile.birthday,
//     tbl_user_profile.sex,
//     tbl_user_profile.book,
//     tbl_user_profile.emp_code,
//     tbl_role.role_name,
//     department.depart,
//     sub_department.subdepart
// ORDER BY tbl_user_profile.user_id ASC
// LIMIT ${limit} OFFSET ${offset};   

                 
//             `;
//     return await getPoolQuery(queryStr, 'get_user_profile');

// }


async function get_user_profile(limit, offset) {
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
ORDER BY tbl_user_profile.user_id ASC
LIMIT $1 OFFSET $2;   `;
    const res = await pool.query(queryStr, [limit, offset]);
    return res.rows;
}

async function count_user_profile() {
    const sql = `SELECT COUNT(*) as total FROM tbl_user_profile`;
    const res = await pool.query(sql);
    return res.rows[0];
}





const getDataByUser = async (user_id) => {
    const queryStr = `WITH department AS (
                        SELECT
                            DISTINCT log_depart.user_id,
                            jsonb_agg(
                                json_build_object(
                                    'department_name',tbl_department.department_name,
                                    'department_preflix',tbl_department.department_preflix,
                                    'department_id',tbl_department.department_id
                                 
                                ) ORDER BY log_depart.user_id ASC
                            ) as depart
                        FROM log_depart
                        INNER JOIN tbl_department ON tbl_department.department_id = log_depart.department_id
                        WHERE log_depart.user_id = $1
                        GROUP BY log_depart.user_id
                        ORDER BY log_depart.user_id ASC
                    ),
                    sub_department AS (
                        SELECT
                            DISTINCT log_sub_dep.user_id,
                            jsonb_agg(
                                json_build_object(
                                   
                                    'sub_department_name',tbl_sub_department.sub_department_name,
                                    'sub_department_id',tbl_sub_department.sub_department_id
                                ) ORDER BY log_sub_dep.user_id ASC
                            ) as subdepart
                        FROM log_sub_dep
                        INNER JOIN tbl_sub_department ON log_sub_dep.sub_department_id = tbl_sub_department.sub_department_id
                        WHERE log_sub_dep.user_id = $1
                        GROUP BY log_sub_dep.user_id
                        ORDER BY log_sub_dep.user_id ASC
                    )
                    ,
                    address_main AS (
                        SELECT
                            DISTINCT tbl_address_main.emp_code,
                            jsonb_agg(
                                json_build_object(
                                   
                                    'address_name',tbl_address_main.address_name,
                                    'road',tbl_address_main.road,
                                    'province',tbl_address_main.province,
                                    'district',tbl_address_main.district,
                                    'district1',tbl_address_main.district1,
                                    'district2',tbl_address_main.district2,
                                    'zipcode',tbl_address_main.zipcode                                    
                                ) ORDER BY tbl_address_main.emp_code ASC
                            ) as main
                        FROM tbl_address_main
                        INNER JOIN tbl_user_profile ON tbl_user_profile.emp_code = tbl_address_main.emp_code
                        GROUP BY tbl_address_main.emp_code
                        ORDER BY tbl_address_main.emp_code ASC
                        ),
                          address_sub AS (
                        SELECT
                            DISTINCT tbl_address_sub.emp_code,
                            jsonb_agg(
                                json_build_object(
                                   
                                    'address_name',tbl_address_sub.address_name,
                                    'road',tbl_address_sub.road,
                                    'province',tbl_address_sub.province,
                                    'district',tbl_address_sub.district,
                                    'district1',tbl_address_sub.district1,
                                    'district2',tbl_address_sub.district2,
                                     'zipcode',tbl_address_sub.zipcode


                                ) ORDER BY tbl_address_sub.emp_code ASC
                            ) as subs
                        FROM tbl_address_sub
                        INNER JOIN tbl_user_profile ON tbl_user_profile.emp_code = tbl_address_sub.emp_code
                        GROUP BY tbl_address_sub.emp_code
                        ORDER BY tbl_address_sub.emp_code ASC
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
                        sub_department.subdepart,
                        address_sub.subs,
                        address_main.main
                    FROM tbl_user_profile
                    INNER JOIN department ON department.user_id = tbl_user_profile.user_id
                    INNER JOIN sub_department ON sub_department.user_id = tbl_user_profile.user_id
                    INNER JOIN address_main on tbl_user_profile.emp_code = address_main.emp_code
                    INNER JOIN address_sub on tbl_user_profile.emp_code = address_sub.emp_code
                    LEFT JOIN tbl_role ON tbl_user_profile.role_id = tbl_role.role_id
                   WHERE tbl_user_profile.user_id = $1 
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
                        sub_department.subdepart,
                        address_sub.subs,
                        address_main.main `;
    const queryValues = [user_id];
    return await pool.query(queryStr, queryValues)
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

}

const getDataAllUser = async () => {
    const queryStr = `WITH department AS (
                        SELECT
                            DISTINCT log_depart.user_id,
                            jsonb_agg(
                                json_build_object(
                                    'department_name',tbl_department.department_name,
                                    'department_preflix',tbl_department.department_preflix,
                                    'department_id',tbl_department.department_id
                                 
                                ) ORDER BY log_depart.user_id ASC
                            ) as depart
                        FROM log_depart
                        INNER JOIN tbl_department ON tbl_department.department_id = log_depart.department_id
                        GROUP BY log_depart.user_id
                        ORDER BY log_depart.user_id ASC
                    ),
                    sub_department AS (
                        SELECT
                            DISTINCT log_sub_dep.user_id,
                            jsonb_agg(
                                json_build_object(
                                   
                                    'sub_department_name',tbl_sub_department.sub_department_name,
                                    'sub_department_id',tbl_sub_department.sub_department_id
                                ) ORDER BY log_sub_dep.user_id ASC
                            ) as subdepart
                        FROM log_sub_dep
                        INNER JOIN tbl_sub_department ON log_sub_dep.sub_department_id = tbl_sub_department.sub_department_id
                        GROUP BY log_sub_dep.user_id
                        ORDER BY log_sub_dep.user_id ASC
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
                        sub_department.subdepart `;
        await getPoolQuery(queryStr ,'getDataAllUser' )
      
}




const getdepartment = async () => {
    const queryStr = `SELECT * FROM tbl_department`;
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

const getSubdepartment = async () => {
    const queryStr = `SELECT * FROM tbl_sub_department`;
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

const reqTotransactionItemsReceiveWaitPo = async (rev, item) => {
    console.log(rev, "ReceiveT")
    console.log(item, "Items")

    try {
        await pool.query('BEGIN');
        let queryStr = ''
        let queryValue = []

        //insert data to table st_receive_transaction
        queryStr = `INSERT INTO st_receive_transaction( po_id, rt_date, rt_time, invoid_id, vender_id, user_id)
        VALUES (0, CURRENT_DATE, CURRENT_TIME, 'รับเข้าแบบไม่รอใบเสนอราคา',$1,$2) RETURNING receive_id; `
        queryValue = [rev.vender_id, rev.user_id]
        const receive = await pool.query(queryStr, queryValue);

        const next = await getLastSeq()
        console.log(next.msg.last_value)

        const date = formatDate(new Date());
        const JOint = ["DMS", date, next.msg.last_value].join("-")

        queryStr = `INSERT INTO public.st_ticket(ticket_name) VALUES ('${JOint}') RETURNING ticket_id; `
        const ticketId = await pool.query(queryStr);
        console.log(ticketId.rows[0].ticket_id)


        for (const data of item) {
            console.log(data, "DATA")
            //insert product table st_receive_items
            queryStr = `INSERT INTO st_receive_items(
                po_item_id, qty_receive, receive_id)
                VALUES (0, $1, $2) RETURNING item_id;`;
            queryValue = [data.qty_receive, receive.rows[0].receive_id];
            const itemId = await pool.query(queryStr, queryValue);

            //insert st_wait_po
            queryStr = `INSERT INTO st_wait_product(wait_product_name,wait_part_no,job_no,wait_product_type,wait_units,wait_qty,ticket_id,receive_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8); `
            queryValue = [data.wait_product_name, data.wait_part_no, data.job_no, data.wait_product_type, data.wait_units, data.qty_receive, ticketId.rows[0].ticket_id, receive.rows[0].receive_id];
            await pool.query(queryStr, queryValue);

            for (let i = 0; i < parseInt(data.qty_receive); i++) {
                queryStr = `INSERT INTO st_common(item_id,gen_barcode,print_qr,withdraw) VALUES ($1,'รับเข้าแบบไม่มีเลข PO','Y','Y'); `
                queryValue = [itemId.rows[0].item_id,];
                await pool.query(queryStr, queryValue);
            }



        }
        await pool.query('COMMIT');
        return { status: 200, msg: 'success' }
    }
    catch (err) {
        await pool.query('ROLLBACK');
        console.log(err);
        return { status: 400, msg: 'error' }
    }
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


module.exports = { 
get_user_profile ,
getDataByUser,
count_user_profile,
getdepartment,
getSubdepartment
};