import express from "express";
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
} from "./routers.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// get
// app.get("/user", user);

app.get("/users/orders", getOrders);
app.get("/users", getUser);
app.get("/inventory", getDataSection);
app.get("/stocks", getStoks);
app.get("/report", getReports);
//post
app.post("/users", getUser);
app.post("/inventory", postInventory);
app.post("/users/login", loginUser);
app.post("/users/orders", postOrders);
app.post("/users/orders/update", updateOrders);
app.post("/stocks", updateStocks);
app.post("/report", postReport);
app.post("/report/action", deleteEditReport);
app.post("/order/tamu", getOrderTamu);

app.listen(3000, () => {
  console.log("server berjalan");
});
