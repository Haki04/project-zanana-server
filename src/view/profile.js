import {
  animationLoading,
  backPages,
  getCookie,
  logOutUser,
  makeCookie,
} from "../controller/controller";

// show user
const showProfile = (content, data_user) => {
  if (!getCookie()) {
    return (window.location.href = "/pages/login.html");
  }
  document.getElementById(content).innerHTML = `
    <div
        class="w-[250px] md:w-[300px] p-2 bg-white/85 rounded-2xl shadow-md flex flex-col justify-start items-center flex-wrap gap-5 relative"
      >
      <span class="absolute inline-block w-[20px] right-2 top-2 cursor-pointer" onclick="changePasswordDefault(${data_user.id}, '${content}')">
        <img src="/icon/pencil.png" class="w-full"/>
      </span>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/40/Bahlil_Lahadalia%2C_Menteri_ESDM_%282024%29.jpg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original"
          alt=""
          class="w-[200px] h-[200px] rounded-[50%] m-2 border-2"
        />
        <ul class="w-full px-1 md:px-2">
          <li class="p-2 border-2 mb-1 text-[20px]">
            Nama : <span class="uppercase font-bold">${data_user.name}</span>
          </li>
          <li class="p-2 border-2 mb-1 text-[20px]">
            Staf : <span class="uppercase font-bold">${data_user.position}</span>
          </li>
          <li class="p-2 border-2 mb-1 text-[20px]">
            As : <span class="uppercase font-bold">${data_user.level == 1 ? `Admin` : `Staff`}</span>
          </li>
        </ul>
        <button class="border-2 bg-orange-300 p-1 w-fitt flex items-center gap-2 self-start ml-2 mb-2 cursor-pointer" onclick="logOutUser()">
          <img class="w-[10px] inline" src="/icon/logout.png"/> Log Out
        </button>
      </div>
    `;
};

const changePasswordDefault = async (id, parent) => {
  document.getElementById(parent).innerHTML += `
  <div class="w-full h-full bg-white/80 fixed top-0 left-0 flex justify-center items-center z-10">
    <div class="w-[300px] bg-white h-fit p-2 flex flex-col items-center shadow-md gap-2">
      <h1 class="text-2xl font-bold capitalize w-[80%] bg-white p-3">edit profile</h1>
      <input type="text" class="bg-white w-[80%] p-2 shadow " placeholder="New name" value="">
      <input type="text" class="bg-white w-[80%] p-2 shadow " placeholder="New password"/>
      <div class="w-[80%] flex gap-2">
         <button class="bg-green-100 p-2 w-1/2 my-4 rounded cursor-pointer" onclick="validationProfileUserUpdate(this, ${id})">update</button>
            <button class="bg-red-100 p-2 w-1/2 my-4 rounded cursor-pointer" onclick="this.parentElement.parentElement.parentElement.remove()">cancel</button>
      </div>
    </div>
  </div>
  `;
};

const validationProfileUserUpdate = (el_this, id) => {
  const input = el_this.parentElement.parentElement.querySelectorAll("input");
  if (input[0].value == "") return alert("new name tidak boleh kosong");
  if (input[1].value == "") return alert("new password tidak boleh kosong");
  postUser(
    {
      new_name: input[0].value,
      new_password: input[1].value,
    },
    id,
  );
};

const postUser = async (data, id) => {
  if (!confirm("yakin ingin merubah, anda harus login ulang")) return;
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/users/update?id=${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  ).then((res) => res.json());
  if (responses.status == 201) {
    alert(responses.message);
    logOutUser();
  }
};

// get user
const getUser = async () => {
  const data = getCookie();
  if (!data) return;
  const {
    data: [{ user_id, user_name, position, user_level }],
  } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/users?name=${data.name}`,
  ).then((res) => res.json());
  if (user_name) {
    showProfile("content", {
      name: user_name,
      position: position,
      level: user_level,
      id: user_id,
    });
  } else {
    window.location.href = "/pages/login";
  }
};

if (getCookie().level != 1) {
  animationLoading("content", "before");
  backPages();
}
window.getUser = getUser;
window.logOutUser = logOutUser;
window.changePasswordDefault = changePasswordDefault;
window.validationProfileUserUpdate = validationProfileUserUpdate;
