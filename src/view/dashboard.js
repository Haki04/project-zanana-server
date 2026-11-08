import * as pesanan from "../view/pesanan.js";
import * as input_pesanan from "../view/input-pesanan.js";
import { inventoryReport } from "./inventory.js";
import {
  animationLoading,
  activeListHilight,
  getCookie,
} from "../controller/controller.js";
import { getDataBrokeness } from "./kerusakan.js";
import { showStaffBoxs } from "./staff.js";
import { logOutUser } from "../controller/controller.js";
import { showBoxStocks } from "./stocks.js";
import { addInformation, showInformation } from "./information.js";
import {
  selectRenderCek,
  showHaveMadeItemPurchasesButton,
  showPurchasesItem,
} from "./purchases.js";
import { showItemRooms } from "./rooms.js";

document.getElementById("tag-admin").innerHTML =
  `${getCookie().name} - ${getCookie().level == 1 ? `<span class="bg-amber-100 rounded inline-block px-3 uppercase">admin <span class="lowercase">lvl</span> ${getCookie().level}</span> ` : ``}`;

const section = async (a, el_this) => {
  if (getCookie().level != 1 || !getCookie()) {
    return (window.location.href = "/pages/login.html");
  }
  if (window.innerWidth < 600) {
    alert("tolong buka ditampilan desktop");
    return (document.querySelector("body").innerHTML =
      `<div class="flex justify-center items-center w-full h-screen bg-white/50"><span class="text-2xl">tampilan desktop di perlukan</span></div>`);
  }
  if (!document.getElementById("cek-exist")) {
    document
      .querySelector("body")
      .insertAdjacentHTML(
        "afterbegin",
        '<div id="cek-exist" class="hidden">test</div>',
      );
  }
  document.querySelectorAll("#back-pages").forEach((item) => item.remove());
  const div = document.getElementById("content-right");
  if (a == "dashboard") {
    div.innerHTML = `
    <div
            class="w-full bg-slate-300 h-fit shrink-0 flex flex-row gap-1 p-1 overflow-x-scroll"
            id="staff"
          ></div>
     <div class="bg-white h-full w-full flex flex-col justify-start">
            <!--<div class="w-full h-[70px]">
              <div class="w-full flex justify-between">
                <h1 class="text-2xl ml-2">Kerusakan</h1>
                <div class="w-[200px] bg-amber-100 flex items-center">
              
              <select
                name=""
                id="select-dashboard-dashboard"
                class="flex-2"
                onchange="filterKerusakan(this.value)"
              ></select>
            </div>
              </div>
              <div class="w-full bg-white">
              <div class="w-[100px] bg-red-300 ">
              
              </div>
                <ul class="flex flex-row justify-around items-center">
                  <li>posisi</li>
                  <li>repoter</li>
                  <li>status</li>
                  <li>date</li>
                  <li>action</li>
                </ul>
              </div>
            </div>
            <div class="w-full bg-gray-100 max-h-[600px] px-1 pb-1 relative overflow-y-scroll" id="kerusakan"></div>-->
          </div>
    `;
    showStaffBoxs("staff");
    // getDataBrokeness("kerusakan", "dashboard");
    animationLoading("content-right");
    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  } else if (a == "inventory") {
    div.innerHTML = `
     <div
            class="w-full h-full flex flex-row justify-center gap-1 p-1 items-center"
            id="content"
          ></div>
    `;
    div.innerHTML += `
    <div class="absolute top-[50%] translate-y-[-50%] left-0 bg-transparent ">
      <ul class="p-1 [&>*]:border [&>*]:mt-1 [&>*]:cursor-pointer [&>*]:px-2 [&>*]:hover:bg-gray-50 [&>*]:text-center" id="ul-inventory-dashboard">

      <li onclick="inventoryReport('hk', this)">HK</li>
      <li onclick="inventoryReport('ktn', this)">KTN</li>
      <li onclick="inventoryReport('fo', this)">FO</li>
      <li onclick="inventoryReport('eng', this)">ENG</li>
      </ul>
    </div>
    `;
    animationLoading("content-right");
    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  } else if (a == "stocks") {
    div.innerHTML = `
     <input class="hidden" type="checkbox" name="" id="toggle" />
     <div
            class="w-full h-full flex flex-row justify-center gap-1 p-1 items-center relative"
            id="content"
          ></div>
    `;
    div.innerHTML += `
    <div class="absolute z-[2] top-[50%] translate-y-[-50%] left-0 bg-transparent ">
      <ul class="p-1 [&>*]:border [&>*]:mt-1 [&>*]:cursor-pointer [&>*]:px-2 [&>*]:hover:bg-gray-50 [&>*]:text-center" id="ul-stocks-dashboard">
      <li onclick="showBoxStocks('hk', this)">HK</li>
      <li onclick="showBoxStocks('ktn', this)">KTN</li>
      <li onclick="showBoxStocks('fo', this)">FO</li>
      <li onclick="showBoxStocks('eng', this)">ENG</li>
      </ul>
    </div>
    `;
    animationLoading("content-right");
    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  } else if (a == "staff") {
    div.innerHTML = `
     <div
            class="w-full h-full bg-slate-300 flex flex-wrap justify-center gap-1 p-1 relative overflow-y-scroll content-start"
            id="staff"
          ></div>
    `;

    showStaffBoxs("staff");
    animationLoading("content-right");
    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  } else if (a == "pesanan") {
    div.innerHTML = `
        <input type="checkbox" name="" id="toggle" class="hidden" />
    <div id="content" ></div>
      <div class="h-[50%] w-full bg-white flex flex-wrap overflow-y-scroll gap-1 justify-center p-1" id="input-pesanan"></div>
    
      <div class="h-[50%] w-full bg-white flex flex-wrap justify-around overflow-y-scroll p-1 gap-2" id="pesanan"></div>
      `;

    input_pesanan.showItems(input_pesanan?.data_item);
    pesanan.showOrdersItem(document.getElementById("pesanan"));
    animationLoading("content-right");
    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  } else if (a == "kerusakan") {
    div.innerHTML = `
     <div class="bg-white h-full w-full flex flex-col justify-start">
            <div class="w-full h-[70px] py-3 ">
              <div class="w-full flex justify-between">
                <h1 class="text-2xl ml-2">Kerusakan</h1>
                <div class="w-[200px] bg-amber-100 flex items-center">
              <div class="flex-1 p-1 flex justify-center items-center">
                <button
                  class="bg-orange-100 w-full rounded cursor-pointer font-bold overflow-hidden"
                  onclick="toggle('kerusakan', this)"
                >
                  <span class="inline-block">+</span>
                </button>
              </div>
              <select
                name=""
                id="select-dashboard-kerusakan"
                class="flex-2"
                onchange="filterKerusakan(this.value)"
              ></select>
            </div>
              </div>
              <div class="w-full bg-white">
             
                <ul class="flex flex-row justify-around items-center">
                  <li>posisi</li>
                  <li>repoter</li>
                  <li>status</li>
                  <li>date</li>
                  <li>action</li>
                </ul>
              </div>
            </div>
            <div class="w-full bg-gray-100 flex-1 min-h-0  p-1 relative overflow-y-scroll" id="kerusakan"></div>
          </div>
    `;
    getDataBrokeness("kerusakan", "kerusakan");
    animationLoading("content-right");

    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  } else if (a == "information") {
    div.innerHTML = `
      <div
        class="w-full h-full max-w-[1000px] bg-white rounded overflow-hidden shadow-sm"
        id="content"
      >
        <!-- atas -->
        <div class="w-full bg-white p-2 h-[10%] border-b-2 border-gray-100">
          <ul
            class="w-full h-full flex justify-around items-center [&>*]:p-2 [&>*]:flex-1 gap-2 [&>*]:rounded [&>*]:text-center [&>*]:cursor-pointer [&>*]:shadow"
            id="ul-information"
          >
            <li onclick="filterInformation(this, 'all')" class="bg-green-200">
              All
            </li>
            <li onclick="filterInformation(this, 'hk')">HK</li>
            <li onclick="filterInformation(this, 'fo')">FO</li>
            <li onclick="filterInformation(this, 'ktn')">KTN</li>
            <li onclick="filterInformation(this, 'eng')">ENG</li>
            <li class="bg-blue-300" onclick="addInformation()">add</li>
          </ul>
        </div>
        <!-- bawah -->
        <div
          class="w-full h-[90%] bg-white/50 p-2 flex flex-wrap gap-2 justify-center"
          id="content-information"
        ></div>
      </div>
    `;
    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
    showInformation("content-information", await getInformation());
  } else if (a == "purchases") {
    div.innerHTML = `
    <div
          class="w-full h-full relative shadow overflow-hidden rounded"
          id="parent-content-purchase"
        >
          <div
            class="w-full flex flex-col justify-between h-[10%] p-1 bg-white/90"
          >
            <div
              class="flex w-full gap-1 items-center"
              id="search-bar-purchases"
            >
              <h1 class="flex-2 pl-2">Purcahses List</h1>
              <select
                name=""
                id="select-purchase"
                class="flex-1 bg-white p-1 shadow rounded"
              ></select>
              <input
                type="text"
                name=""
                id=""
                class="w-[100px] p-1 bg-white shadow rounded"
                placeholder="default <= 2"
              />
              <button
                class="flex-1 bg-gray-200 rounded cursor-pointer p-1"
                onclick="fillterPurcahsesList(this)"
              >
                Show
              </button>

              <button
                class="flex-1 bg-green-200 rounded cursor-pointer p-1"
                onclick="formInputItem()"
              >
                Add
              </button>
            </div>
            <div class="w-full">
              <ul
                class="flex justify-around items-center [&>*]:flex-1 [&>*]:text-center"
              >
                <li>Section</li>
                <li>Name item</li>
                <li>Total store</li>
                <li>Satuan</li>
                <li>Type</li>
                <li>Brand</li>
                <li>Need</li>
                <li>Action</li>
              </ul>
            </div>
          </div>
          <div
            class="w-full h-[90%] bg-gray-200 flex flex-col items-center relative gap-2 p-1 rounded-b overflow-y-scroll"
            id="content-purchases"
          ></div>
        </div>

    `;

    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
    showPurchasesItem("content-purchases");
    selectRenderCek();
    showHaveMadeItemPurchasesButton();
    buttonPrint("@");
  } else if (a == "items-rooms") {
    div.innerHTML = `
    <div class="w-full h-full bg-white rounded flex justify-center flex-wrap relative content-start gap-2 pt-6 p-2" id="content-rooms"></div>

    `;
    showItemRooms();
    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  }
};

const editSectionDataInventory = (parent, section) => {
  document.getElementById(parent).innerHTML = `
  <div class="w-full h-full flex justify-center items-center" >
          <div class="w-[300px] h-[350px] bg-white/80 p-2 rounded shadow" id="form-parent-iventory-edit-item">
          <h1 class="w-full text-center text-2xl">Edit Item <span class="uppercase ">${section}</span></h1>
            <div class="w-full p-1 flex gap-2 [&>*]:cursor-pointer">
              <select
                onchange="filterInventoryEditItemForm(this.value)"
                id="select-inventory-edit"
                class="w-[50%] bg-yellow-200/50 p-1 flex-2"
              >
                <option value="" selected disabled>choose</option>
                <option value="item_list_jenis" onclick="filterInventoryEditItemForm(this.value)">jenis</option>
                <option value="item_list_laporan" onclick="filterInventoryEditItemForm(this.value)">laporan</option>
                <option value="item_list_satuan" onclick="filterInventoryEditItemForm(this.value)">satuan</option>
              </select>
              <button onclick="updateItemFormInventory(document.getElementById('select-inventory-edit'))" class="p-1 bg-green-300 flex-2">save</button>
              <button onclick="addItemFormInventory()" class="p-1 bg-blue-300 flex-1">add</button>
            </div>
            <div class="h-[250px] w-full p-1 flex flex-col gap-1 [&>*]:shadow overflow-y-scroll" id="form-edit-inventory-data">
              
            </div>
          </div>
        </div>
  `;
};

window.section = section;
window.showBoxStocks = showBoxStocks;
window.inventoryReport = inventoryReport;
window.logOutUser = logOutUser;
window.editSectionDataInventory = editSectionDataInventory;
