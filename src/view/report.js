import {
  animationLoading,
  backPages,
  getCookie,
} from "../controller/controller";
import { showItemBrokeness } from "./kerusakan";

const cekValidForm = (content) => {
  const reporter = content.querySelector("#reporter").value;
  const type = content.querySelector("#type-report").value;
  const posisi = content.querySelector("#posisi").value;
  const description = content.querySelector("#description").value;
  const image = content.querySelector("#file-report").files[0];

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

          content.querySelector("#form-report").remove();
          const form_data = new FormData();
          form_data.append("reporter", reporter);
          form_data.append("type", type);
          form_data.append("posisi", posisi);
          form_data.append("image", image);
          form_data.append(
            "date",
            `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`,
          );
          form_data.append("description", description);

          return form_data;
        }
      }
    }
  }
};

const sendReport = async (content) => {
  const form_data = cekValidForm(content);
  const { status, message } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/report`,
    {
      method: "POST",
      body: form_data,
    },
  ).then((res) => res.json());

  if (status == 200) {
    alert(message);
    document.getElementById("form-show-edit-kerusakan").remove();
    getCookie().level == 1
      ? showItemBrokeness("kerusakan-item-list")
      : showFormReport("content");
  } else {
    alert(message);
  }
};

export const showFormReport = (content) => {
  if (!getCookie()) {
    return (window.location.href = "/pages/login.html");
  }
  getCookie().level == 1 ? (content = "content-right") : "";
  document.getElementById(content).insertAdjacentHTML(
    "afterbegin",
    `
    <div class="w-full bg-white/50 top-0 left-0 h-full ${getCookie().level == 1 ? `absolute z-10` : `fixed`} flex justify-center items-center" id="form-show-edit-kerusakan">
       <div
    class="w-[300px] bg-white shadow-md p-2 rounded flex flex-col justify-start items-center [&>*]:w-full [&>*:not(div)]:bg-white [&>*]:p-2 [&>*]:rounded gap-2 [&>*:not(div):not(h1)]:shadow" id="form-report"
    >
      <h1 class="font-bold text-2xl text-center">Report Kerusakan</h1>
      <input type="text" name="" value="${getCookie().name}" id="reporter" disabled />
      <select name="" id="type-report">
        <option disabled selected>type</option>
      </select>
      <input type="text" name="" id="posisi" value="" placeholder="posisi" />
      <input type="file" class="cursor-pointer" id="file-report" onchange="previewImg()" accept="image/*" />
      <div id="preview-report-img" class="bg-gray-100 relative">
      preview..</div>
      <textarea name="" id="description" placeholder="decsription"></textarea>
      <div class=" flex flex-row *:flex-1 gap-2 *:p-2 *:rounded">
      <button class=" cursor-pointer bg-green-100" onclick="sendReport(document.getElementById('${content}'))">
      send
      </button>
     ${
       getCookie().level == 1
         ? ` <button class=" cursor-pointer bg-yellow-100" onclick="document.getElementById('form-show-edit-kerusakan').remove();">
      cancel
      </button>`
         : ``
     }
      </div>
  </div>
    </div>
  
  `,
  );
  renderSelectItems([
    "ac",
    "electrical",
    "leak",
    "sound-loud",
    "wall",
    "water",
  ]);
};

const renderSelectItems = (items) => {
  console.log(document.getElementById("type-report"));
  items.map(
    (item) =>
      (document.getElementById("type-report").innerHTML +=
        `<option value="${item}">${item}</option>`),
  );
};

const previewImg = () => {
  const input_img = document.getElementById("file-report").files[0];
  const preview = document.getElementById("preview-report-img");
  preview.innerHTML = "";
  if (!input_img) return;
  const img = document.createElement("img");
  img.src = URL.createObjectURL(input_img);
  img.style.width = "150px";
  img.style.aspectRatio = "3/4";
  img.style.objectFit = "cover";
  preview.appendChild(img);
  preview.insertAdjacentHTML(
    "afterbegin",
    `
      <button class="absolute right-2 top-2 text-red-300 cursor-pointer text-[14px]" onclick="cancelPreview()">x</button>`,
  );
};

const cancelPreview = () => {
  const input_img = document.getElementById("file-report");
  const preview = document.getElementById("preview-report-img");
  URL.revokeObjectURL(input_img);
  input_img.value = "";
  preview.innerHTML = "preview....";
};

if (!getCookie().level == 1) {
  backPages();
  animationLoading("content");
}

window.sendReport = sendReport;
window.showFormReport = showFormReport;
window.previewImg = previewImg;
window.cancelPreview = cancelPreview;
