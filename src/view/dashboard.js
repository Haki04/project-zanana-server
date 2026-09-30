import * as pesanan from "../view/pesanan.js";
import * as input_pesanan from "../view/input-pesanan.js";
import { inventoryReport } from "./inventory.js";
import {
  animationLoading,
  activeListHilight,
} from "../controller/controller.js";
import { getDataBrokeness, showFormEditKerusakan } from "./kerusakan.js";

const dataSection = {
  dashboard: `
        <div
            class="w-full bg-slate-300 flex flex-row gap-1 p-1"
            id="staff"
          ></div>
          <div class="bg-white h-[500px] w-full flex flex-col justify-start">
            <div class="w-full bg-slate-300 h-[70px]">
              <div class="w-full flex justify-between bg-white">
                <h1 class="text-2xl">Kerusakan</h1>
                <div class="w-[200px] bg-amber-100 flex items-center">
                  <select name="" id="select-dashboard-dashboard">
                  </select>
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
            <div class="w-full bg-slate-400 h-full p-1 overflow-y-scroll" id="kerusakan"></div>
          </div>
    `,
};

const showStaffBoxs = (element) => {
  const data = ["kiki", "yani", "dody"];
  data.map((item) => {
    document.getElementById(element).innerHTML += `
             <div
              class="w-[100px] h-[150px] bg-white rounded flex flex-col justify-start items-center p-1"
            >
              <div
                class="bg-gray-400 w-[80px] h-[80px] rounded-full overflow-hidden flex"
              ></div>
              <span>${item}</span>
              <span>shiff : <span class="font-bold ">ON</span></span>
              
            </div>
    `;
  });
};

const section = (a, el_this) => {
  if (!document.getElementById("cek-exist")) {
    document
      .querySelector("body")
      .insertAdjacentHTML(
        "afterbegin",
        '<div id="cek-exist" class="hidden">test</div>',
      );
  }
  activeListHilight();
  document.querySelectorAll("#back-pages").forEach((item) => item.remove());
  const div = document.getElementById("content-right");
  if (a == "dashboard") {
    div.innerHTML = dataSection.dashboard;
    showStaffBoxs("staff");
    getDataBrokeness("kerusakan", "dashboard");
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
    window.inventoryReport = inventoryReport;
    animationLoading("content-right");
    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  } else if (a == "staff") {
    div.innerHTML = `
     <div
            class="w-full h-full bg-slate-300 flex flex-row justify-center gap-1 p-1"
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

    input_pesanan.showItems(input_pesanan.data_item);
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
            <div class="w-full bg-slate-300 h-[70px]">
              <div class="w-full flex justify-between bg-white">
                <h1 class="text-2xl">Kerusakan</h1>
                <div class="w-[200px] bg-amber-100 flex items-center">
                  <select name="" id="select-dashboard-kerusakan">
                   
                  </select>
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
            <div class="w-full bg-slate-400 h-full p-1" id="kerusakan"></div>
          </div>
    `;
    getDataBrokeness("kerusakan", "kerusakan");
    animationLoading("content-right");

    activeListHilight(
      document.getElementById("ul-dashboard"),
      el_this,
      "bg-yellow-100",
    );
  }
};

section("dashboard", "");
window.section = section;

// section("dashboard");

// dahsboard()
// inventory()
// staff()
// pesanan()
// kerusakan()
