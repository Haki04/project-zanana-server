import {
  animationLoading,
  animationSpin,
  backPages,
  getCookie,
} from "../controller/controller";
import { showOrdersItem } from "./pesanan";

export const data_item = [
  {
    name: "nasi goreng",
    category: "lokal",
    img: "input.png",
  },
  {
    name: "gado gado",
    category: "lokal",
    img: "logout.png",
  },
  {
    name: "spageti",
    category: "eropa",
    img: "order.png",
  },
];

export let data_list_order = [];

let data_send = [];

window.countOrderItem = (sign, e) => {
  const el = e.target.closest("#input_count");
  const element = el.querySelector("input");

  if (sign === "+") {
    element.value++;
  } else if (sign === "-" && element.value > 0) {
    element.value--;
  }
};

window.removeItem = (items, index) => {
  data_list_order.splice(index, 1);
  document.querySelector("span #count-order-item").textContent =
    data_list_order.length;

  showItemOrder(items, data_list_order);
};

window.addListItem = (items, e, evnt) => {
  const total = e.querySelector("input");
  const name_item = evnt.target;
  if (Number(total.value) > 0) {
    if (
      evnt.target.tagName === "BUTTON" &&
      name_item.getAttribute("data-name")
    ) {
      const index = data_list_order.findIndex(
        (item) => item.name === name_item.getAttribute("data-name"),
      );
      if (data_list_order.length > 0 || data_list_order == 0) {
        if (index !== -1) {
          data_list_order[index].total =
            parseInt(data_list_order[index].total) + parseInt(total.value);
          total.value = "0";
        } else {
          data_list_order.push({
            name: name_item.getAttribute("data-name"),
            total: total.value,
          });
          total.value = "0";
        }
        document.querySelector("span #count-order-item").textContent =
          data_list_order.length;
      }
    }
  } else {
    alert("pastikan mengisi total item yang di tambahkan ");
  }
  showItemOrder(items, data_list_order);
};

window.btnToggle = (e) => {
  if (
    document.getElementById("room-number").getAttribute("data-cek") !== "sudah"
  ) {
    loopingSelect({
      content: document.getElementById("room-number"),
      rooms: 101,
    });
    loopingSelect({
      content: document.getElementById("place-to-eat"),
      data: ["pool", "resto", "room"],
    });
  }

  document.getElementById("room-number").setAttribute("data-cek", "sudah");
  const div_lis_order = document.getElementById("item-order-list");
  const toggle = document.getElementById("toggle");

  if (!toggle.checked) {
    div_lis_order.classList.remove("hidden");
    toggle.checked = true;
  } else {
    toggle.checked = false;
    div_lis_order.classList.add("hidden");
  }
};

window.filterItems = (arg) => {
  setTimeout(
    () =>
      showItems(
        data_item.filter((item) =>
          ["name", "category"].some((key) =>
            item[key]?.toLowerCase().startsWith(arg.toLowerCase()),
          ),
        ),
      ),
    500,
  );
};

export const showItems = (data) => {
  try {
    if (!document.getElementById("box-searching")) {
      showSerchingBox();
    }
    const element = document.getElementById("input-pesanan");
    if (!element) {
      return;
    }
    element.innerHTML = "";
    data.forEach((d) => {
      element.innerHTML += `
         <div
          class="w-[300px] h-[150px] rounded flex justify-around items-center overflow-hidden shadow-md" 
        >
          <div class="w-[60%] flex justify-center items-center">
            <img class="w-full" src="/image/soto.jpg" alt="" />
          </div>
          <div
            class="w-[40%] bg-white h-full flex flex-col justify-center items-center gap-2" id="input_count"  onclick="addListItem(document.getElementById('list-item-li'), this, event)"
          >
            <h1 class="text-1xl font-bold capitalize">${d.name}</h1>
            <div
              class="flex flex-row px-1 rounded border-2 items-center w-[70%] md:w-[50%] h-[30%]" 
            >
              <input value="0" class="w-full h-4 focus:outline-0 text-[18px]" id="input"/>

              <div class="flex flex-col [&>button]:text-[12px] [&>*]:cursor-pointer">
                <button onclick="countOrderItem('+', event)">▲</button>
                <button onclick="countOrderItem('-', event)">▼</button>
              </div>
            </div>
            <button data-name="${d.name}" class="w-[80%] mt-[10%] md:mt-0 py-[5%] md:py-[2%] bg-green-400 rounded cursor-pointer"  id="btn-add">
              tambah
            </button>
          </div>
        </div>
        `;
    });
    if (getCookie().level != 1) {
      animationLoading("content");
      backPages();
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendOrder = async (btn) => {
  const room_number = document.getElementById("room-number").value;
  const place_to_eat = document.getElementById("place-to-eat").value;
  if (data_list_order.length == 0) {
    alert("list orderan tidak boleh kosong");
  } else {
    if (room_number == "") {
      alert("room number tidak boleh kosong");
    } else {
      if (place_to_eat == "") {
        alert("tempat makan tidak boleh kosong");
      } else {
        animationSpin(btn);
        const date = new Date();
        const uu_id = `${String(date.getHours()).padStart(2, `0`)}${String(date.getMinutes()).padStart(2, `0`)}${String(date.getSeconds()).padStart(2, `0`)}`;
        data_send.push({
          room: room_number,
          place: place_to_eat,
          status: "order",
          uu_id: uu_id,
          items: JSON.stringify([...data_list_order]),
        });
        const results = await fetch(
          `${import.meta.env.VITE_URL_SERVER_DEV}/users/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data_send),
          },
        ).then((res) => res.json());
        if (document.getElementById("cek-exist")) {
          showOrdersItem(document.getElementById("pesanan"));
        }
        if (results.success == 201) {
          data_send = [];
          if (document.getElementById("cek-exist")) {
            showOrdersItem(document.getElementById("pesanan"));
          }
          const set_elements = [
            ...document
              .getElementById("item-order-list")
              .querySelectorAll("select"),
          ];
          set_elements.forEach((element) => {
            element.value = "";
          });
          showItemOrder(
            document.getElementById("list-item-li"),
            (data_list_order = []),
          );

          document.querySelector("span #count-order-item").textContent =
            data_list_order.length;

          alert(results.message);
        } else {
          alert(results.message);
        }
      }
    }
  }
};

export const showItemOrder = (items, data) => {
  try {
    let el = "";

    data.forEach((d, i) => {
      el += `
         <li class="flex justify-between">
                       ${d.name} - ${d.total}x
                        <span
                          onclick="removeItem(document.getElementById('list-item-li'))"
                          class="mr-[10px] cursor-pointer text-red-500"
                          onclick="removeItem(document.getElementById('list-item-li'),${i})">X</span
                        >
                      </li>
        `;
    });
    items.innerHTML = el;
  } catch (error) {
    console.log(error);
  }
};

export const showSerchingBox = () => {
  let div = document.getElementById("content");

  div?.insertAdjacentHTML(
    "afterbegin",
    `
    <div
        class="fixed top-2 right-2 bg-white/80 z-10 border flex flex-row gap-3 p-1" id="box-searching"
      >
        <span
          class="absolute -left-9 font-bold cursor-pointer w-[10%] flex justify-between"
          onclick="btnToggle(this)"
          ><span id="count-order-item">0</span><img src="/icon/order.png"  class="w-[20px] inline-block"/></span
        >
        <ul
          class="flex flex-row items-center gap-3 [&>li]:cursor-pointer [&>li]:text-[14px]"
        >
          <li onclick="showItems(data_item)">All</li>
          <li onclick="filterItems(this.textContent)">Lokal</li>
          <li onclick="filterItems(this.textContent)">Eropa</li>
        </ul>
        <input
          type="search"
          onkeydown="filterItems(this.value)"
          placeholder="Cari"
          class="border p-0.5 w-[80px] md:w-auto"
        />
        <div
          class="absolute z-20 flex justify-center items-center right-0 top-10 hidden"
          id="item-order-list"
        >
          <div
            class="w-[300px] p-1 bg-gray-100 [&>*]:w-[70%] flex flex-col items-center gap-3 rounded"
          >
            <select name="" value="" id="room-number" data-cek='belum'>
              <option value="" disabled selected>Room</option>
            </select>
            <select name="" value="" id="place-to-eat">
              <option value="" disabled selected>Place</option>
            </select>
            <ul
              class="border h-[150px] bg-white p-1 overflow-auto"
              id="list-item-li"
            ></ul>
            <button
              onclick="sendOrder(this)"
              class="p-1 mb-3 bg-green-300/50 border rounded cursor-pointer relative overflow-hidden"
            >
              kirim order
            </button>
          </div>
        </div>
      </div>

    `,
  );
};

export const loopingSelect = (data) => {
  try {
    if (data.rooms) {
      for (let i = data.rooms; i <= 120; i++) {
        data.content.innerHTML += `<option value="${i}">${i}</option>`;
      }
    } else {
      data.data.map(
        (place) =>
          (data.content.innerHTML += `<option value="${place}">${place}</option>`),
      );
    }
  } catch (error) {
    console.log(error);
  }
};

showItems(data_item);

window.data_send = data_send;
window.sendOrder = sendOrder;
window.showItems = showItems;
window.animationLoading = animationLoading;
