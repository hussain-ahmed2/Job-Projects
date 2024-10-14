const mainContainer = document.querySelector("main");
const bookContainer = document.getElementById("book-container");
const buttonContainer = document.getElementById("btn-container");
const searchByTitle = document.getElementById("search-by-title");
const select = document.getElementById("select");
const dropdown = document.getElementById("drop-down");
const submit = document.getElementById("submit");
const year = document.getElementById("year");
const wishedItems = document.getElementById("wished-items");

const date = new Date();

year.innerText = date.getFullYear();

let wishList = localStorage.getItem("booksWishList")
  ? JSON.parse(localStorage.getItem("booksWishList"))
  : [];

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
  console.log(addToWishList, wishList);
}

async function fetchApi(URL) {
  const response = await fetch(URL);
  const data = await response.json();
  const arr = [...data.results];

  bookContainer.innerHTML = "";

  if (!arr.length) {
    bookContainer.innerHTML = "No items found!";
    return;
  }

  arr.map((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    const addToWishList = document.createElement("button");
    addToWishList.textContent = "add to wishlist";
    addToWishList.classList.add('success');
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
    bookTitle.innerText = "Title: " + book.title;

    const bookAuthors = document.createElement("p");
    bookAuthors.innerHTML = "Authors: ";
    book.authors.forEach((author, i, arr) => {
      if (i != arr.length - 1) bookAuthors.innerHTML += author.name + " | ";
      else bookAuthors.innerHTML += author.name + ".";
    });

    const bookGenre = document.createElement("p");
    bookGenre.innerHTML = "Genre: ";
    book.bookshelves.forEach((el, i, arr) => {
      if (i != arr.length - 1)
        bookGenre.innerHTML += el.replace("Browsing:", " ") + " | ";
      else bookGenre.innerHTML += el.replace("Browsing:", " ") + ".";
    });

    const bookId = document.createElement("p");
    bookId.innerText = "ID: " + book.id;
    bookId.className = "book-id";
    bookId.appendChild(addToWishList);

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");
    infoContainer.appendChild(bookId);
    infoContainer.appendChild(bookTitle);
    infoContainer.appendChild(bookAuthors);
    infoContainer.appendChild(bookGenre);

    bookDiv.appendChild(imgContainer);
    bookDiv.appendChild(infoContainer);
    bookContainer.appendChild(bookDiv);
  });

  buttonContainer.innerHTML = "";
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
  });

  nextBtn.addEventListener("click", () => {
    fetchApi(data.next);
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
}

submit.addEventListener("click", handleFormSubmit);

dropdown.addEventListener("change", () => {
  if (dropdown.value !== "") {
    const dropdownURL = `https://gutendex.com/books?topic=${dropdown.value}`;
    fetchApi(dropdownURL);
  } else fetchApi(URL);
});

wishedItems.addEventListener("click", () => {
  bookContainer.innerHTML = "";
});
