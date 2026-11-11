import {
  activeListHilight,
  backPages,
  getCookie,
} from "../controller/controller";
if (getCookie().level != 1) backPages();

let data_form_information = [];

export const showInformation = async (parent, data) => {
  if (!getCookie()) {
    return (window.location.href = "/pages/login.html");
  }
  data = data ?? (await getInformation());
  document.getElementById(parent).innerHTML = "";
  data.map((item) => {
    document.getElementById(parent).innerHTML += `
     <div
            class="w-[200px] h-fit p-2 bg-white rounded shadow border border-gray-100/50"
          >
            <span
              class="uppercase font-bold text-2xl w-full inline-block w-full text-center"
              >${item.type}</span
            >

            <ul
              class="w-full flex flex-col justify-between items-start [&>*]:p-2 [&>*]:shadow-sm gap-1 [&>*]:w-full"
             
            >
             
                <textarea
                  class="max-h-[150px] min-h-[100px] w-full overflow-y-scroll p-1"
                  placeholder="info"
                  disabled
                >${item.information.text}</textarea>
              </li>
              ${getCookie().level == 1 ? `<li>to section <span class="uppercase font-bold">${item.section}</span></li>` : ``}
              <li>dibuat : <span class="font-bold">${item.creat_at}</span></li>
             ${
               getCookie().level == 1
                 ? ` <li class="flex flex-row gap-2">
                <button onclick="updateInformation(this, ${item.id}, true)"
                  class="flex-1 p-2 rounded cursor-pointer bg-${item.status == `info` ? `blue` : `green`}-200 hover:bg-${item.status == `info` ? `blue` : `green`}-300 transition capitalize"
                >${item.status}</button> ${
                  item.status == `done`
                    ? `<button class="bg-red-200 flex-1 rounded cursor-pointer" onclick="if(confirm('ingin menghapus information'))deleteInformation(${item.id})">hapus</button>`
                    : ` <button class="bg-yellow-200 flex-1 rounded cursor-pointer" onclick="updateInformation(this, ${item.id})">edit</button>`
                }
              </li>`
                 : ``
             }
            </ul>
          </div>
    `;
  });
};

const deleteInformation = async (id) => {
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/information/delete?id=${id}`,
  ).then((item) => item.json());
  if (responses.status == 201) {
    showInformation("content-information", await getInformation());
    alert("hapus informasi " + responses.message);
  }
};

const updateInformation = async (el_this, id, info = false) => {
  if (el_this.textContent == "done") return;
  if (info) {
    const responses = await fetch(
      `${import.meta.env.VITE_URL_SERVER_DEV}/api/information/update?id=${id}&info=${info}`,
    ).then((item) => item.json());
    if (responses.status == 201) {
      showInformation("content-information", await getInformation());
      alert("status info " + responses.message + " di ubah");
    }
  } else {
    addInformation(await getInformation(id));
  }
};

export const addInformation = (data) => {
  document.getElementById("content-information").innerHTML += `
  <div class="absolute top-0 left-0 w-full h-full bg-white/50 flex justify-center items-center">
    <div class="w-[200px] h-fit p-2 bg-white flex flex-col items-center gap-2 rounded shadow [&>*:not(h1):not(div)]:shadow">
      <h1 class="text-2xl capitalize">add information</h1>
      <textarea class="w-full p-1 bg-white max-h-[200px]" placeholder="type something">${data ? `${data[0].information.text}` : ``}</textarea>
      <select class="w-full bg-white p-1">
        <option value="${data ? `${data[0].section}` : ``}" disabled selected>${data ? `${data[0].section}` : `to section`}</option>
        <option value="all">all</option>
        <option value="fo">fo</option>
        <option value="hk">hk</option>
        <option value="ktn">kitchen</option>
        <option value="eng">engenering</option>
      </select>
      
      <select class="w-full bg-white p-1"  ${data ? `value=${data[0].type}` : ``}>
        <option value="${data ? `${data[0].type}` : ``}" disabled selected>${data ? `${data[0].type}` : `type`}</option>
        <option value="laundry">laundry</option>
        <option value="rental">rental</option>
        <option value="larangan">larangan</option>
      </select>
      <div class="w-full bg-red flex flex-row gap-2 my-2">
        <button class="flex-1 bg-blue-200 p-2 rounded cursor-pointer" onclick="cekValidation(this${data ? `, ${data[0].id}` : ``}${data ? `, ${data[0].creat_at}` : ``})">${data ? `update` : `send`}</button>
      <button class="flex-1 bg-red-200 p-2 rounded cursor-pointer" onclick="this.parentElement.parentElement.parentElement.remove()">batal</button>
      </div>
    </div>
  </div>
  `;
};

const filterInformation = async (el_this, section) => {
  activeListHilight(
    document.getElementById("ul-information"),
    el_this,
    "bg-green-200",
    "ul-information-li-first",
  );

  document.getElementById("content-information").innerHTML =
    `<div class="w-full h-full flex justify-center items-center"><span class="p-2 inline-block bg-gray-100 shadow border-2 rounded capitalize">kosong</span></div> `;
  if (section == "all") {
    showInformation("content-information", await getInformation());
    return;
  }

  [...(await getInformation())]
    .filter((item) => item.section == section)
    .map((item) => {
      showInformation("content-information", [item]);
    });
};

const cekValidation = (el_this, id, creat_at) => {
  const inputs =
    el_this.parentElement.parentElement.querySelectorAll("textarea, select");
  if (inputs[0].value == "") {
    alert("information tidak boleh kosong");
    inputs[0].focus();
  } else if (inputs[1].value == "") {
    alert("section tidak boleh kosong");
    inputs[1].focus();
  } else if (inputs[2].value == "") {
    alert("type tidak boleh kosong");
    inputs[2].focus();
  } else {
    data_form_information.push({
      type: inputs[2].value,
      information: JSON.stringify({ text: inputs[0].value }),
      to_section: inputs[1].value,
      creat_at: !id
        ? `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`
        : creat_at,
    });
  }

  sendInformation(el_this, data_form_information, id);
};

const sendInformation = async (el_this, data, id) => {
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/information${id ? `/update?id=${id}` : ``}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(...data),
    },
  ).then((item) => item.json());

  if (responses.status == 201) {
    showInformation("content-information", await getInformation());
    el_this.parentElement.parentElement.remove();
    data_form_information = [];
    alert(responses.message);
  }
};

const getInformation = async (id) => {
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/information${id ? `?id=${id}` : ``}`,
  ).then((item) => item.json());

  if (responses.status == 200) return responses.data;
};

window.showInformation = showInformation;
window.filterInformation = filterInformation;
window.getInformation = getInformation;
window.addInformation = addInformation;
window.cekValidation = cekValidation;
window.updateInformation = updateInformation;
window.deleteInformation = deleteInformation;
