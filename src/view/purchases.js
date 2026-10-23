import { backPages, getCookie } from "../controller/controller";
import { selectRender } from "./components/select-render";

let data_send = [];

const showPurchasesItem = async (parent, section, total) => {
  getCookie().level == 1
    ? selectRender(document.getElementById("select-purchase"), [
        { hk: "HK" },
        { fo: "FO" },
        { ktn: "KTN" },
        { eng: "ENG" },
      ])
    : (document.getElementById("select-purchase").innerHTML =
        `<option selected>${getCookie().position.toUpperCase()}</option>`);
  const data_item = await getPurchasesItem(section, total);

  document.getElementById(parent).innerHTML =
    data_item.length == 0
      ? `<span class="w-1/3 p-2 mt-[5%] bg-amber-100 text-center capitalize">kosong</span>`
      : "";
  data_item.map(
    (item) =>
      (document.getElementById(parent).innerHTML += `
     <div
            class="w-full p-1 h-fit bg-white [&>*]:flex-1 [&>*]:inline-block flex items-center [&>*]:text-center [&>*:not(input)]:bg-blue-100 gap-1 rounded [&>*]:p-2" id="list-purchases"
          >
            <span>${getCookie().position}</span>
            <span>${item.name}</span>
            <span>${item.total}</span>
            <span>${item.type}</span>
            <span>citra</span>
            <input type="number" class="min-w-0 bg-blue-50" placeholder="Perlu"/>
      </div>
    `),
  );
};

const buttonPrint = (args) => {
  const search_bar = document.getElementById("search-bar-purchases");
  search_bar.querySelectorAll("button")[0].insertAdjacentHTML(
    "afterend",
    `${
      args
        ? `<button
                class="flex-1 bg-blue-200 rounded cursor-pointer p-1"
                id="btn-print"
              >
                Print
      </button>`
        : `<button
                class="flex-1 bg-blue-200 rounded cursor-pointer p-1"
                id="btn-send" onclick="sendPurchases()"
              >
                Send
      </button>`
    }`,
  );
};

const getPurchasesItem = async (section, total = 2) => {
  section = section ?? getCookie().position;
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/purchases?section=${section}&total=${total}`,
  ).then((res) => res.json());
  if (responses.status == 200) return responses.data;
};

const fillterPurcahsesList = (el_this) => {
  const form = el_this.parentElement;
  if (form.querySelector("select").value == "") {
    form.querySelector("select").focus();
  }
  showPurchasesItem(
    "content-purchases",
    form.querySelector("select").value,
    form.querySelector("input").value,
  );
};

const addItemPurchase = (parent, data) => {
  document.getElementById(parent).innerHTML += `
     <div
            class="w-full p-1 h-fit bg-white [&>*]:flex-1 [&>*]:inline-block flex items-center [&>*]:text-center [&>*]:bg-blue-100 gap-1 rounded [&>*]:p-2" id="form-purchases"
          >
            <span>${data.reporter}</span>
            <span>${data.name_item}</span>
            <span>${data.total}</span>
            <span>${data.type}</span>
            <span>${data.brand}</span>
      </div>
    `;
  document
    .getElementById(parent)
    .querySelector("div#form-input-purchase")
    .parentElement.remove();
};

const formInputItem = () => {
  const form = document.getElementById("parent-content-purchase");
  form.innerHTML += `
  <div class="absolute z-10 w-full h-full top-0 bg-white/50 flex justify-center items-center">
    <div class="w-[300px] h-fit p-2 bg-white shadow flex flex-col items-center gap-2 [&>*:not(h1):not(div)]:shadow rounded" id="form-input-purchase">
      <h1 class="text-2xl capitalize">add item</h1>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Reporter"/>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Name item"/>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Total"/>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Type"/>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Brand/merek"/>
     <div class="w-full flex justify-center items-center gap-2 [&>*]:rounded">
       <button class="flex-1 my-3 bg-green-200 cursor-pointer p-2 " onclick="validationPurchases(this)">add</button>
       <button class="flex-1 my-3 bg-yellow-200 cursor-pointer p-2 " onclick="this.parentElement.parentElement.parentElement.remove()">cancel</button>
     </div>
    </div>
  </div>
  
  `;
};

const validationPurchases = (el_this) => {
  const input = el_this.parentElement.parentElement.querySelectorAll("input");
  const unValid = [...input].filter((item) => item.value == "");
  if (unValid.length > 0) return unValid.map((item) => item.focus());

  addItemPurchase("content-purchases", {
    reporter: input[0].value,
    name_item: input[1].value,
    total: input[2].value,
    type: input[3].value,
    brand: input[4].value,
  });
};

const sendPurchases = async (data) => {
  [
    ...document
      .getElementById("content-purchases")
      .querySelectorAll("#list-purchases"),
  ].map((item) =>
    data_send.push({
      section: getCookie().position,
      name_item: item.querySelectorAll("span")[1],
      total: item.querySelectorAll("span")[2],
      type: item.querySelectorAll("span")[3],
      brand: item.querySelectorAll("span")[4],
    }),
  );
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/purchases`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data_send),
    },
  ).then((res) => res.json());

  if (responses.status == 200) {
    alert(responses.message);
  }
  data_send = [];
};

backPages();
buttonPrint();

window.showPurchasesItem = showPurchasesItem;
window.fillterPurcahsesList = fillterPurcahsesList;
window.formInputItem = formInputItem;
window.validationPurchases = validationPurchases;
window.sendPurchases = sendPurchases;
