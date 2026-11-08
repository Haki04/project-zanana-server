import {
  animationLoading,
  backPages,
  getCookie,
  plusMinus,
  toggleFormEdit,
  activeListHilight,
} from "../controller/controller";

if (getCookie().level != 1) {
  //animationLoading("content", "before");
}

const greatingUser = async () => {
  document.getElementById("greating-user").textContent =
    `Welcome ${getCookie().name} > ${getCookie().position}`;

  // fillter
  document.getElementById("greating-user").parentElement.insertAdjacentHTML(
    "beforeend",
    `
      
      <div class="w-full absolute top-full left-0 h-fit ">
        <select class="w-full md:w-fit outline-0 md:bg-gray-200/50 cursor-pointer" onchange="fillterStocks(this.value)" id='list-item-filter-stocks'>
        <option class="p-1" value="all" selected>all</option>
        </select>
      </div>
      `,
  );

  loopingListFillter(
    await fetch(
      `${import.meta.env.VITE_URL_SERVER_DEV}/inventory?section=${getCookie().position}`,
    ).then((res) => res.json()),
  );
};

const loopingListFillter = ({ data }) => {
  data[0].section_data.item_list_jenis.map(
    (item) =>
      (document.getElementById("list-item-filter-stocks").innerHTML +=
        `<option class="p-1" value='${item}'>${item}</option>`),
  );
};

export const showBoxStocks = async (section, el_this, filter_keyword) => {
  if (!getCookie()) {
    return (window.location.href = "/pages/login");
  }
  if (!section) return;
  activeListHilight(
    document.getElementById("ul-stocks-dashboard"),
    el_this,
    "bg-white",
  );
  const data = await getDataStocks(section, filter_keyword);

  let content_stocks = document.getElementById("content");
  window.data_edit_form = data;
  content_stocks.innerHTML = "";
  if (getCookie().level == 1) {
    content_stocks.innerHTML += `
    <div class=" w-full h-full grid md:grid-cols-3 lg:grid-cols-4 justify-items-center content-start gap-2 overflow-y-scroll" id="content-stocks-dashboard"></div>
    `;
    if (data.length == 0)
      document.getElementById("content-stocks-dashboard").innerHTML +=
        `<div class="absolute flex justify-center items-center w-full h-full bg-white/50"><span class="text-2xl bg-white text-center rounded shadow block p-2 w-1/2">kosong</span></div>`;
    content_stocks = content_stocks.querySelector("#content-stocks-dashboard");
  }
  data.map((item) => {
    content_stocks.innerHTML += `
       <div
            class="w-[150px] h-[100px] bg-gray-100 border-2 rounded overflow-hidden relative shadow pt-1 hover:scale-110 hover:z-[1] hover:shadow transition cursor-pointer"
          >
          <span onclick="showMoreDetailStocks(${item.id}, '${section}')" class="absolute left-0 ml-1 top-0 w-[20px]"><img class="w-full" src="/icon/info.png"  /></span>
            <span
              class="absolute top-0 right-2 cursor-pointer"
              onclick="toggleFormEdit(${item.id}, '${getCookie().level != 1 ? `body` : `#content`}', '${section}', '${el_this}')"
              >edit</span
            >
            <div class="w-full bg-white h-[70%] flex justify-end items-center flex-col">
              <h1 class="text-2xl font-bold truncate">${item.name}</h1>
             <span class="text-[14px] ">${item.type}</span>
            </div>
            <div class="w-full flex justify-center items-center">
              <span class=""
                >total : <span class="font-bold">${item.total} ${item.satuan}</span></span
              >
            </div>
          </div>
         `;
  });
};

const showMoreDetailStocks = async (id_optional, section) => {
  const data = await getDataStocks(section, "", id_optional);
  console.log(data[0]);
  document.getElementById(
    getCookie().level == 1 ? `content-stocks-dashboard` : `content`,
  ).innerHTML += `
    <div class="absolute top-0 w-full h-full bg-white/50 justify-center items-center flex">
      <div class="w-[300px] bg-white shadow h-fit flex flex-col p-2 gap-2">
        <h1 class="flex-1 text-2xl bg-gray-100 capitalize p-2">detail</h1>
        ${Object.entries(data[0])
          .filter(([keys]) => keys != `id`)
          .map(
            ([keys, item]) => `
          ${keys != `coment` ? `<span class="flex-1 shadow bg-white p-2">${keys} : <span class="font-bold">${item}</span></span>` : `<textarea class="max-h-[200px] p-1 shadow bg-gray-50 inline-block">${!item ? `-` : item}</textarea>`}`,
          )
          .join("")}
          <button class="flex-1 w-1/2 bg-yellow-100 capitalize p-2 rounded hover:bg-yellow-200 cursor-pointer transition" onclick="this.parentElement.parentElement.remove()">close</button>
      </div>
    </div>
    `;
};

const fillterStocks = async (kategory) => {
  showBoxStocks(getCookie().position, "", kategory);
};

const getDataStocks = async (section, filter_keyword, id_optional) => {
  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/stocks?section=${section}&filter=${filter_keyword}${id_optional ? `&id_stocks=${id_optional}` : ""}`,
  ).then((res) => res.json());

  return data;
};

const sendUpdateStocks = async (form_data, section, el_this) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL_SERVER_DEV}/stocks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form_data),
      },
    ).then((res) => res.json());

    if (response.status == 201) {
      alert(response.message);
      toggleFormEdit();
      if (getCookie().level == 1) showBoxStocks(section, el_this);
      showBoxStocks(getCookie().position);
    } else {
      alert("Update gagal !");
    }
  } catch (error) {
    console.log(error);
  }
};

window.showBoxStocks = showBoxStocks;
window.toggleFormEdit = toggleFormEdit;
window.plusMinus = plusMinus;
window.sendUpdateStocks = sendUpdateStocks;
window.getCookie = getCookie;
window.greatingUser = greatingUser;
window.fillterStocks = fillterStocks;
window.showMoreDetailStocks = showMoreDetailStocks;
