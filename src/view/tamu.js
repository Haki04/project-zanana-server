import { animationSpin } from "../controller/controller";

const getOrdersTamu = async () => {
  if (!getCookie()) {
    return (window.location.href = "/pages/login.html");
  }
  const input = document.getElementById("order-code-tamu");
  if (input.value == "") {
    alert("input tidak boleh kosong");
    input.focus();
    return;
  }
  const { data, status } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/order/tamu`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: input.value.toUpperCase() }),
    },
  ).then((res) => res.json());
  if (status == 200) {
    if (data[0].order_status == "selesai") {
      input.value = "just finish";
      return;
    }
    document.getElementById("content-tamu").innerHTML = `
       <div
          class="view-order-tamu w-full h-full overflow-hidden bg-white flex justify-center flex-col items-center gap-2 relative"  id="form-order-tamu-list"
        >
          <h1
            class="w-full h-[20%] bg-white text-2xl flex justify-center items-center"
          >
            Your Orders
          </h1>
          <ul
            class="w-full bg-white h-[60%] flex flex-col [&>*]:p-3 [&>*]:rounded [&>*]:bg-orange-200 [&>*]:w-full p-2 gap-3 overflow-y-scroll [&>*]:flex [&>*]:justify-between"
          id="ul-tamu-list">${data.map((item) =>
            item.order_items
              .map(
                (item) => `<li>
              ${item.name}
              <input type="checkbox" class="w-5 h-5 accent-emerald-200" onclick="cekItemOrderReady(this)" />
            </li>`,
              )
              .join(``),
          )}
            
            
          </ul>
          <button class="w-[50%] bg-yellow-100 p-2 cursor-pointer rounded mb-4 mt-2 hidden" id="btn-complete-tamu" onclick="showFillerFormFirst(document.getElementById('content-tamu'))">
            complete
          </button>
        </div>
    `;
    animationSpin(document.getElementById("form-order-tamu-list"), "");
  } else {
    input.value = "nothing";
  }
};

const showFillerFormFirst = (parent) => {
  parent.innerHTML = `
<img src="" class="w-[100px]" alt="" srcset="" id="img-tamu-form" />
        <input
          type="text"
          name=""
          autocomplete="off"
          id="order-code-tamu"
          class="w-[90%] bg-white p-2 border border-black/50 mb-2 uppercase text-center"
          placeholder="paste your code"
          onfocus="changeImage(0, this)"
          oninput="changeImage(1, this)"
        />
        <button
          class="bg-green-200 rounded hover:scale-105 transition p-2 w-[40%] mb-4 cursor-pointer"
          onclick="getOrdersTamu()"
        >
          view
        </button>
`;
};

const cekItemOrderReady = (el_this) => {
  if (el_this.checked) {
    const form = document.getElementById("form-order-tamu-list");
    const hoursToEat = new Date().getHours();
    let greatingToEat;
    if (hoursToEat < 11) {
      greatingToEat = "breakfast";
    } else if (hoursToEat > 11 || hoursToEat < 17) {
      greatingToEat = "lunch";
    } else {
      greatingToEat = "dinner";
    }

    setTimeout(() => {
      el_this.parentElement.remove();
      if (form.querySelectorAll("ul li").length < 1) {
        form.querySelector("ul").remove();
        form.querySelector("#btn-complete-tamu").classList.remove("hidden");
        form.querySelector("h1").insertAdjacentHTML(
          "afterend",
          `
          <div class="w-fith-fit flex items-center flex-col">
          <img class="w-[100px]" src="https://media.tenor.com/7vvQ47FLKdsAAAAj/dudu-bubu-having-dinner-dudu-food.gif" />
          <span >have a good ${greatingToEat}</span>
          </div>
          
          `,
        );
      }
    }, 500);
  }
};

window.showFillerFormFirst = showFillerFormFirst;
window.cekItemOrderReady = cekItemOrderReady;
window.getOrdersTamu = getOrdersTamu;
