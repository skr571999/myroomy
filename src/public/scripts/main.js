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

function showImage(a) {
  console.log(a.files.length)
  let roomImageContainer = document.querySelector(".roomImageContainer")
  roomImageContainer.innerHTML = ""
  let reader = new FileReader()
  for (let i = 0; i < a.files.length; i++) {
    let imgC = document.createElement("img")
    roomImageContainer.append(imgC)
    let roomImage = document.querySelector(
      `.roomImageContainer img:nth-child(${i + 1})`
    )
    console.log(roomImage)
    roomImage.style.maxWidth = "5em"

    reader.onload = e => {
      roomImage.setAttribute("src", e.target.result)
    }

    reader.readAsDataURL(a.files[0])
  }
}
