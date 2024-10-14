const book = JSON.parse(localStorage.getItem("selectedBook"));
const bookContainer = document.getElementById("book-container");

console.log(book);

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

const infoContainer = document.createElement("div");
infoContainer.classList.add("info-container");
infoContainer.appendChild(bookId);
infoContainer.appendChild(bookTitle);
infoContainer.appendChild(bookAuthors);
infoContainer.appendChild(bookGenre);

bookContainer.appendChild(imgContainer);
bookContainer.appendChild(infoContainer);

const contents = document.createElement("div");
const pre = document.createElement("pre");

async function fetchContents(url) {
  const res = await fetch(url);
  const data = await res.text();
  return data;
}
pre.innerHTML = await fetchContents(book.formats["text/plain; charset=us-ascii"]);

contents.appendChild(pre);

bookContainer.appendChild(contents);
