import {
  animationLoading,
  backPages,
  getCookie,
} from "../controller/controller";

if (!getCookie()) {
  window.location.href = "/pages/login";
}

const content = document.getElementById("content");

const cekValidForm = () => {
  const reporter = content.querySelector("#reporter").value;
  const type = content.querySelector("#type").value;
  const posisi = content.querySelector("#posisi").value;
  const date = content.querySelector("#date").value;
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
        if (date == "") {
          alert("tanggal tidak boleh kosong");
        } else {
          if (description == "") {
            alert("decription tidak boleh kosong");
          } else {
            document
              .getElementById("form-report")
              .querySelectorAll("input, textarea, select")
              .forEach((element) => (element.value = ""));
            return {
              reporter: reporter,
              type: type,
              posisi: posisi,
              date: date,
              description: description,
            };
          }
        }
      }
    }
  }
};

const sendReport = async () => {
  const data = cekValidForm();
  const response = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
};

const showFormReport = () => {
  content.innerHTML = `
  <div
  class="w-[300px] bg-gray-300/50 shadow-md p-2 rounded flex flex-col justify-start items-center [&>*]:w-full [&>*]:bg-white [&>*]:p-2 [&>*]:rounded gap-1" id="form-report"
  >
  <h1 class="font-bold text-2xl text-center">Report Kerusakan</h1>
  <input
  type="text"
  name=""
  value=""
  id="reporter"
  placeholder="Reporter"
  />
  <select name="" id="type">
  <option value="">type</option>
  <option value="ac">ac</option>
  </select>
  <input type="text" name="" id="posisi" value="" placeholder="posisi" />
  <input type="date" name="" id="date" />
  <textarea name="" id="description" placeholder="decsription"></textarea>
  <button class="font-bold cursor-pointer my-3" onclick="sendReport()">
  Kirim
  </button>
  </div>
  
  `;
};

if (!getCookie().level == 1) {
  backPages();
  animationLoading("content");
}
showFormReport();

window.sendReport = sendReport;
