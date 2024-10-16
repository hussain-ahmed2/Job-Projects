const mainContainer = document.querySelector("main");
const bookContainer = document.getElementById("book-container");
const buttonContainer = document.getElementById("btn-container");
const searchByTitle = document.getElementById("search-by-title");
const select = document.getElementById("select");
const dropdown = document.getElementById("drop-down");
const submit = document.getElementById("submit");
const year = document.getElementById("year");
const statusMessage = document.getElementById("message");
const messageContainer = document.getElementById("message-container");
const wishedItemsCount = document.getElementById("wished-items-count");
const searchBtn = document.getElementById("search-btn");
const searchContainer = document.getElementById("search-container");
const hideBtn = document.getElementById("hide-btn");
const emptyList = document.getElementById("empty");

hideBtn.addEventListener("click", () => {
  searchContainer.style.top = "-10rem";
});

searchBtn.addEventListener("click", () => {
  searchContainer.style.top = "4rem";
});

const date = new Date();

year.innerText = date.getFullYear();

let wishList = localStorage.getItem("booksWishList")
  ? JSON.parse(localStorage.getItem("booksWishList"))
  : [];

wishedItemsCount.textContent = wishList.length;

(function (history) {
  var pushState = history.pushState;
  history.pushState = function (state) {
    wishedItemsCount.textContent = wishList.length;
    return pushState.apply(history, arguments);
  };
})(window.history);

function updateWishList(addToWishList, book) {
  let exists = false;
  for (let item of wishList) {
    if (item.id == book.id) {
      exists = true;
      break;
    }
  }
  if (!exists) {
    wishList.push(book);
    localStorage.setItem("booksWishList", JSON.stringify(wishList));
    addToWishList.classList.toggle("danger");
    addToWishList.classList.toggle("success");
    addToWishList.textContent = "remove from wishlist";
  } else {
    wishList = wishList.filter((item) => {
      if (item.id == book.id) return;
      else return item;
    });
    localStorage.setItem("booksWishList", JSON.stringify(wishList));
    addToWishList.classList.toggle("success");
    addToWishList.classList.toggle("danger");
    addToWishList.textContent = "add to wishlist";
  }
  console.log(wishList);
  wishedItemsCount.textContent = wishList.length;
}

function alreadyAdded(book) {
  for (let item of wishList) {
    if (item.id == book.id) return true;
  }
  return false;
}

async function fetchApi(URL) {
  messageContainer.style.display = "block";
  statusMessage.innerHTML = "fetching data please wait...";

  const response = await fetch(URL);
  const data = await response.json();
  const arr = [...data.results];
  statusMessage.innerHTML = "";
  messageContainer.style.display = "none";

  bookContainer.innerHTML = "";
  buttonContainer.innerHTML = "";

  if (!arr.length) {
    emptyList.style.display = "block";
    emptyList.innerHTML = "No items found!";
    return;
  }

  emptyList.style.display = "none";

  arr.map((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    const addToWishList = document.createElement("button");
    addToWishList.textContent = alreadyAdded(book)
      ? "remove from wishlist"
      : "add to wishlist";
    addToWishList.classList.add(alreadyAdded(book) ? "danger" : "success");
    addToWishList.addEventListener("click", () =>
      updateWishList(addToWishList, book)
    );

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");
    const bookImg = document.createElement("img");
    bookImg.src = book.formats["image/jpeg"];
    bookImg.alt = "Book Image";
    imgContainer.appendChild(bookImg);

    const bookTitle = document.createElement("p");
    bookTitle.className = 'book-title';
    bookTitle.innerText = "Title: " + book.title;

    const bookId = document.createElement("p");
    bookId.className = "book-id";
    bookId.appendChild(addToWishList);

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");
    infoContainer.appendChild(bookTitle);
    infoContainer.appendChild(bookId);
    const showBookDetails = document.createElement("a");
    showBookDetails.className = "show-book-details";
    showBookDetails.textContent = "Show Book Details";
    showBookDetails.href = "book.html";
    showBookDetails.addEventListener("click", () =>
      localStorage.setItem("selectedBook", JSON.stringify(book))
    );
    infoContainer.appendChild(showBookDetails);

    bookDiv.appendChild(imgContainer);
    bookDiv.appendChild(infoContainer);
    bookContainer.appendChild(bookDiv);
  });

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "Previous";
  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next";

  buttonContainer.appendChild(prevBtn);
  buttonContainer.appendChild(nextBtn);
  mainContainer.appendChild(buttonContainer);

  prevBtn.disabled = data.previous == null ? true : false;
  nextBtn.disabled = data.next == null ? true : false;

  prevBtn.addEventListener("click", () => {
    fetchApi(data.previous);
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    fetchApi(data.next);
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });
}

const URL = "https://gutendex.com/books/";
fetchApi(URL);

function handleFormSubmit(e) {
  e.preventDefault();
  if (searchByTitle.value !== "") {
    const searchURL = `https://gutendex.com/books?search=${searchByTitle.value}`;
    fetchApi(searchURL);
  } else fetchApi(URL);
  searchContainer.style.top = "-10rem";
}

submit.addEventListener("click", handleFormSubmit);

dropdown.addEventListener("change", () => {
  if (dropdown.value !== "") {
    const dropdownURL = `https://gutendex.com/books?topic=${dropdown.value}`;
    fetchApi(dropdownURL);
  } else fetchApi(URL);
});
