export const showStaffBoxs = async (element) => {
  if (!getCookie()) {
    return (window.location.href = "/pages/login.html");
  }
  const data = await getStaff();
  document.getElementById(element).innerHTML = "";
  document.getElementById(element).innerHTML += `
    <div class="absolute z-10 right-1 bg-transparent p-2">
              <button class="p-1 bg-blue-200 px-3 rounded cursor-pointer hover:bg-blue-300 transition" onclick="addEditStaff('${element}')">addStaff</button>
            </div>
  `;
  data.map((item) => {
    let bg_status_color;
    switch (item.user_status) {
      case "new":
        bg_status_color = "bg-yellow-100";
        break;
      case "offline":
        bg_status_color = "bg-gray-100";
        break;
      case "online":
        bg_status_color = "bg-green-100";
        break;
    }
    document.getElementById(element).innerHTML += `
             <div
              class="w-[150px] shrink-0 h-fit bg-white rounded-b-2xl rounded-t flex flex-col justify-start items-center p-1 shadow border-2 border-gray-400 relative"
            >
            <span class="absolute w-[10px] h-fit left-1 top-1 cursor-pointer" onclick="addEditStaff('${element}', ${item.user_id})">
              <img src="/icon/pencil.png" class="w-full"/>
            </span>
            
              <div
                class="border p-1 w-[80px] h-[80px] rounded overflow-hidden flex"
              >
                <img class="w-full" src="/icon/user.png"/>
              </div>
              <span class="mt-3 font-bold">${item.user_name}</span>
              <span class="block">As : <span class="font-bold">${item.position.toUpperCase()}</span></span>
              <span>Status : <span class="font-bold ${bg_status_color} px-3 rounded inline-flex justify-center items-center">${item.user_status}</span></span>
              
            </div>
    `;
  });
};

const getStaff = async (id) => {
  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/staffs${id ? `?id=${id}` : ``}`,
  ).then((res) => res.json());
  return data;
};

export const addEditStaff = async (parent, id) => {
  let data_edit_staf_form;
  let data_user_position;
  if (id) {
    data_edit_staf_form = await getStaff(id);
    switch (data_edit_staf_form[0].position) {
      case "hk":
        data_user_position = "Housekeeping";
        break;
      case "fo":
        data_user_position = "Front Office";
        break;
      case "ktn":
        data_user_position = "Kitchen";
        break;
      case "eng":
        data_user_position = "Enginnering";
        break;
    }
  }
  document.getElementById(parent).innerHTML += `  
  <div class="bg-white/50 h-full w-full absolute z-10 top-0  flex justify-center items-center">
    <div class="w-[300px] h-fit bg-white p-2 flex flex-col items-center gap-2 rounded" id="form-new-staff">
        <h1 class="text-2xl capitalize">${!id ? `add  a new` : `update`} staff</h1>
        <input type="text" placeholder="name new staff" class="w-[80%] p-2 shadow rounded bg-white" ${!id ? `oninput="passwordDefaultGeneret(this)" value=""` : `value="${data_edit_staf_form[0].user_name}"`}/>
        
        <input type="text" class="w-[80%] ${!id ? `bg-gray-100` : ``} p-2 shadow rounded truncate"  ${!id ? `disabled value=""` : `value="${data_edit_staf_form[0].user_password}"`} placeholder="default password" />
        
        <select class="w-[80%] bg-white p-2 shadow cursor-pointer">
          ${!id ? `` : `<option  value="${data_edit_staf_form[0].position}"  selected disabled>${data_user_position}</option>`}
          <option value="" disabled ${!id ? `selected` : ``}>As</option>
          <option  value="hk">Housekeeping</option>
          <option value="fo">Front Office</option>
          <option value="ktn">Kitchen</option>
          <option value="eng">Enginnering</option>
        </select>
        
        <select class="w-[80%] bg-white p-2 shadow cursor-pointer">
          ${!id ? `` : `<option value="${data_edit_staf_form[0].user_status}"  selected disabled>${data_edit_staf_form[0].user_status}</option>`}
          <option value="" disabled ${!id ? `selected` : ``}>Status</option>
          <option value="new">new</option>
          <option value="off">offline</option>
          <option value="on">online</option>
        </select>

       <div class="flex justify-center items-center w-[80%] gap-2">
         <button class="p-2 px-3 my-3 flex-1 shadow rounded bg-green-200 cursor-pointer" ${!id ? `onclick="validationDataNewStaff()"` : `onclick="validationDataNewStaff(true, ${data_edit_staf_form[0].user_id})"`}>${!id ? `add` : `update`}</button>
          <button class="p-2 px-3 my-3 flex-1 shadow rounded bg-yellow-200 cursor-pointer" onclick="this.parentElement.parentElement.parentElement.remove()">cancel</button>
       </div>

       ${
         !id
           ? ``
           : `<div class="w-full flex justify-center items-center text-gray-300 cursor-pointer" id="more-action" onclick="deleteButton(${data_edit_staf_form[0].user_id})">more</div>
`
       }
    </div>
  </div>
  `;
};

const deleteButton = (id) => {
  document.getElementById("more-action").innerHTML =
    `<button class="p-2 w-1/2 rounded cursor-pointer bg-red-200 text-black" onclick="deleteStaff(${id})">delete</button>`;
};

const deleteStaff = async (id) => {
  alert("berhasil di bapus " + id);
};

const passwordDefaultGeneret = (el_this) => {
  if (el_this.value == "")
    return (el_this.parentElement.querySelectorAll("input")[1].value = "");
  el_this.parentElement.querySelectorAll("input")[1].value =
    `${el_this.value}${new Date().getSeconds()}${new Date().getMilliseconds()}`;
};

const validationDataNewStaff = (update = false, id) => {
  const form = document.getElementById("form-new-staff");
  const data_new_staff = [];
  if (form.querySelectorAll("input")[0].value == "")
    return alert("nama staff tidak boleh kosong");
  if (form.querySelectorAll("select")[0].value == "")
    return alert("dapartment staff tidak boleh kosong");
  if (form.querySelectorAll("select")[1].value == "")
    return alert("status staff tidak boleh kosong");

  data_new_staff.push({
    name: form.querySelectorAll("input")[0].value,
    password: form.querySelectorAll("input")[1].value,
    as: form.querySelectorAll("select")[0].value,
    status: form.querySelectorAll("select")[1].value,
  });

  update ? sendNewStaff(data_new_staff, id) : sendNewStaff(data_new_staff);
};

const sendNewStaff = async (data, id) => {
  const responses = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/api/staff/${!id ? `add` : `update?id=${id}`}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(...data),
    },
  ).then((item) => item.json());

  if (responses.status == 409) return alert(responses.message);
  if (responses.status == 200 || responses.status == 201) {
    showStaffBoxs("staff");
    alert(responses.message + " staff");
  } else {
    alert(responses.message + " staff");
  }
};

window.addEditStaff = addEditStaff;
window.validationDataNewStaff = validationDataNewStaff;
window.passwordDefaultGeneret = passwordDefaultGeneret;
window.deleteButton = deleteButton;
window.deleteStaff = deleteStaff;
