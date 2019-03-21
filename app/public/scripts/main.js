const navLinks = document.querySelector(".navLinks")
const navIcon = document.querySelector(".navIcon")
const navOperIcon = document.querySelector(".navOperIcon")

navIcon.addEventListener("click", e => {
  if (navLinks.classList.contains("d-none")) {
    navLinks.classList.remove(["d-none"])
    navOperIcon.innerHTML = "clear"
  } else {
    navLinks.classList.add("d-none")
    navOperIcon.innerHTML = "menu"
  }
})
