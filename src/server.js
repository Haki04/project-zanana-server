import express from "express";
import upload from "./backend/uploads.js";
import {
  getUser,
  postOrders,
  getOrders,
  updateOrders,
  postInventory,
  loginUser,
  getDataSection,
  getStoks,
  updateStocks,
  postReport,
  getReports,
  getOrderTamu,
  deleteEditReport,
  getStaff,
  getDataItemSection,
  updateFormSectionItem,
  postInformation,
  getInformation,
  updateInformation,
  deleteInformation,
  postStaff,
  updateStaff,
  editUser,
  getItemsSell,
  getPurchasesItem,
  postPurchasesItems,
  deleteItemPurchases,
  postRoomItems,
  getRoomItems,
  updateRoomItems,
  getDataPostgree,
} from "./backend/routers.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());

app.get("/postgres", getDataPostgree);

// use
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// get

app.get("/items-sell", getItemsSell);
app.get("/users/orders", getOrders);
app.get("/users", getUser);
app.get("/users/update", editUser);
app.get("/staffs", getStaff);
app.get("/inventory", getDataSection);
app.get("/inventory/item", getDataItemSection);
app.get("/stocks", getStoks);
app.get("/report", getReports);
app.get("/information", getInformation);
app.get("/information/delete", deleteInformation);
app.get("/information/update", updateInformation);
app.get("/purchases", getPurchasesItem);
app.get("/purchases/delete", deleteItemPurchases);
app.get("/rooms", getRoomItems);

//post
app.post("/users", getUser);
app.post("/users/update", editUser);
app.post("/staff/add", postStaff);
app.post("/staff/update", updateStaff);
app.post("/inventory", postInventory);
app.post("/section/update", updateFormSectionItem);
app.post("/users/login", loginUser);
app.post("/users/orders", postOrders);
app.post("/users/orders/update", updateOrders);
app.post("/stocks", updateStocks);
app.post("/report", upload.single("image"), postReport);
app.post("/report/action", deleteEditReport);
app.post("/order/tamu", getOrderTamu);
app.post("/information", postInformation);
app.post("/information/update", updateInformation);
app.post("/purchases", postPurchasesItems);
app.post("/rooms", postRoomItems);
app.post("/rooms/item", updateRoomItems);

// app.listen(3000, () => {
//   console.log("server berjalan");
// });

export default app;
