import { animationSpin, filterItem } from "../controller/controller.js";
import { selectRender } from "./components/select-render.js";

const editDelete = async (id, arg, data = {}) => {
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
    showItemBrokeness("kerusakan");
  } else {
    alert(message);
  }
};

let data_old = [];
const validedKerusakanForm = async (parent, id, action) => {
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
      data_update[0].posisi !== data_old[0].posisi ||
      data_update[0].reporter !== data_old[0].reporter ||
      data_update[0].status !== data_old[0].status ||
      data_update[0].date !== data_old[0].date
    ) {
      await editDelete(id, action, data_update);
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
  showItemBrokeness("kerusakan", await filterItem(select_value));
};

export const getDataBrokeness = async (element, parent) => {
  selectRender(document.getElementById(`select-dashboard-${parent}`), [
    { all: "semua" },
    { "new-est": "terbaru" },
    { "old-est": "terlama" },
    { lapor: "lapor" },
    { proses: "proses" },
    { selesai: "selesai" },
  ]);
  showItemBrokeness(element);
};

const toggleKerusakan = async (id, action, parent) => {
  id && String(action) && parent
    ? await showFormEditKerusakan(id, action, parent)
    : "";

  const form_edit = document.getElementById("form-edit-kerusakan");
  if (!id || (!String(action) && !parent)) {
    form_edit.parentElement.remove();
  }
  form_edit.parentElement.classList.remove("hidden");
};

export const showFormEditKerusakan = async (id, action, parent) => {
  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/report?id=${id}`,
  ).then((item) => item.json());
  data.map((item) =>
    document.getElementById(parent).insertAdjacentHTML(
      "afterbegin",
      `
    <div
            class="absolute w-full h-full bg-orange-200/50  flex justify-center items-center hidden left-0 top-0"
          >
            <div
              class="w-[50%] max-w-[300px] bg-white/60 rounded flex flex-col justify-between p-2 gap-2 items-center shadow-lg [&>input,select]:bg-white"
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
                    ${item.id}, ${action})
                  "
                >
                  update
                </button>
                <button
                  class="w-[50%] p-2 bg-red-200 rounded my-3 cursor-pointer" onclick="toggleKerusakan()"
                >
                  batal
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

const getData = async () => {
  const { data, status } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/report`,
  ).then((res) => res.json());

  return data;
};

const showItemBrokeness = async (element, data_filter) => {
  const data = !data_filter ? await getData() : data_filter;
  document.getElementById(element).innerHTML = "";
  data.map((item) => {
    document.getElementById(element).innerHTML += `
   <div
                class="w-full bg-white h-auto rounded flex flex-row justify-between items-center gap-1 p-1 [&>*]:rounded [&>*]:text-center mt-1"
              >
                <span class="p-1 bg-blue-200 flex-1">${item.posisi}</span>
                <span class="p-1 bg-blue-200 flex-1">${item.reporter}</span>
                <span class="p-1 bg-blue-200 flex-1">${item.status}</span>
                <span class="p-1 bg-blue-200 flex-1">${item.date}</span>
                <span class="p-1 bg-blue-200 flex-1 cursor-pointer [&>*]:cursor-pointer [&>*]:hover:shadow-sm [&>*]:inline-block [&>*]:w-[40%] [&>*]:rounded" >
                <span onclick="toggleKerusakan(${item.id}, 0, 'kerusakan')" class="bg-yellow-100">edit</span> | 
                <span onclick="editDelete(${item.id}, 1)" class="bg-red-100">hapus</span>
                </span>
              </div>
  
  `;
  });
};

window.getDataBrokeness = getDataBrokeness;
window.editDelete = editDelete;
window.validedKerusakanForm = validedKerusakanForm;
window.toggleKerusakan = toggleKerusakan;
window.filterKerusakan = filterKerusakan;

// getDataBrokeness("kerusakan", "kerusakan");
