const snack_room = document.getElementById("snacks");
const data_orders = [];

window.togglePopUp = (data) => {
  const pop_up = document.getElementById("pop-up");
  const room = document.getElementById("room");
  if (data) {
    pop_up.classList.remove("hidden");
    room.value = data;
  } else {
    pop_up.classList.add("hidden");
  }
};

const tampilkanSnack = (section) => {
  fetch(`${import.meta.env.VITE_URL_SERVER_DEV}/api/orders`)
    .then((response) => response.json())
    .then((data) => {
      data_orders.push(...data);
      data_orders.map((item) => console.log(item.order_items));
      return;

      data_orders.forEach((data) => {
        console.log(data);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

window.sendSnackEat = (snacks, room) => {
  if (snacks.value == "") {
    alert("tolong pilih snack apa saja yang dimakan");
  } else {
    document.getElementById("pop-up").classList.add("hidden");
    console.log(`
berhasil
==================
snack : ${snacks.value} dimakan
room  : ${room.value}
      `);
  }
};

tampilkanSnack("fo");
