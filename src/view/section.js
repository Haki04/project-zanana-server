import { animationLoading, getCookie } from "../controller/controller";

if (!getCookie()) {
  window.location.href = "/pages/login";
}

const greating = (name) => {
  document.getElementById("greating").innerHTML =
    `<span>Welcome <span class="font-bold">${name.toUpperCase()}</span> > ${getCookie().position}</span>`;
};

const showUserSection = (element) => {
  animationLoading("content-user");
  const section_list = [
    ["profile", "user_2.png"],
    ["report", "report.png"],
    ["information", "information.png"],
    ["inventory", "track.png"],
    ["pesanan", "order.png"],
    ["input-pesanan", "purchase_order.png"],
    ["stocks", "product.png"],
    ["broken", "mechanic.png"],
    ["purchases", "purchasing.png"],
  ];
  section_list.map((item) => {
    element.innerHTML += `
     <div
          class="w-[80%] md:w-[250px] md:h-[150px] shrink-0 h-[80px] bg-gray-100/50 rounded flex justify-center items-center cursor-pointer hover:scale-110  transition gap-2 md:gap-4"
          onclick="clickPages(this)"
        >
          <img src="/icon/${item[1]}" alt="" class="w-[60px] md:w-[80px]" />
          <h1 class="text-[20px] select-none">${item[0]}</h1>
        </div>
`;
  });
};

window.clickPages = (args) => {
  const arg = args.querySelector("h1").textContent;
  if (arg == "profile") {
    return (window.location.href = "/pages/users/profile");
  } else if (arg == "pesanan") {
    return (window.location.href = "/pages/users/pesanan");
  } else if (arg == "report") {
    return (window.location.href = "/pages/report/");
  } else if (arg == "input-pesanan") {
    return (window.location.href = "/pages/users/input-pesanan");
  } else if (arg == "stocks") {
    return (window.location.href = "/pages/users/stocks");
  } else if (arg == "inventory") {
    return (window.location.href = "/pages/inventory/");
  } else if (arg == "information") {
    return (window.location.href = "/pages/users/information");
  } else if (arg == "purchases") {
    return (window.location.href = "/pages/users/purchase");
  } else {
    return (window.location.href = "/pages/users/kerusakan");
  }
};

greating(getCookie().name);
showUserSection(document.getElementById("content-user"));
