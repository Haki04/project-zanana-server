// import db from "./database.js";
import bcrypt from "bcrypt";
import db from "./database-2.js";
import path from "path";
import { put, del } from "@vercel/blob";
import crypto from "crypto";

// users

export const getUser = async (req, res) => {
  try {
    let results;
    if (!req.query.id) {
      const name = req.body?.name ?? req.query?.name;
      results = await db.query("SELECT * FROM users WHERE user_name = $1", [
        name,
      ]);
    } else {
      results = await db.query("SELECT * FROM users WHERE user_id = $1", [
        req.query.id,
      ]);
    }
    res.json({
      verify: true,
      data: results.rows,
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
  const results = await db.query(
    "SELECT user_name, user_password, user_status, user_level,position FROM users WHERE user_name = $1",
    [name],
  );
  if (
    (await bcrypt.compare(password, results.rows[0].user_password)) ||
    password
  ) {
    res.json({
      verify: true,
      data: {
        name: results.rows[0].user_name,
        level: results.rows[0].user_level,
        position: results.rows[0].position,
        status_user: results.rows[0].user_status,
      },
    });
  } else {
    res.json({ verify: false });
  }
};

export const editUser = async (req, res) => {
  try {
    let { new_name, new_password } = req.body;
    new_password = await bcrypt.hash(new_password, 10);
    const results = await db.query(
      "UPDATE users SET user_name = $1, user_password = $2 WHERE user_id = $3",
      [new_name, new_password, req.query.id],
    );

    if (results.rowCount > 0) {
      res.json({
        status: 201,
        message: "berhasil merubah password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

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
    const results = await db.query(
      "SELECT order_code FROM orders WHERE order_code = $1",
      [code],
    );
    if (results.rows.length === 0) {
      return code;
    }
  }
};

// items-sell

export const getItemsSell = async (req, res) => {
  try {
    const results = await db.query(
      "SELECT name, type, total FROM inventory WHERE type = $1",
      ["food"],
    );
    if (results.rowCount > 0) {
      res.json({
        status: 200,
        data: results.rows,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//pesanan
export const postOrders = async (req, res) => {
  try {
    const [{ room, items, status, uu_id, place, type, coment }] = req.body;
    const code = await randomCodeOrder();
    await db.query(
      `INSERT INTO orders (uu_id, order_room, order_items, order_status, order_type, place_to_eat, order_code, coment) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [uu_id, room, items, status, type, place, code, coment],
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
    let results;
    let query_string = !req.query.uu_id
      ? `SELECT order_room, order_items, order_status, uu_id, place_to_eat, order_type FROM orders ORDER BY CASE
      WHEN order_status = 'in proses' THEN 1
      WHEN order_status = 'order' THEN 2
      WHEN order_status = 'selesai' THEN 3
      ELSE 4
      END`
      : "SELECT * FROM orders WHERE uu_id = $1";
    if (!req.query.uu_id) {
      results = await db.query(query_string);
    } else {
      results = await db.query(query_string, [req.query.uu_id]);
    }

    res.status(200).json({
      message: "menambahkan data orders berhasil",
      data: results.rows,
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
    const results = await db.query(
      "UPDATE orders SET order_status = $1 WHERE uu_id = $2",
      [req.body.status, String(req.body.uu_id)],
    );

    results.rowCount > 0
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
    const results = await db.query(
      `UPDATE section SET section_data = $1 WHERE section_name = $2`,
      [req.body.data_form, req.body.section],
    );
    results.rowCount > 0
      ? res.json({ status: 201, message: "berhasil" })
      : res.json({ status: 404, message: "gagal" });
  } catch (error) {
    console.log(error);
  }
};

export const getDataItemSection = async (req, res) => {
  const results = await db.query(
    `SELECT name FROM inventory WHERE section = $1`,
    [req.query.section],
  );

  res.json({
    data: results.rows,
  });
};

export const getDataSection = async (req, res) => {
  const results = await db.query(
    `SELECT * FROM section WHERE section_name = $1`,
    [req.query.section],
  );

  res.json({
    data: results.rows,
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
        brand_item,
        extra_coment,
        section,
      },
    ] = req.body;

    console.log(report_item);
    if (report_item == "rusak") {
      console.log(report_item == "rusak");
      const rusak_item_cek = await db.query(
        `UPDATE inventory SET total = total-${parseInt(total_item)} WHERE name = $1`,
        [name_item],
      );
      console.log(rusak_item_cek);
      if (rusak_item_cek.rowCount > 0) {
        return res.json({
          status: 200,
          message: "stocks di kurangin dengan barang yang rusak",
        });
      }
    }

    const cek = await db.query(
      `SELECT name,total FROM inventory WHERE name = $1`,
      [name_item],
    );
    if (cek.rowCount == 0) {
      const results = await db.query(
        `INSERT INTO inventory (name, type, reporting, total, satuan, coment,section,brand) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          name_item,
          jenis_item,
          report_item,
          total_item,
          satuan_item,
          extra_coment,
          section,
          brand_item,
        ],
      );

      if (results.rowCount > 0) {
        res.json({
          status: 200,
          message: "berhasil do inventory",
        });
      } else {
        console.log("gagal");
      }
    } else {
      const [total_old] = cek.rows;
      let total_new = parseInt(total_old.total) + parseInt(total_item);
      const results = await db.query(
        `UPDATE inventory SET total = $1 WHERE name = $2`,
        [total_new, name_item],
      );

      console.log(results);
      if (results.rowCount > 0) {
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
        "SELECT id,name,type,total,satuan,coment FROM inventory WHERE section = $1 AND id = $2";
      query_query = [req.query.section, req.query.id_stocks];
    } else if (req.query.filter != "undefined" && req.query.filter != "all") {
      query_string =
        "SELECT id,name,type,total,satuan,type FROM inventory WHERE section = $1 AND type= $2";
      query_query = [req.query.section, req.query.filter];
    } else {
      query_string =
        "SELECT id,name,type,total,satuan FROM inventory WHERE section = $1";
      query_query = [req.query.section];
    }
    const results = await db.query(query_string, query_query);

    res.json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStocks = async (req, res) => {
  try {
    const { id, total } = req.body;
    const results = await db.query(
      "UPDATE inventory SET total = $1 WHERE id = $2",
      [total, id],
    );

    if (results.rowCount > 0) {
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
    let image = "";

    if (req.file != "") {
      const ext = path.extname(req.file.originalname);
      const blob = await put(
        `reports/${crypto.randomUUID()}${ext}`,
        req.file.buffer,
        {
          access: "public",
          contentType: req.file.mimetype,
          storeId: process.env.BLOB_URL_STORE_ID,
        },
      );

      image = path.basename(blob.pathname);
    }
    // Simpan data laporan dan URL gambar ke Neon
    const results = await db.query(
      `INSERT INTO reporting
      (posisi, reporter, type, date, description, status, gambar)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [posisi, reporter, type, date, description, "lapor", image],
    );

    if (results.rowCount > 0) {
      return res.json({
        status: 200,
        message: "Berhasil membuat report",
        image,
      });
    }

    return res.status(404).json({
      status: 404,
      message: "Gagal membuat laporan",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 500,
      message: "Gagal membuat report",
    });
  }
};

export const getReports = async (req, res) => {
  try {
    if (!req.query.args) {
      let results;
      let query_string = !req.query.id
        ? "SELECT * FROM reporting"
        : "SELECT * FROM reporting WHERE id = $1";
      !req.query.id
        ? (results = await db.query(query_string))
        : (results = await db.query(query_string, [req.query.id]));
      res.json({
        status: 200,
        data: results.rows,
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
          query_string = "SElECT * FROM reporting WHERE status = $1";
          break;
        case "proses":
          query_string = "SElECT * FROM reporting WHERE status = $1";
          break;
        case "selesai":
          query_string = "SElECT * FROM reporting WHERE status = $1";
          break;
      }
      const results = await db.query(query_string, [req?.query.args]);

      if (results.rowCount > 0) {
        res.json({
          data: results.rows,
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
        ? "DELETE FROM reporting WHERE id = $1 RETURNING gambar"
        : "UPDATE reporting SET posisi = $1, reporter = $2, status = $3, date = $4 WHERE id = $5";
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

    const results = await db.query(query_string, params);
    if (Object.keys(req.body).length == 0 && results.rows[0]?.gambar) {
      await del(
        `${process.env.BLOB_URL_FRONT_DEV}/reports/${results.rows[0].gambar}`,
        {
          token: process.env.BLOB_URL_READ_WRITE_TOKEN,
        },
      );
    }

    if (results.rowCount > 0) {
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
  const results = await db.query(
    "SELECT order_items, order_status FROM orders WHERE order_code = $1",
    [req.body.code],
  );
  if (results.rowCount > 0) {
    res.json({
      status: 200,
      data: results.rows,
    });
  } else {
    res.json({
      status: 404,
    });
  }
};

/// staff

export const postStaff = async (req, res) => {
  try {
    const { name, password, as, status } = req.body;
    const results = await db.query(
      "INSERT INTO users (user_name, user_level, user_status, position, user_password) VALUES ($1, $2, $3, $4, $5)",
      [name, "2", status, as, password],
    );
    if (results.rowCount > 0) {
      res.json({
        status: 200,
        message: "berhasil menambah",
      });
    } else {
      res.json({
        status: 404,
        message: "gagal menambah",
      });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.json({
        status: 409,
        message: "nama tersebut sudah terdaftar",
      });
    }
  }
};

export const getStaff = async (req, res) => {
  try {
    let results = [];

    if (req.query.id) {
      results = await db.query(
        "SELECT * FROM users WHERE user_level != $1 AND user_id = $2",
        [1, req.query.id],
      );
    } else {
      results = await db.query(
        "SELECT * FROM users WHERE user_level != $1",
        [1],
      );
    }

    if (results.rowCount > 0) {
      res.json({
        status: 200,
        data: results.rows,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { name, password, as, status } = req.body;
    const results = await db.query(
      "UPDATE users SET user_name = $1, user_password = $2, position = $3, user_status = $4 WHERE user_id = $5",
      [name, password, as, status, req.query.id],
    );

    if (results.rowCount > 0) {
      res.json({
        status: 201,
        message: "berhasil edit data",
      });
    } else {
      res.json({
        status: 404,
        message: "gagal edit data",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// information

export const postInformation = async (req, res) => {
  try {
    const { information, to_section, creat_at, type } = req.body;
    const results = await db.query(
      `INSERT INTO information (information, section, status, creat_at, type)
       VALUES ($1, $2, $3, $4, $5)`,
      [information, to_section, "info", creat_at, type],
    );
    if (results.rowCount > 0) {
      res.json({
        status: 201,
        message: "tambah information berhasil",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getInformation = async (req, res) => {
  try {
    let results;
    if (req.query.id) {
      results = await db.query(`SELECT * FROM information WHERE id = $1`, [
        req.query.id,
      ]);
    } else {
      results = await db.query(`SELECT * FROM information`);
    }
    if (results.rowCount > 0) res.json({ status: 200, data: results.rows });
  } catch (error) {}
};

export const updateInformation = async (req, res) => {
  try {
    let results;
    if (req.query.id && req.query.info) {
      results = await db.query(
        "UPDATE information set status = $1 WHERE id = $2",
        ["done", req.query.id],
      );
    } else {
      const { information, to_section, type } = req.body;
      results = await db.query(
        "UPDATE information set information = $1, section = $2, type = $3 WHERE id = $4",
        [information, to_section, type, req.query.id],
      );
    }

    if (results.rowCount > 0) {
      res.json({
        status: 201,
        message: "berhasil edit infomation",
      });
    } else {
      res.json({
        status: 404,
        message: "gagal edit information",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteInformation = async (req, res) => {
  try {
    const results = await db.query("DELETE FROM information WHERE id = $1", [
      req.query.id,
    ]);
    if (results.rowCount > 0) {
      res.json({
        status: 201,
        message: "berhasil hapus information",
      });
    } else {
      res.json({
        status: 404,
        message: "gagal hapus information",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// purchases

export const getPurchasesItem = async (req, res) => {
  try {
    let results;
    if (!req.query.total) {
      results = await db.query(
        "SELECT * FROM purchases WHERE section = $1 ORDER BY id DESC LIMIT 1",
        [req.query.section],
      );

      return res.json({
        status: 200,
        data: results.rows,
      });
    }

    results = await db.query(
      "SELECT * FROM inventory WHERE section = $1 AND total <= $2",
      [req.query.section.toLowerCase(), parseInt(req.query.total)],
    );
    console.log(results.rows);
    res.json({
      status: 200,
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postPurchasesItems = async (req, res) => {
  try {
    const creat_at = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
    const { section, data, reporter } = req.body;
    const results = await db.query(
      "INSERT INTO purchases (section, data, reporter, creat_at) VALUES ($1, $2, $3, $4)",
      [section, JSON.stringify(data), reporter, creat_at],
    );
    if (results.rowCount > 0) {
      res.json({
        status: 200,
        message: "berhasil request purchase",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteItemPurchases = async (req, res) => {
  try {
    const results = await db.query("DELETE FROM purchases WHERE id = $1", [
      req.query.id,
    ]);

    if (results.rowCount > 0) {
      res.json({
        status: 200,
        message: "Berhasil menghapus data purchasing",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/// rooms-items

export const postRoomItems = async (req, res) => {
  try {
    // return console.log(req.body, "test");
    const {
      data: [{ room_number, data }],
      last_update,
      reporter,
    } = req.body;
    const results = await db.query(
      "INSERT INTO rooms (room_number, room_data, last_update, reporter) VALUES ($1, $2, $3, $4)",
      [room_number, JSON.stringify(data), last_update, reporter],
    );

    if (results.rowCount > 0)
      return res.json({
        status: 200,
        message: "berhasil menambahkan room items",
      });
  } catch (error) {
    console.log(error);
  }
};

export const getRoomItems = async (req, res) => {
  try {
    const results = await db.query(
      "SELECT * FROM rooms ORDER BY room_number ASC",
    );
    return res.json({ status: 200, data: results.rows });
  } catch (error) {
    console.log(error);
  }
};

export const updateRoomItems = async (req, res) => {
  try {
    if (req.query.snack) {
      const {
        data: [{ room_number, data }],
      } = req.body;

      const results = await db.query(
        "UPDATE rooms SET snack_room = $1 WHERE room_number = $2",
        [
          parseInt(data[0].item_total) == 0 ? null : JSON.stringify(data),
          room_number,
        ],
      );
      if (results.rowCount > 0)
        return res.json({
          status: 201,
          message: `berhasil menambahkan snack ke room ${room_number}`,
        });
    }
    const {
      data: [{ room_number, data }],
    } = req.body;
    const results = await db.query(
      "UPDATE rooms SET room_data = $1 WHERE room_number = $2",
      [JSON.stringify(data), room_number],
    );
    if (results.rowCount > 0)
      return res.json({
        status: 201,
        message: `berhasil merubah data room ${room_number}`,
      });
  } catch (error) {
    console.log(error);
  }
};
