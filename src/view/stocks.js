import {
  animationLoading,
  backPages,
  getCookie,
  plusMinus,
  toggleFormEdit,
  activeListHilight,
} from "../controller/controller";

if (!getCookie()) {
  window.location.href = "/pages/login";
}
if (getCookie().level != 1) {
  animationLoading("content", "before");
}

const greatingUser = () => {
  document.getElementById("greating-user").textContent =
    `Welcome ${getCookie().name} > ${getCookie().position}`;
};

export const showBoxStocks = async (section, el_this) => {
  if (!section) return;
  activeListHilight(
    document.getElementById("ul-stocks-dashboard"),
    el_this,
    "bg-white",
  );
  const data = await getDataStocks(section);
  let content_stocks = document.getElementById("content");
  window.data_edit_form = data;
  content_stocks.innerHTML = "";
  if (getCookie().level == 1) {
    content_stocks.innerHTML += `
  <div class=" w-full h-full grid md:grid-cols-3 lg:grid-cols-4 justify-items-center content-start gap-2 overflow-y-scroll" id="content-stocks-dashboard"></div>
  `;
    content_stocks = content_stocks.querySelector("#content-stocks-dashboard");
  }

  data.map((item) => {
    content_stocks.innerHTML += `
       <div
            class="w-[150px] h-[100px] bg-gray-100 border rounded overflow-hidden relative shadow pt-1 hover:scale-110 hover:z-[1] hover:shadow transition cursor-pointer"
          >
            <span
              class="absolute top-0 right-2 cursor-pointer"
              onclick="toggleFormEdit(${item.id}, '${getCookie().level != 1 ? `body` : `#content`}', '${section}', '${el_this}')"
              >edit</span
            >
            <div class="w-full bg-white h-[70%] flex justify-end items-center flex-col">
              <h1 class="text-2xl font-bold">${item.name}</h1>
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

const getDataStocks = async (section) => {
  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/stocks?section=${section}`,
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
