import { animationSpin } from "../controller/controller";

const getOrdersTamu = async () => {
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
    document.getElementById("content-tamu").innerHTML = `
       <div
          class="view-order-tamu w-full h-full overflow-hidden bg-white flex justify-center flex-col items-center gap-2 relative"  id="btn-order-tamu"
        >
          <h1
            class="w-full h-[20%] bg-white text-2xl flex justify-center items-center"
          >
            Your Orders
          </h1>
          <ul
            class="w-full bg-white h-[60%] flex flex-col [&>*]:p-3 [&>*]:rounded [&>*]:bg-orange-200 [&>*]:w-full p-2 gap-3 overflow-y-scroll [&>*]:flex [&>*]:justify-between"
          >${data.map((item) =>
            item.order_items.map(
              (item) =>
                `<li>
              ${item.name}
              <input type="checkbox" class="w-5 h-5 accent-emerald-200" />
            </li>`,
            ),
          )}
            
            
          </ul>
          <button class="w-[50%] bg-yellow-100 p-2 cursor-pointer rounded mb-4 mt-2 ">
            complete
          </button>
        </div>
    `;
    animationSpin(document.getElementById("btn-order-tamu"), "");
  } else {
    input.value = "nothing";
  }
};

window.getOrdersTamu = getOrdersTamu;
