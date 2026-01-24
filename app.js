const express = require("express");
const router = express.Router();


const { io, pool } = require("./initial");
    const login = require("./src/login.js");
    const drug = require("./src/drug.js");
    const report = require("./src/report.js");



const { error } = require("console");


io.on("connection", (socket) => {
    console.log(`Socket connect id: ${socket.id}`);

// LOGIN--------------------------------------------
        socket.on("get_user_login", async (username, password) => {
        const result = await login.userLogin(username, password);
        socket.emit("return_get_user_login", result);
    });
//---------------------------------------------------
        socket.on("get_disease", async () => {
        const result = await drug.getDisease();
        socket.emit("return_get_disease", result);
    });
      socket.on("get_data_drugitems", async () => {
        const result = await drug.getDataDrugitems();
        socket.emit("return_get_data_drugitems", result);
    });
        socket.on("get_username", async () => {
        const result = await drug.getUername();
        socket.emit("return_get_username", result); 
    });
//----------------------INSERT----------------------------------
  socket.on("get_username", async () => {
        const result = await drug.getUername();
        socket.emit("return_get_username", result); 
    });

  socket.on("req_to_transaction", async (rev , vital) => {
    const result = await drug.reqTotransaction(rev, vital);
    socket.emit("return_req_to_transaction", result);
  });

//-----------------------getPersonalDisase

  socket.on("req_to_getPersonalDisase", async () => {
    const result = await drug.getPersonalDisase();
    socket.emit("return_req_to_getPersonalDisase", result);
  });
socket.on("req_req_insertPersoanl", async (emp_code , data) => {
    const result = await drug.req_insertPersoanl(emp_code , data);
    socket.emit("return_req_insertPersoanl", result);
  });

  socket.on("req_Violence", async (emp_code , data) => {
    const result = await drug.req_Violence(emp_code , data);
    socket.emit("return_req_Violence", result);
  });


  //--------แพ้ยา 
 socket.on("req_getDataDrugViolence", async (emp_code ) => {
    const result = await drug.getDataDrugViolence(emp_code );
    socket.emit("return_req_getDataDrugViolence", result);
  });

  //---------------hisdata
   socket.on("req_HistoryData", async (emp_code ) => {
    const result = await drug.HistoryData(emp_code );
    socket.emit("return_req_HistoryData", result);
  });


  //-----------dashboard
    socket.on("req_dashboard", async (from , to ) => {
    const result = await drug.HistoryDataByDay(from , to );
    socket.emit("return_req_dashboard", result);
  });


  ///-----------------Drug Store

socket.on("req_druginStore", async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  const result = await drug.druginStore(limit, offset);

  socket.emit("return_req_druginStore", result);
});

socket.on("req_insert_drug", async (data) => {
  const result = await drug.insert_drug(data);
  socket.emit("req_return_insert_drug", result);
});
socket.on("req_getDrugtype", async () => {
  const result = await drug.getDrugtype();
  socket.emit("req_return_getDrugtype", result);
});

socket.on("req_updatedrug", async (data) => {
  const result = await drug.update_drug(data);
  socket.emit("req_return_updatedrug", result);
});


//------------------report------------------------

socket.on("getDataAllHistory", async (startDate, endDate) => {
  const result = await report.getDataAllHistory(startDate, endDate);
  socket.emit("req_getDataAllHistory", result);
});


socket.on("getDataOutAllHistory", async (startDate, endDate) => {
  const result = await report.getDataOutAllHistory(startDate, endDate);
  socket.emit("req_getDataOutAllHistory", result);
});


});