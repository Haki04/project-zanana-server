import { backPages, getCookie } from "../controller/controller";

let data_send = [];
let data_item;

const showItemRooms = async () => {
  data_item = data_item ?? (await getRoomItems());

  if (data_item.data.length == 0)
    return document
      .getElementById("content-rooms")
      .insertAdjacentHTML(
        "afterbegin",
        `<span class="inline-block p-2 w-1/3 capitalize text-center text-2xl bg-white shadow self-start">kosong</span>`,
      );
  data_item.data.map((item) =>
    document.getElementById("content-rooms").insertAdjacentHTML(
      "afterbegin",
      `
    <div
          class="w-[300px] h-[150px] bg-white p-2 rounded shadow flex gap-2 justify-center items-center cursor-pointer"
          onclick="moreDetailRooms(${item.room_number})"
        >
          <h1
            class="text-5xl font-bold shadow rounded-2xl h-full flex justify-center items-center flex-1"
          >
            ${item.room_number}
          </h1>
          <div class="flex-1 h-full">
            <ul
              class="w-full h-full overflow-y-scroll *:shadow *:p-2 *:bg-blue-100 flex-col justify-center flex gap-2 *:rounded"
            >
              ${item.room_data
                .filter((item) => item.item_name == `snack`)
                .map((item) =>
                  !item
                    ? `<li>-</li>`
                    : `<li>${item.item_name} ${item.item_total}</li>`,
                )
                .join("")}
              
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
          class="absolute z-10 top-0 left-0 w-full h-full bg-white/50 flex justify-center items-center "
        >
          <div
            class="w-[300px] h-fit p-2 flex flex-col items-center [&>*:not(h1):not(div)]:bg-blue-100 bg-white [&>*:not(h1):not(div)]:shadow *:w-full *:rounded gap-2 [&>*:not(div)]:p-2 shadow rounded"
          >
            <h1 class="capitalize p-2 text-3xl">item rooms</h1>
            ${item.room_data.map((item) => `<span>${item.item_name} : <span class="font-bold">${item.item_total}</span></span>`).join("")}
           
            <div class="w-full my-2">
                <button class="bg-yellow-100 p-2 w-1/2 rounded cursor-pointer capitalize" onclick="this.parentElement.parentElement.parentElement.remove()">close</button>
            </div>
          </div>
        </div>`,
      ),
    );
};

const showFormAddItemRooms = async () => {
  document.getElementById("content-rooms").insertAdjacentHTML(
    "afterbegin",
    `<div
          class="absolute z-10 top-0 left-0 w-full h-full bg-white/50 flex justify-center items-center"
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

const addItemsForm = (el_this) => {
  el_this.parentElement.querySelector("#item-form-first").insertAdjacentHTML(
    "afterbegin",
    `
    <div class="w-full *:p-2 bg-blue-100 gap-2 *:bg-blue-100 flex rounded overflow-hidden shrink-0">
      <input placeholder="item name" class="flex-2 min-w-0" type="text" value=""/>
      <input placeholder="item total" class="flex-1 min-w-0" type="number" min='0' value=""/>
    </div>
    `,
  );
};

const validation = (el_this) => {
  let valid = true;
  const form =
    el_this.parentElement.parentElement.querySelector("#item-form-first");
  data_send.push({
    room_number: form.parentElement.querySelector("input").value,
    data: [],
  });
  if (form.querySelectorAll("div").length == 0)
    return alert("item tidak boleh ada yang kosong");
  [...form.querySelectorAll("div")].map((item) => {
    const [name, total] = item.querySelectorAll("input");
    if (
      !name.value ||
      !total.value ||
      name.value == "" ||
      total.value == "" ||
      !form.parentElement.querySelector("input").value ||
      form.parentElement.querySelector("input").value == ""
    )
      return (valid = false);
    data_send[0].data.push({
      item_name: name.value,
      item_total: total.value,
    });
  });
  console.log(valid);
  if (!valid) return alert("data tidak boleh ada yang kosong");
  postRoomItems(data_send);
};

const postRoomItems = async (data) => {
  const last_update = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/rooms`,
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
  if (responses.status == 200) {
    return alert(responses.message);
  }

  data_send = [];
};

const getRoomItems = async () => {
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/rooms`,
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
