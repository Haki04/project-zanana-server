import { animationSpin } from "../controller/controller";
import { makeCookie, getCookie } from "../controller/controller";

window.login = async () => {
  if (getCookie()) {
    return (window.location.href = "/pages/users/profile.html");
  }
  animationSpin(document.getElementById("btn-login"));
  const name = document.getElementById("user-name").value;
  const password = document.getElementById("user-password").value;
  if (name == "") {
    alert("Name tidak boleh kosong");
  } else {
    if (password == "") {
      alert("Password tidak boleh kosong");
    } else {
      const { verify, data } = await fetch(
        `${import.meta.env.VITE_URL_SERVER_DEV}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name, password: password }),
        },
      ).then((res) => res.json());
      if (verify) {
        makeCookie(data);
        if (data.level == 1) {
          window.location.href = "/pages/admin/";
        } else {
          window.location.href = "/pages/users/profile";
        }
      } else {
        alert("username atau password salah");
      }
    }
  }
};

const getAsUser = async (name) => {
  const response = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    },
  ).then((res) => res.json());

  return response;
};

let timer;
window.cekUser = (name) => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    if (name !== "") {
      try {
        const sebagai = document.getElementById("sebagai");
        const { data: [{ position = "-" } = {}] = [] } =
          (await getAsUser(name)) || "-";
        sebagai.innerHTML = "Sebagai : ";
        sebagai.innerHTML += `
            <span class="font-bold bg-gray-100 px-5 rounded uppercase">${position}</span>`;
      } catch (error) {}
    }
  }, 1000);
};
