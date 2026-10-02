export const showStaffBoxs = async (element) => {
  const { data } = await fetch(
    `${import.meta.env.VITE_URL_SERVER_DEV}/staffs`,
  ).then((res) => res.json());
  data.map((item) => {
    document.getElementById(element).innerHTML += `
             <div
              class="w-[150px] h-[150px] bg-white rounded-b-2xl rounded-t flex flex-col justify-start items-center p-1 shadow border-2 border-gray-400"
            >
              <div
                class="bg-gray-400 w-[80px] h-[80px] rounded overflow-hidden flex"
              ></div>
              <span class="mt-3">${item.user_name}</span>
              <span>As : <span class="font-bold ">${item.position.toUpperCase()}</span></span>
              
            </div>
    `;
  });
};
