const list = document.querySelector(".list");
const container = document.querySelector(".container");
const warning = document.querySelector(".warning-text");
const add = document.querySelector(".add-kegiatan");
const main = document.querySelector("main");
const glass = document.querySelector(".glass-wrap");

function updateWarning() {
  if (list.children.length === 0) {
    warning.classList.remove("none");
  } else {
    warning.classList.add("none");
  }
}

add.addEventListener("click", function () {
  const input = document.querySelector(".input-section");
  const close = document.querySelector(".img-input-close");
  input.classList.add("show");
  close.style.display = "block";
  glass.style.display = "flex";
  updateWarning();
});

function closeInput() {
  const close = document.querySelector(".img-input-close");
  close.style.display = "none";
  glass.style.display = "none";
  const input = document.querySelector(".input-section");
  input.classList.remove("show");
}

main.addEventListener("click", function (e) {
  if (e.target.classList.contains("img-input-close")) {
    closeInput();
    updateWarning();
  }
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
    });
  });
  localStorage.setItem("kegiatan", JSON.stringify(data));
}

insert.addEventListener("click", function () {
  if (kegiatan.value === "" || jamkegiatan.value === "") {
    alert("Isi semua form input sebelum submit");
  } else {
    alert("Berhasil menambahkan kegiatan");
    const HTMLstring = `
        <div class="card">
        <p>${kegiatan.value}</p>
        <div class="wrap">
        <p>${jamkegiatan.value}</p>
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
    closeInput();
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

list.addEventListener("click", function (e) {
  if (e.target.closest(".remove")) {
    e.target.closest(".card").remove();
    localStore();
    updateWarning();
  }
});
