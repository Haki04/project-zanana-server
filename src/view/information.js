import { activeListHilight } from "../controller/controller";

export const showInformation = async (parent, data) => {
  data = data ?? (await getInformation());
  document.getElementById(parent).innerHTML = "";
  data.map((item) => {
    const waktu_lokal = new Date(item.creat_at).toLocaleString("id-ID", {
      timeZone: "Asia/Makassar",
    });
    document.getElementById(parent).innerHTML += `
     <div
            class="w-[200px] h-fit p-2 bg-white rounded shadow border border-gray-100/50"
          >
            <span
              class="uppercase font-bold text-2xl w-full inline-block w-full text-center"
              >${item.info_name}</span
            >

            <ul
              class="w-full flex flex-col justify-between items-start [&>*]:p-2 [&>*]:shadow-sm gap-1 [&>*]:w-full"
             
            >
              <li>reporter : <span class="uppercase font-bold">${item.info_reporter}</span></li>
              <li>
                <textarea
                  class="max-h-[150px] w-full overflow-y-scroll p-1"
                  placeholder="info"
                  disabled
                >${item.info_data}</textarea>
              </li>
              <li>section <span class="uppercase font-bold">${item.section}</span></li>
              <li>dibuat : <span class="font-bold">${waktu_lokal.split(`,`)[0]}</span></li>
              <li>
                <button
                  class="w-full p-2 rounded cursor-pointer bg-green-200 hover:bg-green-300 transition capitalize"
                >
                  done
                </button>
              </li>
            </ul>
          </div>
    `;
  });
};

const addInformation = () => {};

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

const sendInformation = async (element, data) => {
  const responses = await fetch(
    `${import.meta.env.VITE_SERVER_DEV}/information`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  ).then((item) => item.json());

  if (responses.status == 201) {
    showInformation("content-information", responses.data);
  }
};

const getInformation = async () => {
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/information`,
  ).then((item) => item.json());

  if (responses.status == 200) return responses.data;
};

window.showInformation = showInformation;
window.filterInformation = filterInformation;
window.getInformation = getInformation;
