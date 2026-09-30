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
          <div class="${sign_orders} w-full flex justify-center items-center h-full md:h-[40%]">
          <h1 class="font-bold text-6xl md:text-5xl">${item.order_room}</h1>
          </div>
          <div class=" w-full h-full md:h-[60%]">
            <ul class="flex flex-col items-center bg-white p-1 h-full overflow-y-scroll">
            <span class="sticky top-0 bg-white/70 text-center w-[50%] font-bold w-full md:w-fit">${item.place_to_eat}</span>
              
            ${item.order_items
              .map((d) => `<li class="w-full">${d.name} ${d.total}x</li>`)
              .join(``)}
              <li class="grid grid-cols-1 gap-1 mt-1 justify-items-center place-items-end h-full w-full">
               ${item.order_status == `order` || item.order_status == `in proses` ? ` <span class="bg-yellow-200 text-[14px] text-center p-1 rounded">${item.order_status}</span>` : ``}
                <button id="btn-pesanan" data-action="${item.order_status}" class="${sign_orders} w-[90%] md:w-[70%] relative overflow-hidden cursor-pointer text-[14px] p-2 py-2 rounded" onclick="sendUpdate(${item.uu_id},'${sign_progres}', this); animationSpin(this, '${sign_progres}')">${sign_progres} ${sign_progres == `selesai` ? `😁` : ``}</button>
              </li>
            </ul>
          </div>
        </div>
`;
      if (!getCookie().level == 1) {
        if (count == 0) animationLoading("pesanan");
        count++;
        backPages();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendUpdate = async (id, progres, el) => {
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

showOrdersItem(document.getElementById("pesanan"));

window.sendUpdate = sendUpdate;
window.animationLoading = animationLoading;
window.animationSpin = animationSpin;
