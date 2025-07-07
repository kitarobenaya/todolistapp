const list = document.querySelector(".list");
const container = document.querySelector(".container");
const warning = document.querySelector(".warning-text");
const add = document.querySelector(".add-kegiatan");
const main = document.querySelector("main");

function updateWarning() {
  if (list.children.length === 0) {
    warning.classList.remove("none");
  } else {
    warning.classList.add("none");
  }
}

add.addEventListener("click", function () {
  const input = document.querySelector(".input-section");
  const glass = document.querySelector(".glass-wrap");
  const close = document.querySelector(".img-input-close");
  input.classList.add("showInput");
  input.style.zIndex = "2";
  glass.classList.add("showGlass");
  glass.style.zIndex = "1";
  close.style.display = "block";
  updateWarning();
});

function closeFunc() {
  const glass = document.querySelector(".glass-wrap");
  const input = document.querySelector(".input-section");
  input.classList.remove("showInput");
  input.classList.add("hideInput");
  setTimeout(() => {
    glass.classList.remove("showGlass");
    input.classList.remove("hideInput");
    glass.classList.add("hideGlass");
  }, 500);
  setTimeout(() => {
    glass.classList.remove("hideGlass");
    input.style.zIndex = "-1";
    glass.style.zIndex = "-1";
  }, 800);
}

const closeInput = document.querySelector(".img-input-close");

closeInput.addEventListener("click", function () {
  closeFunc();
  updateWarning();
});

const kegiatan = document.getElementById("kegiatan");
const jamkegiatan = document.getElementById("jamkegiatan");

const insert = document.getElementById("insert");

function localStore() {
  const cards = document.querySelectorAll(".card");
  const data = [];
  cards.forEach((card) => {
    data.push({
      kegiatan: card.querySelector("p").textContent,
      jam: card.querySelector(".wrap p").textContent,
      checkbox: card.querySelector('input[type="checkbox"]').checked,
    });
  });
  localStorage.setItem("kegiatan", JSON.stringify(data));
}

insert.addEventListener("click", function () {
  if (kegiatan.value === "" || jamkegiatan.value === "") {
    Swal.fire({
      title: "Gagal!",
      text: "Kolom input tidak boleh kosong",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Berhasil!",
      text: "Berhasil menambahkan kegiatan",
      icon: "success",
    });
    const HTMLstring = `
        <div class="card">
        <p>${kegiatan.value}</p>
        <div class="wrap">
        <p>${jamkegiatan.value}</p>
        <input type='checkbox' class='checkbox'>
          <button class="remove">
            <img src="img/cross.svg" alt="remove" />
          </button>
        </div>
        </div>
        `;

    list.insertAdjacentHTML("beforeend", HTMLstring);
    container.classList.add("warning");
    kegiatan.value = "";
    jamkegiatan.value = "";
    localStore();
  }
  updateWarning();
});

function loadLocalStore() {
  const data = JSON.parse(localStorage.getItem("kegiatan") || "[]");
  list.innerHTML = "";
  data.forEach((item) => {
    const HTMLstring = `
        <div class="card">
          <p>${item.kegiatan}</p>
          <div class="wrap">
            <p>${item.jam}</p>
        <input type='checkbox' class='checkbox'${
          item.checkbox ? "checked" : ""
        }>
            <button class="remove">
              <img src="img/cross.svg" alt="remove" />
            </button>
          </div>
        </div>
      `;
    list.insertAdjacentHTML("beforeend", HTMLstring);
  });
  updateWarning();
}

loadLocalStore();

list.addEventListener("change", function (e) {
  if (e.target.classList.contains("checkbox")) {
    localStore();
  }
});

list.addEventListener("click", function (e) {
  if (e.target.closest(".remove")) {
    Swal.fire({
      title: "Berhasil!",
      text: "Berhasil menghapus kegiatan",
      icon: "success",
    });
    e.target.closest(".card").remove();
    localStore();
    updateWarning();
  }
});
