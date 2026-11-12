import express from "express";
import upload from "./src/backend/uploads.js";
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
} from "./src/backend/routers.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/postgres", getDataPostgree);
app.get("/api/test", async (req, res) => {
  return res.json({ name: "kiki" });
});

// use

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// get
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/api/items-sell", getItemsSell);
app.get("/api/users/orders", getOrders);
app.get("/api/users", getUser);
app.get("/api/users/update", editUser);
app.get("/api/staffs", getStaff);
app.get("/api/inventory", getDataSection);
app.get("/api/inventory/item", getDataItemSection);
app.get("/api/stocks", getStoks);
app.get("/api/report", getReports);
app.get("/api/information", getInformation);
app.get("/api/information/delete", deleteInformation);
app.get("/api/information/update", updateInformation);
app.get("/api/purchases", getPurchasesItem);
app.get("/api/purchases/delete", deleteItemPurchases);
app.get("/api/rooms", getRoomItems);

//post
app.post("/api/users", getUser);
app.post("/api/users/update", editUser);
app.post("/api/staff/add", postStaff);
app.post("/api/staff/update", updateStaff);
app.post("/api/inventory", postInventory);
app.post("/api/section/update", updateFormSectionItem);
app.post("/api/users/login", loginUser);
app.post("/api/users/orders", postOrders);
app.post("/api/users/orders/update", updateOrders);
app.post("/api/stocks", updateStocks);
app.post("/api/report", upload.single("image"), postReport);
app.post("/api/report/action", deleteEditReport);
app.post("/api/order/tamu", getOrderTamu);
app.post("/api/information", postInformation);
app.post("/api/information/update", updateInformation);
app.post("/api/purchases", postPurchasesItems);
app.post("/api/rooms", postRoomItems);
app.post("/api/rooms/item", updateRoomItems);

app.listen(3000, () => {
  console.log("server berjalan");
});

export default app;
