import {
  animationLoading,
  backPages,
  getCookie,
  plusMinus,
  toggleFormEdit,
} from "../controller/controller";

if (!getCookie()) {
  window.location.href = "/pages/login";
}
if (!getCookie().level == 1) {
  backPages();
  animationLoading("content");
}

const showBoxStocks = (data) => {
  const content_stocks = document.getElementById("content");
  window.data_edit_form = data;
  content_stocks.innerHTML = "";
  data.map((item) => {
    content_stocks.innerHTML += `
     <div
          class="w-[150px] h-[100px] bg-gray-100 border rounded overflow-hidden relative shadow pt-1 hover:scale-120 hover:z-10 hover:shadow transition cursor-pointer"
        >
          <span
            class="absolute top-0 right-2 cursor-pointer"
            onclick="toggleFormEdit(${item.id})"
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

const getDataStocks = async () => {
  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/stocks?section=hk`,
  ).then((res) => res.json());

  return data;
};

const sendUpdate = async (form_data) => {
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
      showBoxStocks(await getDataStocks());
    } else {
      alert("Update gagal !");
    }
  } catch (error) {
    console.log(error);
  }
};

showBoxStocks(await getDataStocks());

window.toggleFormEdit = toggleFormEdit;
window.plusMinus = plusMinus;
window.sendUpdate = sendUpdate;
// window.showFormEdit = showFormEdit;
