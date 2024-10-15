const book = JSON.parse(localStorage.getItem("selectedBook"));
const bookContainer = document.getElementById("book-container");
const wishedItemsCount = document.getElementById('wished-items-count');
let wishList = localStorage.getItem("booksWishList")
  ? JSON.parse(localStorage.getItem("booksWishList"))
  : [];

wishedItemsCount.textContent = wishList.length;
(function(history){
  var pushState = history.pushState;
  history.pushState = function(state) {
    wishedItemsCount.textContent = wishList.length;
    return pushState.apply(history, arguments);
  };
})(window.history);

function alreadyAdded(book) {
  for (let item of wishList) {
    if (item.id == book.id) return true;
  }
  return false;
}

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

const bookDiv = document.createElement('div');
bookDiv.id = 'book';

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
