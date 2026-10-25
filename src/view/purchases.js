import { backPages, getCookie } from "../controller/controller";
import { selectRender } from "./components/select-render";
import * as XLSX from "xlsx";

let data_send = [];
let data_item_filter = [];

export const showPurchasesItem = async (parent, section, total) => {
  const data_item = await getPurchasesItem(section, total);
  if (!data_item) {
    return (document.getElementById(parent).innerHTML =
      `<span class="w-1/3 p-2 mt-[5%] bg-white rounded text-center capitalize">${getCookie().level == 1 ? `pilih section` : `press show`}</span>`);
  }
  document.getElementById(parent).innerHTML = "";
  data_item.length == 0
    ? `<span class="w-1/3 p-2 mt-[5%] bg-amber-100 text-center capitalize">kosong</span>`
    : "";
  data_item.map(
    (item) =>
      (document.getElementById(parent).innerHTML += `
     <div
            class="w-full max-[600px]:w-1/2 p-1 h-fit bg-white [&>*]:flex-1 flex max-[600px]:flex-col items-center [&>*]:text-center [&>*:not(input)]:bg-blue-100 gap-1 rounded [&>*]:p-2" id="list-purchases"
          >
            <span>${getCookie().position}</span>
            <span class="truncate">${item.name}</span>
            <span>${item.total}</span>
            <span>${item.type}</span>
            <span>${!item.brand ? `-` : item.brand}</span>
            <input type="number" class="min-w-0 bg-blue-50" placeholder="number" min='1' value="1"/>
            <span class="flex justify-center items-center">
                <img class="w-[20px] cursor-pointer" src="/icon/clear.png" onclick="this.parentElement.parentElement.remove()"/>
            </span>
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
                class="flex-1 bg-orange-200 rounded cursor-pointer p-1"
                id="btn-print" onclick="exportExcel()"
              >
                Export
      </button> 
      <button
                class="flex-1 bg-blue-200 rounded cursor-pointer p-1"
                id="btn-send" onclick="sendPurchases()"
              >
                Send
      </button>
      `
        : `<button
                class="flex-1 bg-blue-200 rounded cursor-pointer p-1"
                id="btn-send" onclick="sendPurchases()"
              >
                Send
      </button>`
    }`,
  );
};

const getPurchasesItem = async (section, total) => {
  if (!section) return;
  section = section ?? getCookie().position;
  total = !total ? 2 : total == "" ? 2 : total;
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/purchases?section=${section}&total=${total}`,
  ).then((res) => res.json());
  if (responses.status == 200) return responses.data;
};

const fillterPurcahsesList = (el_this) => {
  const form = el_this.parentElement;
  if (form.querySelector("select").value == "") {
    form.querySelector("select").focus();
    return;
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
            class="w-full p-1 h-fit bg-white [&>*]:flex-1 flex items-center [&>*]:text-center [&>*:not(input)]:bg-blue-100 gap-1 rounded [&>*]:p-2" id="form-purchases"
          >
            <span>${data.section}</span>
            <span>${data.name_item}</span>
            <span>${data.total_store}</span>
            <span>${data.type}</span>
            <span>${data.brand}</span>
            <input type="number" class="min-w-0 bg-blue-50" placeholder="number" min='1' value="${data.need}"/>
            <span class="flex justify-center items-center">
                <img class="w-[20px] cursor-pointer" src="/icon/clear.png" onclick="this.parentElement.parentElement.remove()"/>
            </span>
      </div>
    `;

  document
    .getElementById(parent)
    .parentElement.querySelector("div#form-input-purchase")
    .parentElement.remove();
};

const formInputItem = () => {
  const form = document.getElementById("parent-content-purchase");
  form.innerHTML += `
  <div class="absolute z-10 w-full h-full top-0 bg-white/50 flex justify-center items-center">
    <div class="w-[300px] h-fit p-2 bg-white shadow flex flex-col items-center gap-2 [&>*:not(h1):not(div)]:shadow rounded" id="form-input-purchase">
      <h1 class="text-2xl capitalize">add item</h1>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Name item"/>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Total store"/>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Type"/>
      <input type="text" class="w-full bg-white p-2 " value="" placeholder="Brand/merek"/>
      <input type="number" class="w-full bg-white p-2 placeholder="number" min='1' value="1"/>
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
    section: getCookie().position,
    name_item: input[0].value,
    total_store: input[1].value,
    type: input[2].value,
    brand: input[3].value,
    need: input[4].value,
  });
};

const sendPurchases = async () => {
  const data = insertDataTo_data_send();
  if (data[0].data.length == 0) return (data_send = []);
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/purchases`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(...data),
    },
  ).then((res) => res.json());

  if (responses.status == 200) {
    alert(responses.message);
  }
  data_send = [];
};

const deletePurchasing = async (id, el_this) => {
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/purchases/delete?id=${id}`,
  ).then((res) => res.json());

  if (responses.status == 200) {
    el_this.parentElement.parentElement.parentElement.remove();
    alert(responses.message);
  }
};

const insertDataTo_data_send = () => {
  data_send.push({
    section:
      document.getElementById("select-purchase").value ?? getCookie().position,
    data: [],
    reporter: getCookie().name,
  });

  [
    ...document
      .getElementById("content-purchases")
      .querySelectorAll("#list-purchases"),
  ].map((item) => {
    const items = item.querySelectorAll("span");
    data_send[0].data.push({
      name_item: items[1].textContent,
      total_store: items[2].textContent,
      type: items[3].textContent,
      brand: items[4].textContent,
      need: item.querySelector("input").value,
    });
  });

  return data_send;
};

export const showHaveMadeItemPurchasesButton = () => {
  document
    .getElementById("search-bar-purchases")
    .querySelectorAll("button")[0]
    .insertAdjacentHTML(
      "afterend",
      `
      <button class="flex-1 bg-amber-100 rounded cursor-pointer p-1" onclick="showHaveBeenMade(this)"
      >Ready</button>
    `,
    );
};

const showHaveBeenMade = async (el_this) => {
  const section_select = el_this.parentElement.querySelector(`select`).value;
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/purchases?section=${section_select}`,
  ).then((res) => res.json());
  if (el_this.parentElement.querySelector(`select`).value == "") return;
  if (responses.data.length == 0)
    return alert(`Data purchasing dari section ${section_select} kosong`);
  document.getElementById("parent-content-purchase").insertAdjacentHTML(
    `afterbegin`,
    `
          <div class="absolute top-0 h-full w-full bg-white/50 flex justify-center items-center">
            <div class="w-[90%] lg:w-[70%] h-fit p-2 bg-white shadow flex flex-col items-center justify-around max-h-[500px] rounded relative" id="content-purchases-ready">
            <div class="w-full [&>*:not(button)]:bg-gray-100 p-1 flex [&>*]:flex-1 [&>*]:p-2">
                  <span value="${responses.data[0].section}">Section : ${responses.data[0].section}</span>
                  <span value="${responses.data[0].reporter}">Reporter : ${responses.data[0].reporter}</span>
                  <span value="${responses.data[0].creat_at}">Dibuat : ${responses.data[0].creat_at}</span>
            </div>
             
              <div class="w-full h-fit mb-2">
                <ul class="flex [&>*]:flex-1 [&>*]:bg-white [&>*]:text-center">
                  <li>Name item</li>
                  <li>Total store</li>
                  <li>
                    <select
                    class="w-full"
                    id="select-filter-purchases"
                    onchange=""
                  >
                    <option value="">Type</option>
                  </select>
                  </li>
                  <li>Brand</li>
                  <li>Need</li>
                </ul>
              </div>
              <div class="w-full h-fit overflow-y-scroll" >
              ${responses.data.map((item) =>
                item.data
                  .map(
                    (item) => ` 
                <div class="w-full p-1 flex [&>*]:flex-1  [&>*]:text-center [&>*]:p-2 [&>*]:bg-blue-100" id="list-purchases-ready">
                  <span class="truncate">${item.name_item}</span>
                  <span>${item.total_store}</span>
                  <span>${item.type}</span>
                  <span>${item.brand}</span>
                  <span>${item.need}</span>
                </div>
              `,
                  )
                  .join(""),
              )}
              </div>
              <div class="absolute top-full mt-2 flex gap-2 *:rounded *:shadow *:capitalize *:cursor-pointer">
                <button class="bg-green-100 p-2" onclick="exportExcel(this,this)">export</button>
                <button class="bg-yellow-100 p-2" onclick="this.parentElement.parentElement.parentElement.remove()">cancel</button>
                <button class="bg-red-100 p-2" onclick="deletePurchasing(${responses.data[0].id}, this)">hapus</button>
              </div>
              </div>
          </div>
        `,
  );

  const form = el_this.parentElement;
  selectRenderFilter(form.querySelector("select").value);
  fillterPurchasesType(form.querySelector("select").value);
};

const excelExportFunction = (data) => {
  const work_sheet = XLSX.utils.json_to_sheet(data);
  const work_book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    work_book,
    work_sheet,
    `Purchases-${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
  );
  const month = [
    "january",
    "february",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "december",
  ][new Date().getMonth()];
  const date = new Date().getDate();
  XLSX.writeFile(
    work_book,
    `Purchases-${data[0].Section + `-` + date + `-` + month}.xlsx`,
  );
};

const exportExcel = (parent, child) => {
  parent = !parent ? "content-purchases" : "content-purchases-ready";
  child = !child ? "list-purchases" : "list-purchases-ready";
  const optional_data = document
    .getElementById(parent)
    .querySelector("div")
    .querySelectorAll("span");
  [...document.getElementById(parent).querySelectorAll(`#${child}`)].map(
    (item) => {
      const items = item.querySelectorAll("span");
      data_send.push({
        Section:
          parent != "content-purchases-ready"
            ? items[0].textContent
            : optional_data[0].getAttribute("value"),
        "Name item":
          parent != "content-purchases-ready"
            ? items[1].textContent
            : items[0].textContent,
        "Total store":
          parent != "content-purchases-ready"
            ? items[2].textContent
            : items[1].textConten,
        Type:
          parent != "content-purchases-ready"
            ? items[3].textContent
            : items[2].textConten,
        Brand:
          parent != "content-purchases-ready"
            ? items[4].textContent
            : items[3].textConten,
        Need: item.querySelector("input")?.value ?? items[4].textContent,
        Reporter:
          getCookie().level == 1
            ? getCookie().name
            : optional_data[1].getAttribute("value"),
      });
    },
  );
  excelExportFunction(data_send);
};

export const selectRenderCek = () => {
  getCookie().level == 1
    ? selectRender(document.getElementById("select-purchase"), [
        { "": "Section" },
        { hk: "HK" },
        { fo: "FO" },
        { ktn: "KTN" },
        { eng: "ENG" },
      ])
    : (document.getElementById("select-purchase").innerHTML =
        `<option selected>${getCookie().position.toUpperCase()}</option>`);
};

export const selectRenderFilter = async (section) => {
  document.getElementById("select-filter-purchases").innerHTML =
    `<option value="" disabled selected>Type</option>`;
  await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/inventory?section=${section}`,
  )
    .then((res) => res.json())
    .then((item) => {
      item.data[0].section_data.item_list_jenis.map(
        (item) =>
          (document.getElementById("select-filter-purchases").innerHTML += `
                    <option class="capitalize" value="${item}">${item}</option>`),
      );
    });
};

const fillterPurchasesType = async (section) => {
  await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/purchases?section=${section}`,
  )
    .then((res) => res.json())
    .then((item) => (data_item_filter = item.data[0].data));
  console.log(data_item_filter);
};

const fillterItemOffline = () => {};

window.showPurchasesItem = showPurchasesItem;
window.fillterPurcahsesList = fillterPurcahsesList;
window.formInputItem = formInputItem;
window.validationPurchases = validationPurchases;
window.sendPurchases = sendPurchases;
window.buttonPrint = buttonPrint;
window.exportExcel = exportExcel;
window.selectRenderCek = selectRenderCek;
window.showHaveBeenMade = showHaveBeenMade;
window.showHaveMadeItemPurchasesButton = showHaveMadeItemPurchasesButton;
window.deletePurchasing = deletePurchasing;
window.backPages = backPages;
