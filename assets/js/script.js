"use strict";
class Book {
    title;
    author;
    category;
    available;
    constructor(title, author, category, available) {
        this.title = title;
        this.author = author;
        this.category = category;
        this.available = available;
    }
    getTitle() {
        return this.title;
    }
    getCategory() {
        return this.category;
    }
    getAuthor() {
        return this.author;
    }
    getAvailable() {
        return this.available;
    }
    setTitle(title) {
        this.title = title;
    }
    setCategory(category) {
        this.category = category;
    }
    setAuthor(author) {
        this.author = author;
    }
    setAvailable() {
        this.available = !this.available;
    }
    displayInfo() {
        return `Title: ${this.title}, Author: ${this.author}, Category: ${this.category}, Available: ${this.available}`;
    }
}
class ReferenceBook extends Book {
    locationCode;
    constructor(title, author, category, available, locationCode) {
        super(title, author, category, available);
        this.locationCode = locationCode;
    }
    getLocationCode() {
        return this.locationCode;
    }
    displayInfo() {
        return `${super.displayInfo()}, Location Code: ${this.locationCode}`;
    }
}
class Library {
    books = [];
    addBook(book) {
        this.books.push(book);
    }
    removeBook(title) {
        this.books = this.books.filter(book => book.getTitle() !== title);
    }
    searchBooks(name) {
        if (!name)
            return this.books;
        return this.books.filter(book => book.getTitle().toLowerCase().includes(name.toLowerCase()) ||
            book.getAuthor().toLowerCase().includes(name.toLowerCase()));
    }
    filterByCategory(category) {
        if (!category)
            return this.books;
        return this.books.filter(book => book.getCategory().toLowerCase() === category.toLowerCase());
    }
    toggleAvailability(title) {
        const book = this.books.find(book1 => book1.getTitle() === title);
        if (book) {
            book.setAvailable();
        }
    }
}
const myLibrary = new Library();
myLibrary.addBook(new Book("Clean Code", "Robert C. Martin", "programming", true));
myLibrary.addBook(new Book("The Hobbit", "J.R.R. Tolkien", "drama", false));
myLibrary.addBook(new Book("A Brief History of Time", "Stephen Hawking", "science", true));
myLibrary.addBook(new Book("Sapiens", "Yuval Noah Harari", "history", true));
myLibrary.addBook(new ReferenceBook("TypeScript Handbook", "Microsoft", "programming", true, "REF-TS-001"));
myLibrary.addBook(new ReferenceBook("Encyclopedia of Math", "John Doe", "math", false, "REF-MATH-99"));
const readBooks = (booksReading) => {
    const container = document.getElementById("container");
    if (!container)
        return;
    container.innerHTML = "";
    if (booksReading.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }
    booksReading.forEach(book => {
        container.innerHTML += `
            <div class="card">
                <p class="title">Title: ${book.getTitle()}</p>
                <p class="author">Author: ${book.getAuthor()}</p>
                <p class="category">Category: ${book.getCategory()}</p>
                <p class="isAvailable">Available: ${book.getAvailable()}</p>
                <div class="actions">
                    <button class="status" data-title="${book.getTitle()}">Toggle Status</button>
                    <button class="delete" data-title="${book.getTitle()}">Delete</button>
                </div>
            </div>
        `;
    });
    attachCardEvents();
};
const attachCardEvents = () => {
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const title = e.target.getAttribute('data-title');
            if (title) {
                myLibrary.removeBook(title);
                readBooks(myLibrary.books);
            }
        });
    });
    document.querySelectorAll('.status').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const title = e.target.getAttribute('data-title');
            if (title) {
                myLibrary.toggleAvailability(title);
                readBooks(myLibrary.books);
            }
        });
    });
};
document.addEventListener('DOMContentLoaded', () => {
    readBooks(myLibrary.books);
    const form = document.querySelector('form');
    const searchInput = document.getElementById('search');
    const selectInput = document.getElementById('select');
    const applySearchAndFilter = () => {
        const query = searchInput ? searchInput.value : '';
        const category = selectInput ? selectInput.value : '';
        let result = myLibrary.searchBooks(query);
        if (category) {
            result = result.filter(book => book.getCategory().toLowerCase() === category.toLowerCase());
        }
        readBooks(result);
    };
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            applySearchAndFilter();
        });
    }
    if (selectInput) {
        selectInput.addEventListener('change', () => {
            applySearchAndFilter();
        });
    }
});
