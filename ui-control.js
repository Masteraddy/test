function $(selector) {
  return document.querySelector(selector);
}

$("#menu-toggle").addEventListener("click", () => {
  $("#sidebar").classList.toggle("show-menu");
});

$("#dark-toggle").addEventListener("click", () => {
  $("body").classList.toggle("dark");
});

$("#chat-btn").addEventListener("click", () => {
  $("#chat").classList.toggle("hidden");
});

$("#chat-close").addEventListener("click", () => {
  $("#chat").classList.add("hidden");
});

$("#setting").addEventListener("click", (e) => {
  if (e.target == $("#setting")) {
    $("#setting").classList.add("hidden");
  }
});

$("#setting-navbtn").addEventListener("click", () => {
  $("#setting").classList.toggle("hidden");
});

// $("#setting-close").addEventListener("click", () => {
//   $("#setting").classList.add("hidden");
// });

function changeActive(selector, receiver) {
  document.querySelectorAll(".nav-link").forEach((el, key) => {
    el.classList.remove("bg-trigreen");
  });
  document.querySelectorAll(".main-screen").forEach((el, key) => {
    el.classList.add("hidden");
  });
  $(receiver).classList.remove("hidden");
  $(selector).classList.add("bg-trigreen");
}

function showKey() {
  let strKey = $("#streamkey").type;
  if (strKey == "password") {
    $("#streamkey").type = "text";
    return;
  }
  $("#streamkey").type = "password";
}

function copy(selector) {
  var copyText = document.querySelector(selector);
  copyText.select();
  copyText.setSelectionRange(0, 99999);

  navigator.clipboard
    .writeText(copyText.value)
    .then(() => {
      alert("successfully copied");
    })
    .catch(() => {
      alert("something went wrong");
    });
}
