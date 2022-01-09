/** @format */

function $(selector) {
  return document.querySelector(selector);
}

$("button.mode-switch").addEventListener("click", () => {
  $("body").classList.toggle("dark");
});

$(".btn-close-right").addEventListener("click", () => {
  $(".right-side").classList.remove("show");
  $(".expand-btn").classList.add("show");
});

$(".expand-btn").addEventListener("click", () => {
  $(".right-side").classList.add("show");
  $(this).classList.remove("show");
});

$("#setting").addEventListener("click", () => {
  $(".modal").classList.remove("notvisible");
});

$(".modal").addEventListener("click", (e) => {
  if (e.target == $(".modal")) {
    $(".modal").classList.add("notvisible");
  }
});
