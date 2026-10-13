import {
  animationLoading,
  backPages,
  getCookie,
} from "../controller/controller";
import { showItemBrokeness } from "./kerusakan";

if (!getCookie()) {
  window.location.href = "/pages/login";
}

const cekValidForm = (content) => {
  const reporter = content.querySelector("#reporter").value;
  const type = content.querySelector("#type-report").value;
  const posisi = content.querySelector("#posisi").value;
  const description = content.querySelector("#description").value;

  if (reporter == "") {
    alert("reporter tidak boleh kosong");
  } else {
    if (type == "") {
      alert("type tidak boleh kosong");
    } else {
      if (posisi == "") {
        alert("posisi tidak boleh kosong");
      } else {
        if (description == "") {
          alert("decription tidak boleh kosong");
        } else {
          document
            .getElementById("form-report")
            .querySelectorAll("input, textarea, select")
            .forEach((element) => (element.value = ""));

          content.remove();
          return {
            reporter: reporter,
            type: type,
            posisi: posisi,
            date: `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`,
            description: description,
          };
        }
      }
    }
  }
};

const sendReport = async (content) => {
  const data = cekValidForm(content);
  const { status, message } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  ).then((res) => res.json());

  if (status == 200) {
    alert(message);
    showItemBrokeness("kerusakan-item-list");
  } else {
    alert(message);
  }
};

export const showFormReport = (content) => {
  if (getCookie().level == 1) {
    document.getElementById(content).insertAdjacentHTML(
      "afterbegin",
      `
      <div class="w-full absolute top-0 left-0 h-full bg-white/50 flex justify-center items-center" id="form-show-edit-kerusakan"></div>
      `,
      (content = "form-show-edit-kerusakan"),
    );
  }
  document.getElementById(content).innerHTML += `
  <div
    class="w-[300px] bg-gray-300/50 shadow-md p-2 rounded flex flex-col justify-start items-center [&>*]:w-full [&>*]:bg-white [&>*]:p-2 [&>*]:rounded gap-1" id="form-report"
    >
      <h1 class="font-bold text-2xl text-center">Report Kerusakan</h1>
      <input type="text" name="" value="${getCookie().name}" id="reporter" disabled />
      <select name="" id="type-report">
        <option disabled selected>type</option>
      </select>
      <input type="text" name="" id="posisi" value="" placeholder="posisi" />
      <textarea name="" id="description" placeholder="decsription"></textarea>
      <button class="font-bold cursor-pointer my-3" onclick="sendReport(document.getElementById('${content}'))">
      Kirim
      </button>
  </div>
  
  `;
  renderSelectItems(["ac", "electrical", "leak", "sound-loud", "wall", "air"]);
};

const renderSelectItems = (items) => {
  items.map(
    (item) =>
      (document.getElementById("type-report").innerHTML +=
        `<option value="${item}">${item}</option>`),
  );
};

if (!getCookie().level == 1) {
  backPages();
  animationLoading("content");
}

window.sendReport = sendReport;
window.showFormReport = showFormReport;
