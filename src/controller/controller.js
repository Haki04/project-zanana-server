export const backPages = () => {
  document.querySelector("body").insertAdjacentHTML(
    "afterbegin",
    `<div class="fixed z-1 top-3 left-2 md:left-5 md:top-5 p-1" id="back-pages">
      <span class="cursor-pointer select-none" onclick="window.location.href='/pages/users/'"><img class="w-[20px]" src="/icon/home.png"></span>
    </div>`,
  );
};

export const makeCookie = (data) => {
  const cookie =
    (document.cookie = `name=${encodeURIComponent(JSON.stringify(data))}; max-age=28800; path=/`);
  return cookie;
};

export const getCookie = () => {
  const cookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("name="));
  // console.log(cookie);
  // return;
  if (cookie) {
    return JSON.parse(
      decodeURIComponent(
        cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("name="))
          ?.split("=")[1],
      ),
    );
  }
};

// barang.js

export const tombol_barang = (e) => {
  if (e == "tambah") {
    console.log(`berhasil ${e}`);
  } else if (e == "kurangi") {
    console.log(`berhasil ${e}`);
  } else if (e == "terjual") {
    console.log(`berhasil ${e}`);
  } else {
    console.log("gagal");
  }
};

// pesanan.js

export const pesanan_selesai = (e) => {
  if (e == "selesai") {
    alert(e);
  }
};

// stocks.js
export const toggleFormEdit = (id, parent, section, el_this) => {
  const toggle = document.getElementById("toggle");
  if (id) {
    if (!toggle.checked) {
      const data = data_edit_form.find((item) => item.id == id);
      document.querySelector(parent).insertAdjacentHTML(
        "afterbegin",
        `
            <div
            class="w-full h-screen ${getCookie().level == 1 ? `absolute` : `fixed`} z-10 bg-w flex bg-white/50 justify-center items-center "
            id="form-edit-stocks"
          >
            <div
              class="w-[200px] h-auto bg-white shadow rounded p-2 flex flex-col justify-start gap-1 items-center [&_input]:focus:outline-0"
              
            >
              <h1 class="text-3xl text-center bg-white w-full">edit</h1>
              <input
                type="text"
                value="${data.name}"
                class="bg-white w-full pl-1 h-[35px] shadow"
                disabled
              />
              <div
                class="flex flex-row justify-around items-center bg-white shadow has-[:focus]:border h-[35px]"
              >
                <input
                  type="text"
                  value="${data.total}"
                  class="bg-white w-full pl-1"
                  id="input-total"
                />
                <span
                  class="w-[30%] flex justify-between [&>*]:cursor-pointer [&>*]:font-bold [&>*]:text-[20px] [&>*]:select-none"
                >
                  <span
                    class="p-1"
                    onclick="
                      plusMinus(
                        Number(1),
                        document.getElementById('input-total').value,
                      )
                    "
                    >+</span
                  >
                  <span
                    class="p-1"
                    onclick="
                      plusMinus(
                        Number(0),
                        document.getElementById('input-total').value,
                      )
                    "
                    >-</span
                  >
                </span>
              </div>
              <div class="flex justify-around gap-2 p-1">
                <button
                  class="bg-green-200 w-[50%] p-2 rounded cursor-pointer hover:shadow"
                  onclick="sendUpdateStocks({id : ${data.id},total : document.getElementById('input-total').value}, '${section}', '${el_this}')"
                >
                  simpan
                </button>
                <button
                  class="bg-orange-200 w-[50%] p-2 rounded cursor-pointer hover:shadow"
                  onclick="toggleFormEdit()"
                >
                  batal
                </button>
              </div>
            </div>
          </div>
        `,
      );
      toggle.checked = true;
    }
  } else {
    document.getElementById("form-edit-stocks").remove();
    toggle.checked = false;
  }
};
export const plusMinus = (arg, total_old) => {
  const form = document.getElementById("form-edit-stocks");
  let total = Number(total_old);
  if (total < 0) {
    return;
  }
  if (arg == 1) {
    total++;
    form.querySelectorAll("input")[1].value = total;
  } else {
    if (total < 1) {
      return;
    }
    total--;
    form.querySelectorAll("input")[1].value = total;
  }
};

export const filterItem = async (select_value) => {
  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/report?args=${select_value}`,
  ).then((res) => res.json());
  return data;
};

// animation
export const animationSpin = (element, progres) => {
  if (!element) return;
  if (progres == "selesai") return;
  element.innerHTML += `
<div class="absolute z-10 w-full h-full flex justify-center items-center bg-white top-0 left-0" id="animate-spin">
<img class="w-[30px] animate-spin" src="/icon/loading.png"/>
</div>
`;
  setTimeout(() => {
    document.querySelector("body").querySelector("#animate-spin")?.remove();
  }, 1000);
};

export const animationLoading = (element, layout = "after") => {
  console.log(element);
  document.querySelector(`#${element}`).insertAdjacentHTML(
    `${layout}begin`,
    `
    <div class="absolute bg-gray-200 z-20 w-full h-screen flex justify-center md:items-center" id="animate-load">
      <span
        class="mt-[30%] md:mt-0 w-fit h-fit flex justify-center items-center flex-col bg-white rounded p-2"
        >
        loading...
      </span>
    </div>
    `,
  );

  setTimeout(() => {
    document.querySelector("body").querySelector("#animate-load")?.remove();
  }, 1000);
};

let count = 0;
export const activeListHilight = (
  parent,
  el,
  bg_hilight = "bg-white",
  pages_where = "dash-board",
) => {
  if (!parent) return;
  if (count == 0 && pages_where == "dash-board") {
    document.getElementById(pages_where).classList.add(bg_hilight);
    count++;
  } else {
    parent
      ?.querySelectorAll("li")
      .forEach((e) => e.classList.remove(bg_hilight));
  }
  el?.classList?.add(bg_hilight);
};

// log out

export const logOutUser = () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; max-age=0; path=/`;
  });

  return (window.location.href = "/pages/login");
};
