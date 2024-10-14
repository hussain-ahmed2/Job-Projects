const mainContainer = document.querySelector('main');
const bookContainer = document.getElementById("book-container");
const buttonContainer = document.getElementById('btn-container');
const searchByTitle = document.getElementById("search-by-title");
const select = document.getElementById('select');
const dropdown = document.getElementById('drop-down');
const submit = document.getElementById("submit");
const year = document.getElementById("year");

const date = new Date();

year.innerText = date.getFullYear();

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
    const bookDiv = document.createElement("a");
    bookDiv.classList.add("book");

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
      
      if (i != arr.length - 1) bookGenre.innerHTML += el.replace('Browsing:', ' ') + " | ";
      else bookGenre.innerHTML += el.replace('Browsing:', ' ') + ".";
    });

    const bookId = document.createElement("p");
    bookId.innerText = "ID: " + book.id;

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

  buttonContainer.innerHTML = '';
  const prevBtn = document.createElement('button');
  prevBtn.innerText = 'Previous';
  const nextBtn = document.createElement('button');
  nextBtn.innerText = 'Next';

  prevBtn.disabled = data.previous == null ? true : false;
  nextBtn.disabled = data.next == null ? true : false;

  prevBtn.addEventListener('click', () => {
    console.log(data.previous);
    
    fetchApi(data.previous);
  });

  nextBtn.addEventListener('click', () => {
    console.log(data.next);
    
    fetchApi(data.next);
  });

  buttonContainer.appendChild(prevBtn);  
  buttonContainer.appendChild(nextBtn);
  mainContainer.appendChild(buttonContainer);
}

const URL = "https://gutendex.com/books/";
fetchApi(URL);

function handleFormSubmit(e) {
  e.preventDefault();
  if (searchByTitle.value !== "") {
    const searchURL = `https://gutendex.com/books?search=${searchByTitle.value}`;
    fetchApi(searchURL);
  } else {
    fetchApi(URL)
  }
}

submit.addEventListener("click", handleFormSubmit);

dropdown.addEventListener('change', () => {
  console.log('selected');
  
  if (dropdown.value !== '') {
    const dropdownURL = `https://gutendex.com/books?topic=${dropdown.value}`;
    fetchApi(dropdownURL);
  } else fetchApi(URL);
});