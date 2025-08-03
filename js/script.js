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
const clearAllButton = document.querySelector(".clearall");
let flagClear = false;

function updateWarning() {
  if (list.children.length === 0 || list.innerHTML == "") {
    warning.classList.remove("none");
    warning.setAttribute("aria-hidden", "false");
    flagClear = false;
    clearAllButton.disabled = true;
    clearAllButton.style.opacity = "0.5";
    clearAllButton.style.cursor = "not-allowed";
  } else {
    warning.classList.add("none");
    warning.setAttribute("aria-hidden", "true");
    flagClear = true;
    clearAllButton.disabled = false;
    clearAllButton.style.opacity = "1"; 
    clearAllButton.style.cursor = "pointer";
  }
}

function showInputAndGlass() {
  input.classList.add("showInput");
  input.style.zIndex = "2";
  glass.classList.add("showGlass");
  glass.style.zIndex = "1";
  closeInput.style.display = "block";
  updateWarning();
}

add.addEventListener("click", function () {
  showInputAndGlass();
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
      timer: 3000,
    });
  } else {
    closeFunc();

    setTimeout(() => {
      const HTMLstring = `
        <div class="card showadd" aria-label="kegiatan ${kegiatan.value} pada jam ${jamkegiatan.value}">
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

      container.scrollTo({ top: list.scrollHeight, behavior: "smooth" });

      container.classList.add("warning");
      kegiatan.value = "";
      jamkegiatan.value = "";
      localStore();
      updateWarning();
    }, 600);

    setTimeout(() => {
      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil menambahkan kegiatan",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          showInputAndGlass();
        }
      });
    }, 1450);
  }
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

const sortable = new Sortable(list, {
  animation: 150,
  ghostClass: 'ghost',
  onEnd: function () {
    localStore();
  }
});

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
      timer: 3000,
    });
    e.target.closest(".card").remove();
    localStore();
    updateWarning();
  }
});

clearAllButton.addEventListener("click", function () {
  localStorage.removeItem("kegiatan");
  Swal.fire({
    title: "Berhasil!",
    text: "Berhasil menghapus semua kegiatan!",
    icon: "success",
    timer: 3000,
  });
  list.innerHTML = "";
  updateWarning();
});