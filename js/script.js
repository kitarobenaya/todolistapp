const list = document.querySelector(".list");
const container = document.querySelector(".container");
const warning = document.querySelector(".warning-text");
const add = document.querySelector(".add-kegiatan");
const main = document.querySelector("main");
const input = document.querySelector(".input-section");
const glass = document.querySelector(".glass-wrap");
const closeInput = document.querySelector(".img-input-close");
const kegiatan = document.getElementById("kegiatan");
const jamkegiatan = document.getElementById("jamkegiatan");
const insert = document.getElementById("insert");

function updateWarning() {
  if (list.children.length === 0) {
    warning.classList.remove("none");
    warning.setAttribute("aria-hidden", "false");
  } else {
    warning.classList.add("none");
    warning.setAttribute("aria-hidden", "true");
  }
}

add.addEventListener("click", function () {
  input.classList.add("showInput");
  input.style.zIndex = "2";
  glass.classList.add("showGlass");
  glass.style.zIndex = "1";
  closeInput.style.display = "block";
  updateWarning();
});

function closeFunc() {
  input.classList.remove("showInput");
  input.classList.add("hideInput");
  setTimeout(() => {
    glass.classList.remove("showGlass");
    input.classList.remove("hideInput");
    glass.classList.add("hideGlass");
  }, 300);
  setTimeout(() => {
    glass.classList.remove("hideGlass");
    input.style.zIndex = "-1";
    glass.style.zIndex = "-1";
  }, 600);
}

closeInput.addEventListener("click", function () {
  closeFunc();
  updateWarning();
});

function localStore() {
  const cards = document.querySelectorAll(".card");
  const data = [];
  cards.forEach((card) => {
    data.push({
      kegiatan: card.querySelector("p").textContent,
      jam: card.querySelector(".wrap p").textContent,
      checkbox: card.querySelector('input[type="checkbox"]').checked,
      label: card.getAttribute("aria-label"),
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
        <div class="card" aria-label="kegiatan ${kegiatan.value} pada jam ${jamkegiatan.value}">
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
        <div class="card" aria-label="${item.label}">
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
