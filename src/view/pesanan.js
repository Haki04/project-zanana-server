import {
  animationLoading,
  animationSpin,
  backPages,
  getCookie,
} from "../controller/controller";

if (!getCookie()) window.location.href = "/pages/login";
let count = 0;

export const showOrdersItem = async (element) => {
  try {
    if (!element) {
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_URL_SERVER_DEV}/users/orders`,
    );
    const data = await response.json();
    element.innerHTML = "";
    data.data.map((item) => {
      let sign_orders = "bg-gray-300";
      let sign_progres;
      switch (item.order_status) {
        case "order":
          sign_progres = "proses";
          break;
        case "in proses":
          sign_orders = "bg-yellow-300/50";
          sign_progres = "selesai ?";
          break;
        default:
          sign_orders = "bg-green-300/50";
          sign_progres = "selesai";
      }
      element.innerHTML += `
 <div class="bg-white w-[300px] h-[150px] md:w-[150px] md:h-[200px] rounded flex flex-row md:flex-col overflow-hidden shadow-sm">
          <div class="${sign_orders} w-full flex justify-center items-center h-full md:h-[40%] relative">
          <span class="absolute top-0 right-0 p-1 cursor-pointer" onclick="showMoresComentDetail(${item.uu_id})"><img class="w-[20px]" src="/icon/info.png" /></span>
          <h1 class="font-bold text-6xl md:text-5xl">${item.order_room}</h1>
          </div>
          <div class=" w-full h-full md:h-[60%]">
            <ul class="flex flex-col items-center bg-white p-1 h-full overflow-y-scroll">
            <span class="sticky top-0 ${item.order_type == `order` && sign_progres != `selesai` ? `bg-red-300/50` : `bg-white/20`} text-center w-[50%] font-bold w-full md:w-full">${item.place_to_eat} | ${item.order_type}</span>
              
            ${item.order_items
              .map((d) => `<li class="w-full">${d.name} ${d.total}x</li>`)
              .join(``)}
              <li class="grid grid-cols-1 mt-1 justify-items-center place-items-end h-fit w-full gap-2">
               ${item.order_status == `order` || item.order_status == `in proses` ? ` <span class="bg-yellow-200 text-[14px] text-center p-1 rounded">${item.order_status}</span>` : ``}
                <button id="btn-pesanan" data-action="${item.order_status}" class="${sign_orders} w-[90%] md:w-[70%] relative overflow-hidden cursor-pointer text-[14px] p-2 rounded" onclick="sendUpdatePesanan(${item.uu_id},'${sign_progres}', this); animationSpin(this, '${sign_progres}')">${sign_progres} ${sign_progres == `selesai` ? `😁` : ``}</button>
              </li>
            </ul>
          </div>
        </div>
`;
    });
    if (getCookie().level != 1) {
      // if (count == 0) animationLoading("pesanan");
      count++;
      backPages();
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendUpdatePesanan = async (id, progres, el) => {
  if (progres == "selesai") return;
  let status_new = "";

  switch (el.getAttribute("data-action")) {
    case "order":
      status_new = "in proses";
      break;
    default:
      status_new = "selesai";
      break;
  }

  const results = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/users/orders/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uu_id: id,
        status: status_new,
      }),
    },
  ).then((res) => res.json());

  if (results.status == 201) {
    showOrdersItem(document.getElementById("pesanan"));
  } else {
    alert(results.message);
  }
};

const copyClipboard = async (el_this) => {
  try {
    await navigator.clipboard.writeText(
      el_this.querySelector("span").textContent,
    );
    el_this.querySelector("#visit-link-tamu").classList.remove("hidden");
    alert("berhasil di salin");
  } catch (error) {}
};

const showMoresComentDetail = async (uu_id) => {
  if (!uu_id) return;
  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/users/orders?uu_id=${uu_id}`,
  ).then((res) => res.json());
  document.querySelector("#pesanan").innerHTML += `
  <div
          class="w-full h-full ${getCookie().level != 1 ? `fixed` : `absolute top-0 left-0`} bg-white/50 flex justify-center items-center"
        id="box-detail-pesanan">
          <div
            class="w-[70%] md:w-[300px] bg-white flex flex-col justify-around shadow rounded p-4"
          >
            <h1 class="text-2xl capitalize border-b-2 py-2">detail</h1>
            <div class="w-full flex flex-col">
              <span class="p-1 border-b"
                >room :
                <span class="inline-block w-fit font-bold rounded text-center"
                  >${data[0].order_room}</span
                ></span
              >
              <span class="p-1 border-b relative" >code : <span class="font-bold">${data[0].order_code}</span><span class="absolute right-0 top-0 cursor-pointer w-fit h-full flex justify-center items-center gap-2" ><img onclick="copyClipboard(this.parentElement.parentElement)" class="w-4" src="/icon/copy.png"/><img id="visit-link-tamu" onclick="window.location.href='/pages/tamu/'" class="w-4 hidden" src="/icon/link.png"/></span></span>
              <span class="p-1 border-b"
                >type : <span class="font-bold capitalize">${data[0].order_type}</span></span
              >
              <span class="px-1 pt-1">items :</span>
              <ul class="p-1 min-h-[50px] max-h-[100px] flex flex-col gap-1 border-b">
                ${data[0].order_items.map((item) => `<li class="bg-gray-100 py-1 pl-2">${item.name}<span> ${item.total}x</span></li>`).join("")}
              </ul>
              <span class="p-1 mt-1 border-b"
                >coment :
                <textarea class="max-h-[150px] pl-1 px-0.5 w-full text-red-500" disabled>${data[0].coment}</textarea>
              </span>
              <span class="p-1 border-b"
                >status :
                <span
                  class="bg-amber-200 p-1 px-2 inline-block text-center rounded"
                  >proses</span
                ></span
              >
              <button
                class="bg-red-100 hover:bg-red-200 mt-9 mb-3 p-2 w-[100px] rounded cursor-pointer" onclick="this.parentElement.parentElement.parentElement.remove()"
              >
                close
              </button>
            </div>
          </div>
        </div>
  
  `;
};

window.sendUpdatePesanan = sendUpdatePesanan;
window.animationLoading = animationLoading;
window.animationSpin = animationSpin;
window.showOrdersItem = showOrdersItem;
window.copyClipboard = copyClipboard;
window.showMoresComentDetail = showMoresComentDetail;
