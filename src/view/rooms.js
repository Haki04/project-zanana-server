import { backPages, getCookie } from "../controller/controller";

let data_send = [];
let data_item;

export const showItemRooms = async () => {
  if (!getCookie()) {
    return (window.location.href = "/pages/login.html");
  }
  data_item = await getRoomItems();
  if (data_item.data.length == 0)
    return document.getElementById("content-rooms").insertAdjacentHTML(
      "afterbegin",
      `<div
          class="absolute w-[30px] z-1 right-0 top-0 bg-green-100 p-2 cursor-pointer"
          onclick="showFormAddItemRooms()"
        >
          <img src="/icon/plus.png" alt="" />
        </div>
        <span class="inline-block p-2 w-1/3 capitalize text-center text-2xl bg-white shadow self-start">kosong</span>`,
    );
  document.getElementById("content-rooms").innerHTML = "";
  document.getElementById("content-rooms").insertAdjacentHTML(
    "afterbegin",
    `  <div
          class="absolute w-[30px] z-1 right-1 top-1  bg-green-100 p-2 cursor-pointer"
          onclick="showFormAddItemRooms()"
        >
          <img src="/icon/plus.png" class="w-full" alt="" />
        </div>`,
  );
  data_item.data.map((item) =>
    document.getElementById("content-rooms").insertAdjacentHTML(
      "beforeend",
      `
    <div
          class="w-[300px] h-[150px] bg-white p-2 rounded shadow flex gap-2 justify-center items-center  relative"
          
        >
        <span class="absolute right-0 top-0 bg-green-100 inline-block px-2 cursor-pointer" onclick="showFormAddEditSnackItems('${item.snack_room ? `edit` : `add`}', ${item.room_number}) ">${item.snack_room ? `edit` : `add`}</span>
          <h1
            class="text-5xl font-bold shadow rounded-2xl h-full cursor-pointer flex justify-center items-center flex-1" onclick="moreDetailRooms(${item.room_number})"
          >
            ${item.room_number} 
          </h1>
          <div class="flex-1 h-full">
            <ul
              class="w-full h-full overflow-y-scroll *:shadow *:p-2  flex-col justify-center flex gap-2 *:rounded"
            >
              ${
                item.snack_room
                  ? item.snack_room
                      .map(
                        (item) =>
                          `<li class="bg-blue-100">${item.item_name} ${item.item_total}</li>`,
                      )
                      .join("")
                  : `<li class="bg-red-100">snack 0</li>`
              }
            </ul>
          </div>
        </div>
    
    `,
    ),
  );
};

const moreDetailRooms = (room) => {
  data_item.data
    .filter((item) => item.room_number == room)
    .map((item) =>
      document.getElementById("content-rooms").insertAdjacentHTML(
        "afterbegin",
        `<div
          class="${getCookie().level == 1 ? `absolute` : `fixed`} z-10 top-0 left-0 w-full h-full bg-white/50 flex justify-center items-center "
        >
          <div
            class="w-[300px] h-fit p-2 flex flex-col items-center [&>*:not(h1):not(div):not(span):not(input[type=search])]:bg-blue-100 bg-white [&>*:not(h1):not(div):not(span)]:shadow [&>*:not(span)]:w-full *:rounded gap-2 [&>*:not(div):not(span)]:p-2 shadow rounded relative"
          >
              <span class="hidden p-2 right-0 top-0 bg-green-100 cursor-pointer" onclick="addItemsForm(this)">add items</span>
            <h1 class="capitalize p-2 text-3xl">item rooms</h1>
            <input value="${item.room_number}" type="text" disabled/>
            <input value=""  id="input-search" oninput="fillterItemMoreDetail(this)" type="search" class="bg-gray-100" placeholder="keywords"/>
            <div class="w-full overflow-y-scroll h-fit max-h-[400px] flex flex-col gap-2" id='item-form-first'>
            ${item.room_data
              .map(
                (item) => `
                <div class="w-full *:p-2 bg-blue-100 gap-2 *:bg-blue-100 flex rounded overflow-hidden shrink-0">
                  <input placeholder="item name" class="flex-2 min-w-0" type="text" value="${item.item_name}" disabled />
                  <input placeholder="item total" class="flex-1 min-w-0" type="number" min='0' value="${item.item_total}" disabled/>
            </div>`,
              )
              .join("")}
              </div>
           
            <div class="w-full my-2 flex gap-2" id="item-form-btn">
                <button class="bg-orange-100 p-2 flex-1 rounded cursor-pointer capitalize" onclick="toggleUndisabledInputFormEditMoreItems(this)" id="first-btn-detail">edit</button>
                <button class="bg-green-100 p-2 flex-1 rounded cursor-pointer capitalize hidden" onclick="validation(this, false, true)" id="btn-update-room-items">update</button>
                <button class="bg-yellow-100 p-2 flex-1 rounded cursor-pointer capitalize" onclick="this.parentElement.parentElement.parentElement.remove()">close</button>
            </div>
          </div>
        </div>`,
      ),
    );
};

const fillterItemMoreDetail = async (el_this) => {
  const form = el_this.parentElement.querySelector("#item-form-first");
  form.innerHTML = "";

  form.parentElement
    .querySelector("#item-form-btn")
    .querySelector("#first-btn-detail")
    ? form.parentElement
        .querySelector("#item-form-btn")
        .querySelector("#first-btn-detail")
        .remove()
    : "";

  data_item.data
    .filter(
      (item) =>
        item.room_number ==
        parseInt(el_this.parentElement.querySelector("input").value),
    )
    .flatMap((item) => item.room_data)
    .filter((item) => item.item_name.startsWith(el_this.value.toLowerCase()))
    .map((item) => {
      form.insertAdjacentHTML(
        "afterbegin",
        `
                <div class="w-full *:p-2 bg-blue-100 gap-2 *:bg-blue-100 flex rounded overflow-hidden shrink-0">
                  <input placeholder="item name" class="flex-2 min-w-0" type="text" value="${item.item_name}" disabled />
                  <input placeholder="item total" class="flex-1 min-w-0" type="number" min='0' value="${item.item_total}" disabled/>
            </div>`,
      );
    });
};

const toggleUndisabledInputFormEditMoreItems = (el_this) => {
  const form = el_this.parentElement.parentElement;
  for (const item of form.querySelector("div").querySelectorAll("input")) {
    form.querySelector("span").classList.replace("hidden", "absolute");
    item.parentElement.setAttribute("ondblclick", "this.remove()");
    item.removeAttribute("disabled");
  }
  el_this.classList.add("hidden");
  form
    .querySelector("#btn-update-room-items")
    .classList.replace("hidden", "block");
  form.querySelector("#input-search").remove();
};

const showFormAddItemRooms = async () => {
  document.getElementById("content-rooms").insertAdjacentHTML(
    "afterbegin",
    `<div
          class="${getCookie().level == 1 ? `absolute` : `fixed`} z-10 top-0 left-0 w-full h-full bg-white/50 flex justify-center items-center"
        >
          <div
            class="w-[300px] h-fit overflow-y-scroll p-2 flex flex-col items-center [&>*:not(h1):not(div):not(span)]:bg-blue-100 bg-white [&>*:not(h1):not(div):not(span)]:shadow [&>*:not(span)]:w-full *:rounded gap-2 [&>*:not(div)]:p-2 shadow rounded relative"
          >
            <span class="absolute p-2 right-0 top-0 bg-green-100 cursor-pointer" onclick="addItemsForm(this)">add items</span>
            <h1 class="capitalize p-2 text-3xl">add item</h1>
            <input type="text" placeholder="room number" />
            <div class="w-full overflow-y-scroll h-fit max-h-[400px] flex flex-col gap-2" id='item-form-first'></div>

            <div class="w-full my-2 flex gap-2">
              <button
                class="bg-green-100 p-2 w-1/2 rounded cursor-pointer capitalize"
                onclick="if(confirm('pastika data sudah sesuai !')) validation(this)"
              >
                Add
              </button>
              <button
                class="bg-yellow-100 p-2 w-1/2 rounded cursor-pointer capitalize"
                onclick="
                  this.parentElement.parentElement.parentElement.remove()
                "
              >
                cancel
              </button>
            </div>
          </div>
        </div>`,
  );
};

const showFormAddEditSnackItems = (type, room_number) => {
  document.getElementById("content-rooms").insertAdjacentHTML(
    "afterbegin",
    `<div
          class="${getCookie().level == 1 ? `absolute` : `fixed`} z-10 top-0 left-0 w-full h-full bg-white/50 flex justify-center items-center"
        >
          <div
            class="w-[300px] h-fit overflow-y-scroll p-2 flex flex-col items-center [&>*:not(h1):not(div):not(span):not(select)]:bg-blue-100 bg-white [&>*:not(h1):not(div):not(span):not(select)]:shadow [&>*:not(span):not(select)]:w-full *:rounded gap-2 [&>*:not(div)]:p-2 shadow rounded relative"
          >
            <select class="absolute p-2 right-1 top-1 bg-green-100 cursor-pointer *:capitalize " onchange="addItemsForm(this)">
              <option value="" disabled selected>add snack</option>
              <option>happytos</option>
              <option>mr.p</option>
              <option>citato</option>
              <option>lays</option>
              <option value="-" class="bg-red-100">kosong</option>
            </select>
            <h1 class="capitalize p-2 text-3xl">${type} snack</h1>
            <input type="text" placeholder="room number" value="${room_number}" disabled/>
            <div class="w-full overflow-y-scroll h-fit max-h-[400px] flex flex-col gap-2" id='item-form-first'>
            ${
              type == `edit`
                ? data_item.data
                    .filter((item) => item.room_number == room_number)
                    .map((item) =>
                      item.snack_room
                        .map(
                          (item) => `
               <div class="w-full *:p-2 bg-blue-100 gap-2  *:bg-blue-100 flex rounded overflow-hidden shrink-0" ondblclick="this.remove()">
                  <input placeholder="item name" class="flex-2 min-w-0" type="text" value="${item.item_name}" />
                  <input placeholder="item total" class="flex-1 min-w-0" type="number" min='0' value="${parseInt(item.item_total)}"/>
            </div>
              
              `,
                        )
                        .join(""),
                    )
                : ``
            }
            </div>

            <div class="w-full my-2 flex gap-2">
              <button
                class="bg-green-100 p-2 w-1/2 rounded cursor-pointer capitalize"
                onclick="if(confirm('pastika data sudah sesuai !')) validation(this, true, false)"
              >
                ${type == `edit` ? `update` : `add`}
              </button>
              <button
                class="bg-yellow-100 p-2 w-1/2 rounded cursor-pointer capitalize"
                onclick="
                  this.parentElement.parentElement.parentElement.remove()
                "
              >
                cancel
              </button>
            </div>
          </div>
        </div>`,
  );
};

const addItemsForm = (el_this) => {
  if (el_this.value == "-") {
    return (el_this.parentElement.querySelector("#item-form-first").innerHTML =
      `
     <div class="w-full *:p-2 bg-blue-100 gap-2 *:bg-red-100 flex rounded overflow-hidden shrink-0">
      <input placeholder="item name" class="flex-2 min-w-0" type="text" value="kosong" disabled id="snack-kosong"/>
      <input placeholder="item total" class="flex-1 min-w-0 hidden" type="number" min='0' value="0"/>
    </div>
    `);
  }
  if (document.getElementById("snack-kosong"))
    document.getElementById("snack-kosong").remove();
  el_this.parentElement.querySelector("#item-form-first").insertAdjacentHTML(
    "afterbegin",
    `
    <div class="w-full *:p-2 bg-blue-100 gap-2 *:bg-blue-100 flex rounded overflow-hidden shrink-0" ondblclick="this.remove()">
      <input placeholder="item name" class="flex-2 min-w-0" type="text" value="${el_this.value ?? ``}"/>
      <input placeholder="item total" class="flex-1 min-w-0" type="number" min='0' value=""/>
    </div>
    `,
  );
};

const validation = (el_this, snack, item) => {
  data_send = [];
  const form =
    el_this.parentElement.parentElement.querySelector("#item-form-first");
  data_send.push({
    room_number: form.parentElement.querySelector("input").value,
    data: [],
  });
  if (form.querySelectorAll("div").length == 0)
    return alert("item tidak boleh ada yang kosong");
  for (const item of form.querySelectorAll("div")) {
    const [name, total] = item.querySelectorAll("input");
    if (
      !name.value ||
      !total.value ||
      name.value == "" ||
      total.value == "" ||
      !form.parentElement.querySelector("input").value ||
      form.parentElement.querySelector("input").value == ""
    )
      return alert("data tidak boleh ada yang kosong");

    data_send[0].data.push({
      item_name: name.value,
      item_total: total.value,
    });
  }
  postRoomItems(data_send, snack, item);
};

const postRoomItems = async (data, snack, item) => {
  const last_update = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/rooms${snack ? `/item?snack=true` : item ? `/item?item=true` : ``}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
        last_update: last_update,
        reporter: getCookie().name,
      }),
    },
  ).then((res) => res.json());
  if (responses.status == 200 || responses.status == 201) {
    alert(responses.message);
    data_send = [];
    return showItemRooms();
  }
};

const getRoomItems = async () => {
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/rooms`,
  ).then((res) => res.json());
  return responses;
};
const editRoomItems = async () => {};

window.moreDetailRooms = moreDetailRooms;
window.showFormAddItemRooms = showFormAddItemRooms;
window.backPages = backPages;
window.addItemsForm = addItemsForm;
window.validation = validation;
window.showItemRooms = showItemRooms;
window.showFormAddEditSnackItems = showFormAddEditSnackItems;
window.toggleUndisabledInputFormEditMoreItems =
  toggleUndisabledInputFormEditMoreItems;
window.fillterItemMoreDetail = fillterItemMoreDetail;
