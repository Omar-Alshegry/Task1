class Book {
    public title: string;
    public author: string;
    public category: string;
    public available: boolean;

    constructor(title: string, author: string, category: string, available: boolean) {
        this.title = title;
        this.author = author;
        this.category = category;
        this.available = available;
    }

    getTitle(): string { 
        return this.title; 
    }
    getCategory(): string { 
        return this.category; 
    }
    getAuthor(): string { 
        return this.author; 
    }
    getAvailable(): boolean { 
        return this.available; 
    }

    setTitle(title: string): void { 
        this.title = title; 
    }
    setCategory(category: string): void { 
        this.category = category; 
    }
    setAuthor(author: string): void { 
        this.author = author; 
    }
    setAvailable(): void { 
        this.available = !this.available; 
    }

    displayInfo(): string {
        return `Title: ${this.title}, Author: ${this.author}, Category: ${this.category}, Available: ${this.available}`;
    }
}

class ReferenceBook extends Book {
    public locationCode: string;

    constructor(title: string, author: string, category: string, available: boolean, locationCode: string) {
        super(title, author, category, available);
        this.locationCode = locationCode;
    }

    getLocationCode(): string { 
        return this.locationCode; 
    }

    displayInfo(): string {
        return `${super.displayInfo()}, Location Code: ${this.locationCode}`;
    }
}

class Library {
    public books: Book[] = [];

    addBook(book: Book): void {
        this.books.push(book);
    }

    removeBook(title: string): void {
        this.books = this.books.filter(book => book.getTitle() !== title);
    }

    searchBooks(name: string): Book[] {
        if (!name) return this.books;
        return this.books.filter(book => 
            book.getTitle().toLowerCase().includes(name.toLowerCase()) || 
            book.getAuthor().toLowerCase().includes(name.toLowerCase())
        );
    }

    filterByCategory(category: string): Book[] {
        if (!category) return this.books;
        return this.books.filter(book => book.getCategory().toLowerCase() === category.toLowerCase());
    }

    toggleAvailability(title: string): void {
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


const readBooks = (booksReading: Book[]): void => {
    const container = document.getElementById("container");
    if (!container) return;

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

const attachCardEvents = (): void => {
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const title = (e.target as HTMLButtonElement).getAttribute('data-title');
            if (title) {
                myLibrary.removeBook(title);
                readBooks(myLibrary.books); 
            }
        });
    });

    document.querySelectorAll('.status').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const title = (e.target as HTMLButtonElement).getAttribute('data-title');
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
    const searchInput = document.getElementById('search') as HTMLInputElement;
    const selectInput = document.getElementById('select') as HTMLSelectElement;

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