import db from "./database.js";
import bcrypt from "bcrypt";

// export async function user(req, res) {
//   const user = await bcrypt.hash("kiki2", 10);
//   console.log(user);
// }
// user();

// users
export const getUser = async (req, res) => {
  try {
    const name = req.body?.name ?? req.query?.name;
    const [results] = await db.query(
      "SELECT * FROM users WHERE user_name = ?",
      [name],
    );

    res.json({
      verify: true,
      data: results,
    });
  } catch (error) {
    console.error("ERROR MYSQL:", error);

    res.json({
      message: "Gagal mengambil data",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { name, password } = req.body;
  const [[results]] = await db.query(
    "SELECT user_name, user_password,user_level,position FROM users WHERE user_name = ?",
    [name],
  );

  if (await bcrypt.compare(password, results.user_password)) {
    res.json({
      verify: true,
      data: {
        name: results.user_name,
        level: results.user_level,
        position: results.position,
      },
    });
  } else {
    console.log("gagal login ");
    res.json({ verify: false });
  }
};

// pesanan
const randomCodeOrder = async () => {
  const alfabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const number = "0123456789";
  while (true) {
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += alfabets[Math.floor(Math.random() * alfabets.length)];
    }
    for (let i = 0; i < 2; i++) {
      code += number[Math.floor(Math.random() * number.length)];
    }
    const [data] = await db.query(
      "SELECT order_code FROM orders WHERE order_code = ?",
      [code],
    );
    if (data.length === 0) {
      return code;
    }
  }
};

export const postOrders = async (req, res) => {
  try {
    const [{ room, items, status, uu_id, place, type }] = req.body;
    const code = await randomCodeOrder();
    await db.query(
      `INSERT INTO orders (uu_id, order_room, order_items, order_status, order_type, place_to_eat, order_code) VALUES (?,?,?,?,?,?,?)`,
      [uu_id, room, items, status, type, place, code],
    );
    res.status(201).json({
      success: 201,
      message: "berhasil order",
    });
  } catch (error) {
    console.error("ERROR MYSQL:", error);

    res.status(500).json({
      message: "Gagal meningput orders",
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT order_room, order_items, order_status, uu_id, place_to_eat, order_type FROM orders ORDER BY CASE
      WHEN order_status = 'in proses' THEN 1
      WHEN order_status = 'order' THEN 2  
      WHEN order_status = 'selesai' THEN 3
      ELSE 4
      END`,
    );

    res.status(200).json({
      message: "menambahkan data orders berhasil",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "gagal mengambil data",
      error: error.message,
    });
  }
};

export const updateOrders = async (req, res) => {
  try {
    const [results] = await db.query(
      "UPDATE orders SET order_status = ? WHERE uu_id = ?",
      [req.body.status, String(req.body.uu_id)],
    );

    results.affectedRows > 0
      ? res.json({
          status: 201,
          message: "berhasil ",
        })
      : console.log("gagal");
  } catch (error) {
    console.log(error);
    res.json({
      message: "gagal  memproses",
    });
  }
};

// inventory

export const updateFormSectionItem = async (req, res) => {
  try {
    const [results] = await db.query(
      `UPDATE section SET section_data = ? WHERE section_name = ?`,
      [req.body.data_form, req.body.section],
    );
    results.affectedRows > 0
      ? res.json({ status: 201, message: "berhasil" })
      : res.json({ status: 404, message: "gagal" });
  } catch (error) {
    console.log(error);
  }
};

export const getDataItemSection = async (req, res) => {
  const [results] = await db.query(
    `SELECT name FROM inventory WHERE section = ?`,
    [req.query.section],
  );

  res.json({
    data: results,
  });
};

export const getDataSection = async (req, res) => {
  const [results] = await db.query(
    `SELECT * FROM section WHERE section_name = ?`,
    [req.query.section],
  );

  res.json({
    data: results,
  });
};
export const postInventory = async (req, res) => {
  try {
    const [
      {
        name_item,
        jenis_item,
        report_item,
        total_item,
        satuan_item,
        code_item,
        extra_coment,
        section,
      },
    ] = req.body;

    const [cek] = await db.query(
      `SELECT name,total FROM inventory WHERE name = ?`,
      [name_item],
    );
    if (cek.length == 0) {
      const [results] = await db.query(
        `INSERT INTO inventory (name, type, reporting, total, satuan, coment,section,code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name_item,
          jenis_item,
          report_item,
          total_item,
          satuan_item,
          extra_coment,
          section,
          code_item,
        ],
      );

      if (results) {
        res.json({
          status: 200,
          message: "berhasil do inventory",
        });
      } else {
        console.log("gagal");
      }
    } else {
      const [total_old] = cek;
      let total_new = parseInt(total_old.total) + parseInt(total_item);
      const [results] = await db.query(
        `UPDATE inventory SET total = ? WHERE name = ?`,
        [total_new, name_item],
      );

      console.log(results);
      if (results.affectedRows > 0) {
        res.json({
          status: 201,
          message: "stock sudah diperbaharui",
        });
      }
    }
  } catch (error) {
    res.json({
      status: 500,
    });
  }
};

// stoks

export const getStoks = async (req, res) => {
  try {
    let query_string = "";
    let query_query = [];
    if (req.query.id_stocks) {
      query_string =
        "SELECT id,name,type,total,satuan FROM inventory WHERE section = ? AND id = ?";
      query_query = [req.query.section, req.query.id_stocks];
    } else if (req.query.section) {
      query_string =
        "SELECT id,name,type,total,satuan FROM inventory WHERE section = ?";
      query_query = [req.query.section];
    }
    const [results] = await db.query(query_string, query_query);

    res.json({
      data: results,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStocks = async (req, res) => {
  try {
    const { id, total } = req.body;
    const [results] = await db.query(
      "UPDATE inventory SET total = ? WHERE id = ?",
      [total, id],
    );

    if (results.affectedRows > 0) {
      res.json({
        status: 201,
        message: "berhasil",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// reporting

export const postReport = async (req, res) => {
  try {
    const { reporter, type, posisi, date, description } = req.body;
    const [results] = await db.query(
      "INSERT INTO reporting (posisi,reporter,status,date,description) VALUES (?,?,?,?,?)",
      [posisi, reporter, "lapor", date, description],
    );
    if (results) {
      res.json({
        status: 200,
        message: "berhasil do reporting",
      });
    } else {
      res.json({
        status: 404,
        message: "gagal do reporting",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getReports = async (req, res) => {
  try {
    if (!req.query.args) {
      let query_string = !req.query.id
        ? "SELECT * FROM reporting"
        : "SELECT * FROM reporting WHERE id = ?";
      const [results] = await db.query(query_string, [req?.query.id]);
      res.json({
        status: 200,
        data: results,
      });
    } else {
      let query_string = "";
      let query_params;
      switch (req.query.args) {
        case "all":
          query_string = "SELECT * FROM reporting";
          break;
        case "new-est":
          query_string = "SELECT * FROM reporting ORDER BY date DESC";
          break;
        case "old-est":
          query_string = "SELECT * FROM reporting ORDER BY date ASC";
          break;
        case "lapor":
          query_string = "SElECT * FROM reporting WHERE status = ?";
          break;
        case "proses":
          query_string = "SElECT * FROM reporting WHERE status = ?";
          break;
        case "selesai":
          query_string = "SElECT * FROM reporting WHERE status = ?";
          break;
      }
      const [results] = await db.query(query_string, [req?.query.args]);

      if (results.length > 0) {
        res.json({
          data: results,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteEditReport = async (req, res) => {
  try {
    const query_string =
      Object.keys(req.body).length == 0
        ? "DELETE FROM reporting WHERE id = ?"
        : "UPDATE reporting SET posisi = ?, reporter = ?, status = ?, date = ? WHERE id = ?";
    const params =
      Object.keys(req.body).length == 0
        ? [req.query.id]
        : [
            req.body[0].posisi,
            req.body[0].reporter,
            req.body[0].status,
            req.body[0].date,
            req.query.id,
          ];

    const [results] = await db.query(query_string, params);

    if (results.affectedRows > 0) {
      res.json({
        status: 200,
        message: "berhasil",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// tamu
export const getOrderTamu = async (req, res) => {
  const [results] = await db.query(
    "SELECT order_items FROM orders WHERE order_code = ?",
    [req.body.code],
  );
  if (results.length > 0) {
    res.json({
      status: 200,
      data: results,
    });
  } else {
    res.json({
      status: 404,
    });
  }
};

///

export const getStaff = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE user_level != ?",
      ["1"],
    );
    if (results.length > 0) {
      res.json({
        status: 200,
        data: results,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// information

export const postInformation = async (req, res) => {
  try {
    const { name, reporter, data, status, data_action, section } = req.body;
    const [results] = await db.query(
      `INSERT INTO information (info_name, info_reporter, info_data, status, date_action, section)
       VALUE (?, ?, ?, ?, ?, ?)`,
      [name, reporter, data, status, data_action, section],
    );
    if (results.affectedRows > 0) {
      res.json({
        status: 201,
        data: results,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getInformation = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM information");
    if (results) res.json({ status: 200, data: results });
  } catch (error) {}
};
