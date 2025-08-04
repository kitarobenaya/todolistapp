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
const darkButton = document.querySelector(".dark-button");

// Function to toggle dark mode
darkButton.addEventListener("click", function () {
  this.classList.toggle("night");
  if (this.classList.contains("night")) {
    this.classList.remove("light");
    this.setAttribute("aria-label", "ubah tema ke terang");
    document.body.classList.add("dark");
  } else {
    this.classList.remove("night");
    this.classList.add("light");
    this.setAttribute("aria-label", "ubah tema ke gelap");
    document.body.classList.remove("dark");
  }
  localStore();
  updateWarning();
});

// Function to update warning message and clear all button state
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

// Function to show input and glass
function showInputAndGlass() {
  input.classList.add("showInput");
  input.style.zIndex = "2";
  glass.classList.add("showGlass");
  glass.style.zIndex = "1";
  closeInput.style.display = "block";
  updateWarning();
}

// Show input and glass when add button is clicked
add.addEventListener("click", function () {
  showInputAndGlass();
});

// Function to close input and glass
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

// input close button
closeInput.addEventListener("click", function () {
  closeFunc();
  updateWarning();
});

// Insert function to add new activity
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
        <p class='pKegiatan'>${kegiatan.value}</p>
        <input type='text' class='editinp' value='${kegiatan.value}' hidden>
        <div class="wrap">
        <p class='pJam'>${jamkegiatan.value}</p>
        <input type='text' class='editinp' value='${jamkegiatan.value}' hidden>
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

// localStore function to save data to localStorage
function localStore() {
  const cards = document.querySelectorAll(".card");
  const buttonNight = document.querySelector(".dark-button");
  const data = [];
  const dataBack = buttonNight.classList.contains("night") ? "dark" : "light";
  cards.forEach((card) => {
    data.push({
      kegiatan: card.querySelector("p").textContent,
      jam: card.querySelector(".wrap p").textContent,
      checkbox: card.querySelector('input[type="checkbox"]').checked,
      label: card.getAttribute("aria-label"),
    });
  });
  localStorage.setItem("theme", JSON.stringify(dataBack));
  localStorage.setItem("kegiatan", JSON.stringify(data));
}

// loadLocalStore function to load data from localStorage
function loadLocalStore() {
  const data = JSON.parse(localStorage.getItem("kegiatan") || "[]");
  const theme = JSON.parse(localStorage.getItem("theme"));

  if (theme === "dark") {
    darkButton.classList.add("night");
    darkButton.classList.remove("light");
    document.body.classList.add("dark");
  } else {
    darkButton.classList.remove("night");
    darkButton.classList.add("light");
    document.body.classList.remove("dark");
  }

  list.innerHTML = "";
  data.forEach((item) => {
    const HTMLstring = `
        <div class="card" aria-label="${item.label}">
          <p class='pKegiatan'>${item.kegiatan}</p>
        <input type='text' class='edit editkegiatan' value='${item.kegiatan}' hidden>
          <div class="wrap">
            <p class='pJam'>${item.jam}</p>
        <input type='text' class='edit editjam' value='${item.jam}' hidden>
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

// drag and drop function
const sortable = new Sortable(list, {
  animation: 150,
  ghostClass: "ghost",
  onEnd: function () {
    localStore();
  },
});

// checkbox function
list.addEventListener("change", function (e) {
  if (e.target.classList.contains("checkbox")) {
    localStore();
  }
});

// edit function
list.addEventListener("click", function (e) {
  if (e.target.classList.contains("pKegiatan")) {
    const card = e.target.closest(".card");
    const kegiatanInput = card.querySelector(".editkegiatan");
    if (kegiatanInput.hidden) {
      kegiatanInput.hidden = false;
      e.target.hidden = true;
      kegiatanInput.focus();
    }
    kegiatanInput.addEventListener("blur", function () {
      kegiatanInput.hidden = true;
      e.target.hidden = false;
      e.target.textContent = kegiatanInput.value;
      card.setAttribute(
        "aria-label",
        `kegiatan ${kegiatanInput.value} pada jam ${
          card.querySelector(".editjam").value
        }`
      );
      localStore();
      updateWarning();
    });
  }

  if (e.target.classList.contains("pJam")) {
    const card = e.target.closest(".card");
    const jamInput = card.querySelector(".editjam");
    if (jamInput.hidden) {
      jamInput.hidden = false;
      e.target.hidden = true;
      jamInput.focus();
    }
    jamInput.addEventListener("blur", function () {
      jamInput.hidden = true;
      e.target.hidden = false;
      e.target.textContent = jamInput.value;
      card.setAttribute(
        "aria-label",
        `kegiatan ${card.querySelector(".editkegiatan").value} pada jam ${jamInput.value}`
      );
      localStore();
      updateWarning();
    });
  }
});

// remove function
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

// clear all function
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
