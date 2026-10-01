import {
  getCookie,
  backPages,
  animationLoading,
  activeListHilight,
} from "../controller/controller";
if (!getCookie()) {
  window.location.href = "/pages/login";
}

const data_forms = {
  form: `  <div
          class="w-[300px] bg-gray-200/70 p-1 [&>*]:mb-2 rounded shadow-sm [&_*]:focus:outline-gray-500"
          id="form-inventory"
        >
          <h1 class="text-3xl text-center font-bold mb-3" id='title'></h1>
          <input
            id="item-name"
            type="text"
            class="w-full p-2 bg-white"
            placeholder="Nama item"
          />
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
          <textarea
            name=""
            id="item-extra-coment"
            placeholder="extra comment"
            class="w-full bg-white p-2 h-20 overflow-auto resize-none"
          ></textarea>
          <button class="w-[70%] bg-white p-2 cursor-pointer" onclick="sendForm(this)" id="btn-inventory">Report</button>
        </div>`,
};

const data_section_form = {
  hk: {
    section_name: "ktn",
    item_list_jenis: [
      "sayuran",
      "buah",
      "frozen",
      "cair",
      "kering",
      "bumbu-cair",
      "bumbu-bubuk",
      "bumbu-pasta",
    ],
    item_list_laporan: ["restock", "sold-out", "inventory"],
    item_list_satuan: ["kg", "pcs", "pack", "trey", "duz", "satuan"],
  },
};

let data_send_orders = [];

window.inventoryForm = (element, section) => {
  if (!element) return;
  element.innerHTML = "";
  element.innerHTML = data_forms.form;
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

// inventory(document.getElementById("content"), "fo");
export const inventoryReport = async (section, el_this) => {
  if (!section) {
    return;
  }

  activeListHilight(document.getElementById("ul-inventory-dashboard"), el_this);

  const {
    data: [{ section_name, section_data }],
  } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/inventory?section=${section}`,
  ).then((res) => res.json());

  inventoryForm(document.getElementById("content"), section_name);
  renderList(document.getElementById("form-inventory"), section_data);
};

// render component item/list
const renderList = (form, section) => {
  if (!form) return;
  const jenis_item = section.item_list_jenis;
  const jenis_laporan = section.item_list_laporan;
  const jenis_satuan = section.item_list_satuan;

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
          } else {
            data_send_orders.push({
              name_item: form.querySelector("#item-name").value,
              jenis_item: form.querySelector("#item-jenis").value,
              report_item: form.querySelector("#item-report").value,
              total_item: form.querySelector("#item-jumlah").value,
              satuan_item: form.querySelector("#item-satuan").value,
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

if (!getCookie().level == 1) {
  animationLoading("content");
}
// auto runing funtion
inventoryReport(getCookie().position, "");
