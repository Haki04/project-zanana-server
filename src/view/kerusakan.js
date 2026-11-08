import {
  animationLoading,
  animationSpin,
  filterItem,
  getCookie,
} from "../controller/controller.js";
import { selectRender } from "./components/select-render.js";
import { showFormReport } from "./report.js";
import { backPages } from "../controller/controller.js";

const editDelete = async (id, args, data = {}) => {
  if (args == 1 && !confirm("ingin menghapus item ?")) return;
  const { message, status } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/report/action?id=${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  ).then((res) => res.json());

  if (status == 200) {
    alert(message);
    showItemBrokeness("kerusakan-item-list");
  } else {
    alert(message);
  }
};

let data_old = [];
const validedKerusakanForm = async (parent, id) => {
  let verify = false;
  let data_update = [];
  parent.querySelectorAll("input").forEach((element) => {
    if (element.value == "") {
      element.focus();
      alert("data form tidak boleh kosong");
    }
  });

  parent.querySelector("select").value == ""
    ? (parent.querySelector("select").focus(),
      alert("status tidak boleh kosong"))
    : (verify = true);

  if (verify) {
    const input_element = parent.querySelectorAll("input");
    const select_element = parent.querySelector("select").value;
    data_update.push({
      posisi: input_element[0].value,
      reporter: input_element[1].value,
      status: select_element,
      date: input_element[2].value,
    });

    ///
    if (
      data_update[0].posisi != data_old[0].posisi ||
      data_update[0].reporter != data_old[0].reporter ||
      data_update[0].status != data_old[0].status ||
      data_update[0].date != data_old[0].date
    ) {
      await editDelete(id, "0", data_update);
      animationSpin(document.getElementById("btn-form-edit-kerusakan"));
      data_update = [];
      data_old = [];
      parent
        .querySelectorAll("input, select")
        .forEach((element) =>
          !element.hasAttribute("disabled") ? (element.value = "") : "",
        );
    } else {
      alert("Data tidak ada yang berubah");
    }
  }
};

const filterKerusakan = async (select_value) => {
  showItemBrokeness("kerusakan-item-list", await filterItem(select_value));
};

export const getDataBrokeness = async (element, parent) => {
  if (!getCookie()) {
    return (window.location.href = "/pages/login");
  }
  selectRender(document.getElementById(`select-dashboard-${parent}`), [
    { all: "semua" },
    { "new-est": "terbaru" },
    { "old-est": "terlama" },
    { lapor: "lapor" },
    { proses: "proses" },
    { selesai: "selesai" },
  ]);
  document.getElementById(element).innerHTML = `
  <div class="w-full h-full flex flex-wrap  justify-center gap-2 md:block" id="kerusakan-item-list"></div>
  
  `;
  showItemBrokeness("kerusakan-item-list");
};

const toggleKerusakan = async (id, parent) => {
  id && parent ? await showFormEditKerusakan(id, parent) : "";

  const form_edit = document.getElementById("form-edit-kerusakan");
  if (!id && !parent) {
    form_edit.parentElement.remove();
  }
  form_edit.parentElement.classList.remove("hidden");
};

export const showFormEditKerusakan = async (id, parent) => {
  const data = await getData(id);
  data.map((item) =>
    document.getElementById(parent).insertAdjacentHTML(
      "afterbegin",
      `
    <div
            class="absolute z-10 w-full h-full bg-slate-200/50 flex justify-center items-center hidden left-0 top-0"
          >
            <div
              class="w-[80%] md:w-[50%] max-w-[300px] bg-white/60 rounded flex flex-col justify-between p-2 gap-2 items-center shadow-lg [&>input,select]:bg-white"
              id="form-edit-kerusakan"
            >
              <h1
                class="w-full text-2xl text-center bg-white p-3 uppercase font-bold"
              >
                edit
              </h1>
              <input
                value="${item.posisi}"
                type="text"
                class="w-full p-2"
                placeholder="posisi"
              />
              <input
                value="${item.reporter}"
                type="text"
                class="w-full p-2"
                placeholder="reporter"
                disabled
              />
              <select name="" id="" class="w-full p-2">
                <option value="${item.status}" disabled selected>${item.status}</option>
                <option value="lapor">lapor</option>
                <option value="proses">proses</option>
                <option value="selesai">selesai</option>
              </select>
              <input
                value="${item.date}"
                type="text"
                class="w-full p-2"
                onclick="
                  this.type !== 'date'
                    ? confirm('ingin mengganti tanggal')
                      ? (this.type = 'date')
                      : ''
                    : ''
                "
                placeholder="date"
              />
              <div class="w-full flex flex-row gap-1 relative" id="btn-form-edit-kerusakan">
                <button
                  class="w-[50%] p-2 bg-green-200 rounded my-3 cursor-pointer hover:shadow-sm"
                  onclick="
                    validedKerusakanForm(
                      document.getElementById('form-edit-kerusakan'),
                    ${item.id})
                  "
                >
                  update
                </button>
                <button
                  class="w-[50%] p-2 bg-red-200 rounded my-3 cursor-pointer" onclick="toggleKerusakan()"
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
    `,
    ),
  );

  if (data_old.length == 0) {
    const input_element = document.querySelectorAll(
      "#form-edit-kerusakan input",
    );
    const select_element = document.querySelector(
      "#form-edit-kerusakan select",
    ).value;
    data_old.push({
      posisi: input_element[0].value,
      reporter: input_element[1].value,
      status: select_element,
      date: input_element[2].value,
    });
  }
};

const getData = async (id) => {
  const { data, status } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/report${id ? `?id=${id}` : ``}`,
  ).then((res) => res.json());

  return data;
};

export const showItemBrokeness = async (element, data_filter) => {
  const data = !data_filter ? await getData() : data_filter;
  document.getElementById(element).innerHTML = "";
  let color_status;
  data.map((item) => {
    switch (item.status) {
      case "proses":
        color_status = "bg-yellow-100";
        break;
      case "selesai":
        color_status = "bg-green-100";
        break;
      default:
        color_status = "bg-gray-100";
        break;
    }
    document.getElementById(element).innerHTML += `
   <div
                class="w-[200px] md:w-full bg-white h-fit rounded flex flex-col md:flex-row justify-between items-center gap-1  p-1 [&>*]:rounded [&>*]:text-center mt-1"
              >
                <span class="p-2 md:p-2 bg-blue-200 w-full md:flex-1 relative truncate"><img onclick="detailKerusakan(${item.id})" src="/icon/info.png" class="w-[20px] absolute cursor-pointer"/>${window.innerWidth < 600 ? `<span>posisi</span>: ` : ``}${item.posisi}</span>
                <span class="p-2 md:p-2 bg-blue-200 w-full md:flex-1">${window.innerWidth < 600 ? `<span>reporter</span>: ` : ``}${item.reporter}</span>
                <span class="p-2 md:p-2 bg-blue-200 w-full md:flex-1">${window.innerWidth < 600 ? `<span>status</span>: ` : ``}<span class="${color_status} p-1 rounded">${item.status}</span></span>
                <span class="p-2 md:p-2 bg-blue-200 w-full md:flex-1">${window.innerWidth < 600 ? `<span>creat_at</span>: ` : ``}${item.date}</span>
                <span class="p-2 md:p-2 bg-blue-200 w-full md:flex-1 cursor-pointer [&>*]:cursor-pointer [&>*]:hover:shadow-sm [&>*]:inline-block [&>*]:w-[40%] [&>*]:rounded" >
                <span onclick="toggleKerusakan(${item.id}, 'kerusakan-item-list')" class="bg-yellow-100">edit</span> | 
              <span onclick="editDelete(${item.id}, 1)" class="bg-red-100">hapus</span>
                </span>
              </div>
  
  `;
  });
};

export const detailKerusakan = async (id) => {
  const data = await getData(id);
  data.map(
    (item) =>
      (document.getElementById(
        getCookie().level != 1 ? "kerusakan" : "content-right",
      ).innerHTML += `
  <div class="${getCookie().level == 1 ? `absolute` : `fixed`}  w-full h-full bg-white/50 left-0 top-0 z-10 flex justify-center items-center">
    <div class="w-[400px] h-fit p-2 bg-white rounded shadow overflow-hidden">
        <h1 class="text-2xl w-full text-center capitalize">detail</h1>
        <div class="w-full h-fit p-1 [&>span]:shadow [&>span]:rounded">
          <span class="w-full bg-white my-1 p-2 inline-block">posisi : <span class="font-bold">${item.posisi}</span></span>
          <span class="w-full bg-white my-1 p-2 inline-block">reporter : <span class="font-bold">${item.reporter}</span></span>
          <span class="w-full bg-white my-1 p-2 inline-block">status : <span class="font-bold">${item.status}</span></span>
          <span class="w-full bg-white my-1 p-2 inline-block">tanggal : <span class="font-bold">${item.date}</span></span>
          <span class="w-full">
            <textarea class="w-full min-h-[100px] max-h-[200px] overflow-y-scroll" disabled>${item.description}</textarea>
          </span>
          <div class="w-full bg-white p-2">
            <ul class="w-full min-w-0 p-2 flex flex-row gap-2 overflow-x-scroll" id="ul-images-kerusakan">
              ${item.gambar ? `<li class="shrink-0"><img src="${import.meta.env.VITE_URL_SERVER_DEV}/uploads/${item.gambar}" class="w-[200px] border-2 aspect-video shadow rounded"/></li>` : ``}
              
            </ul>
            <div class="w-full p-1 flex justify-center gap-3 [&>*]:cursor-pointer items-center">
              <img onclick="scrollInfo(-1)" src="/icon/arrow.png" class="w-[20px] -rotate-180"/>
              <img onclick="scrollInfo(1)" src="/icon/arrow.png" class="w-[20px] "/>
            </div>
          </div>
          <span onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-yellow-100 cursor-pointer p-2 w-[80px] text-center inline-block">tutup</span>
        </div>
    </div>
  </div>
  
  `),
  );
};

function scrollInfo(direction) {
  const list = document.getElementById("ul-images-kerusakan");

  list.scrollBy({
    left: direction * 200,
    behavior: "smooth",
  });
}

export const toggle = (content, el_this) => {
  if (!parent)
    return document.getElementById("form-show-edit-kerusakan").remove();
  showFormReport(content);
};

if (getCookie().level != 1) {
  animationLoading("content");
  backPages();
}
window.getDataBrokeness = getDataBrokeness;
window.editDelete = editDelete;
window.validedKerusakanForm = validedKerusakanForm;
window.toggleKerusakan = toggleKerusakan;
window.filterKerusakan = filterKerusakan;
window.toggle = toggle;
window.detailKerusakan = detailKerusakan;
window.scrollInfo = scrollInfo;

// getDataBrokeness("kerusakan", "kerusakan");
