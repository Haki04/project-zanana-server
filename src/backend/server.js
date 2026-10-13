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
  getStaff,
  getDataItemSection,
  updateFormSectionItem,
  postInformation,
  getInformation,
  updateInformation,
  deleteInformation,
} from "./routers.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// get
// app.get("/user", user);

app.get("/users/orders", getOrders);
app.get("/users", getUser);
app.get("/staffs", getStaff);
app.get("/inventory", getDataSection);
app.get("/inventory/item", getDataItemSection);
app.get("/stocks", getStoks);
app.get("/report", getReports);
app.get("/information", getInformation);
app.get("/information/delete", deleteInformation);
app.get("/information/update", updateInformation);

//post
app.post("/users", getUser);
app.post("/inventory", postInventory);
app.post("/section/update", updateFormSectionItem);
app.post("/users/login", loginUser);
app.post("/users/orders", postOrders);
app.post("/users/orders/update", updateOrders);
app.post("/stocks", updateStocks);
app.post("/report", postReport);
app.post("/report/action", deleteEditReport);
app.post("/order/tamu", getOrderTamu);
app.post("/information", postInformation);
app.post("/information/update", updateInformation);

app.listen(3000, () => {
  console.log("server berjalan");
});
