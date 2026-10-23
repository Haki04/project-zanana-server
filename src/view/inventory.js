import {
  getCookie,
  backPages,
  animationLoading,
  activeListHilight,
} from "../controller/controller";
import { selectRender } from "./components/select-render";

if (!getCookie()) {
  window.location.href = "/pages/login";
}

let data_send_orders = [];
let data_section_for_admin = [];
let data_select_items;
let data_form_item_new = data_section_for_admin;

window.inventoryForm = async (element, section) => {
  if (!element) return;

  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/inventory/item?section=${section}`,
  ).then((res) => res.json());
  data_select_items = await data;

  element.innerHTML = "";
  element.innerHTML = ` <div
          class="w-[300px] bg-white [&>*:not(h1)]:shadow p-2 [&>*]:mb-2 rounded shadow-sm [&>*]:focus:outline-gray-500"
          id="form-inventory"
        >
        <h1 class="text-3xl text-center font-bold mb-3" id='title'></h1>
          <div class="w-full relative">
          <input
            id="item-name"
            type="text"
            oninput="randerSearching(document.getElementById('items-searching-suggestion'), this)"
            class="w-full p-2 bg-white"
            placeholder="Nama item"
          />
           <div class="absolute top-full w-full  max-h-[300px] pt-1 [&>*]:p-1 [&>*]:mb-1 overflow-y-scroll [&>*]:border " id="items-searching-suggestion">
            </div>
          </div>
          <select name="" id="item-jenis" class="w-full bg-white p-2">
            <option value="" disabled selected>Jenis</option>
          </select>
          <select name="" id="item-report" class="w-full bg-white p-2">
            <option value="" disabled selected>Pilih laporan</option>
          </select>
          <input
            id="item-jumlah"
            type="number"
            class="p-2 bg-white w-full"
            placeholder="Jumlah"
          />
          <select name="" id="item-satuan" class="w-full bg-white p-2">
            <option value="" disabled selected>Satuan</option>
          </select>
          <input class="bg-white w-full p-2" type="text" placeholder="brand/merek" id="item-brand"/>
          <textarea
            name=""
            id="item-extra-coment"
            placeholder="extra comment"
            class="w-full bg-white p-2 h-20 overflow-auto resize-none"
          ></textarea>
          <button class="w-[70%] bg-blue-100 p-2 cursor-pointer" onclick="sendForm(this)" id="btn-inventory">Kirim</button>
        </div>`;

  const title = document
    .getElementById("form-inventory")
    .querySelector("#title");
  const btn_inventory = document
    .getElementById("form-inventory")
    .querySelector("#btn-inventory");

  switch (section) {
    case "hk":
      title.textContent = `Inventory ${section.toUpperCase()}`;
      btn_inventory.setAttribute("data-set", section);
      break;
    case "ktn":
      title.textContent = `Inventory ${section.toUpperCase()}`;
      btn_inventory.setAttribute("data-set", section);
      break;
    case "fo":
      title.textContent = `Inventory ${section.toUpperCase()}`;
      btn_inventory.setAttribute("data-set", section);
      break;
    case "eng":
      title.textContent = `Inventory ${section.toUpperCase()}`;
      btn_inventory.setAttribute("data-set", section);
      break;
  }
};

const randerSearching = (parent, el_this) => {
  if (el_this.value == "") {
    parent.innerHTML = "";
    return;
  }
  parent.innerHTML = "";
  data_select_items
    ?.filter((item) =>
      item.name.toLowerCase().startsWith(el_this.value.toLowerCase()),
    )
    .map(
      (item) =>
        (parent.innerHTML += `<span onclick="setValueInput('${el_this.getAttribute(`id`)}', '${item.name}')" class="w-full bg-white  inline-block cursor-pointer">${item.name}</span>`),
    );
};

const setValueInput = (element, value) => {
  const input = document.getElementById(element);
  input.value = value;
  input.parentElement.querySelector("#items-searching-suggestion").innerHTML =
    "";
};

export const inventoryReport = async (section, el_this) => {
  if (!section) {
    return;
  }
  if (getCookie().level == 1) {
    if (!el_this.parentElement.querySelector("#first-li")) {
      el_this.parentElement.insertAdjacentHTML(
        "afterbegin",
        `
            <li onclick="editSectionDataInventory('content', '${section}')" class="bg-yellow-200 hidden" id="first-li">EDIT</li>
      
      `,
      );
    } else {
      el_this.parentElement
        .querySelector("#first-li")
        .setAttribute(
          "onclick",
          `editSectionDataInventory('content', '${section}')`,
        );
    }

    el_this.parentElement.querySelector("li").classList.remove("hidden");
  }

  activeListHilight(document.getElementById("ul-inventory-dashboard"), el_this);

  const {
    data: [{ section_name, section_data }],
  } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/inventory?section=${section}`,
  ).then((res) => res.json());

  await inventoryForm(document.getElementById("content"), section_name);
  renderList(document.getElementById("form-inventory"), section_data);
  data_section_for_admin = section_data;
};

// render component item/list
const renderList = (form, section) => {
  if (!form) return;
  const jenis_item = section.item_list_jenis;
  const jenis_laporan = section.item_list_laporan;
  const jenis_satuan = section.item_list_satuan;
  const brand_item = section.brand;

  jenis_item.forEach((item) => {
    form.querySelector("select#item-jenis").innerHTML +=
      `<option value="${item}">${item}</option>`;
  });
  jenis_laporan.forEach((item) => {
    form.querySelector("select#item-report").innerHTML +=
      `<option value="${item}">${item}</option>`;
  });
  jenis_satuan.forEach((item) => {
    form.querySelector("select#item-satuan").innerHTML +=
      `<option value="${item}">${item}</option>`;
  });
  brand_item.forEach((item) => {
    form.querySelector("input#item-brand").innerHTML +=
      `<option value="${item}">${item}</option>`;
  });
};

// sendForm

window.sendForm = async (el_this) => {
  const form = document.getElementById("form-inventory");
  if (form.querySelector("#item-name").value == "") {
    alert("name item gak boleh kosong");
    return;
  } else {
    if (form.querySelector("#item-jenis").value == "") {
      alert("jenis item gak boleh kosong");
    } else {
      if (form.querySelector("#item-report").value == "") {
        alert("laporan gak boleh kosong");
      } else {
        if (form.querySelector("#item-jumlah").value == "") {
          alert("jumlah item gak boleh kosong");
        } else {
          if (form.querySelector("#item-satuan").value == "") {
            alert("satuan item gak boleh kosong");
          } else if (form.querySelector("#item-brand").value == "") {
            alert("code item gak boleh kosong");
          } else {
            data_send_orders.push({
              name_item: form.querySelector("#item-name").value,
              jenis_item: form.querySelector("#item-jenis").value,
              report_item: form.querySelector("#item-report").value,
              total_item: form.querySelector("#item-jumlah").value,
              satuan_item: form.querySelector("#item-satuan").value,
              brand_item: form.querySelector("#item-brand").value,
              extra_coment: form.querySelector("#item-extra-coment").value,
              section:
                getCookie().level == 1
                  ? el_this.getAttribute("data-set")
                  : getCookie().position,
            });
            const result_post = await fetch(
              `${import.meta.env.VITE_URL_SERVER_DEV}/inventory`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data_send_orders),
              },
            ).then((item) => item.json());
            if (result_post.status !== 500) {
              data_send_orders = [];
            }
            if (result_post.status == 200) {
              alert(result_post.message);
            } else {
              alert(result_post.message);
            }
            form
              .querySelectorAll("input, select, textarea")
              .forEach((element) => {
                element.value = "";
              });
          }
        }
      }
    }
  }
};

const addItemFormInventory = () => {
  document.getElementById("form-edit-inventory-data").innerHTML += `
          <span
                class="w-full bg-white p-2 rounded flex justify-between items-center gap-1"
                ><input
                  value="new.."
                  disabled
                  class="border border-transparent w-[100%] p-1"
                />
                <span class="bg-sky-100 flex gap-1 items-center">
                  <span
                    class="w-fit cursor-pointer rounded h-full bg-green-300 p-1 inline-block"
                    onclick="editSaveFormEditItemForm(this)"
                    data-count-cek="0">edit</span
                  >
                  <span
                    class="w-fit cursor-pointer rounded h-full bg-red-300 p-1 inline-block"
                    onclick="this.parentElement.parentElement.remove()"
                    >delete</span
                  >
                </span>
              </span>`;
};

const filterInventoryEditItemForm = (el_value) => {
  document.getElementById("form-edit-inventory-data").innerHTML = "";
  data_section_for_admin[el_value].map((item) => {
    document.getElementById("form-edit-inventory-data").innerHTML += `
          <span
                class="w-full bg-white p-2 rounded flex justify-between items-center gap-1"
                ><input
                  value="${item}"
                  disabled
                  class="border border-transparent w-[100%] p-1"
                />
                <span class="bg-sky-100 flex gap-1 items-center">
                  <span
                    class="w-fit cursor-pointer rounded h-full bg-green-300 p-1 inline-block"
                    onclick="editSaveFormEditItemForm(this)"
                    data-count-cek="0">edit</span
                  >
                  <span
                    class="w-fit cursor-pointer rounded h-full bg-red-300 p-1 inline-block"
                    onclick="this.parentElement.parentElement.remove()"
                    >delete</span
                  >
                </span>
              </span>
          `;
  });
};

const updateItemFormInventory = (parent) => {
  const form_inventory_edit = data_section_for_admin;
  const item_input_new = [];
  const form_parent = document.getElementById("form-parent-iventory-edit-item");
  const form = document.getElementById("form-edit-inventory-data");
  [...form.querySelectorAll("span input")].map((item) => {
    if (item.value != "") {
      item_input_new.push(item.value);
    } else {
      alert("data tidak boleh kosong");
    }
  });
  form_inventory_edit[parent.value] = item_input_new;
  sendNewItemFormInventory(form_inventory_edit, form_parent);
};

const sendNewItemFormInventory = async (data, form_parent) => {
  const response = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/section/update`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section: getCookie().position,
        data_form: JSON.stringify(data),
      }),
    },
  ).then((item) => item.json());

  if (response.status == 201) {
    form_parent.innerHTML = `
  <div class="w-full h-full flex justify-center items-center">
    <span class="w-[80%] p-2 text-center bg-green-300">Berhasil</span>
  </div>
  
  `;
    setTimeout(() => form_parent.remove(), 1000);
  } else {
    alert(response.message);
  }
};

const editSaveFormEditItemForm = (el_this) => {
  if (el_this.getAttribute("data-count-cek") == 0) {
    el_this.textContent = "save";
    el_this.parentElement.parentElement
      .querySelector("input")
      .removeAttribute("disabled");
    el_this.parentElement.parentElement.querySelector("input").focus();
    el_this.setAttribute("data-count-cek", "1");
  } else {
    el_this.textContent = "edit";
    el_this.parentElement.parentElement
      .querySelector("input")
      .setAttribute("disabled", "");
    el_this.setAttribute("data-count-cek", "0");
  }
};

//

if (getCookie().level != 1) {
  // animationLoading("content", "before");
  backPages();
}

window.inventoryReport = inventoryReport;
window.getCookie = getCookie;
window.setValueInput = setValueInput;
window.randerSearching = randerSearching;
window.filterInventoryEditItemForm = filterInventoryEditItemForm;
window.editSaveFormEditItemForm = editSaveFormEditItemForm;
window.updateItemFormInventory = updateItemFormInventory;
window.addItemFormInventory = addItemFormInventory;
