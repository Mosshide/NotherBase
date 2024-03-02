class BibleViewer extends Container {
    constructor(settings = {}) {
        super({
            header: "Bible Viewer",
            styles: "bible-viewer",
            showUI: true,
            initialBook: "Genesis",
            initialChapter: 1,
            initialVerse: null,
            ...settings
        });
        
        this.location = {
            book: 0,
            chapter: 0,
            verse: null
        };
        this.newLocation = {
            book: this.location.book,
            chapter: this.location.chapter,
            verse: this.location.verse
        };

        this.bibleInfo = [];

        this.content = this.addChild(new Text("p", {
            defaultClasses: `bible-text ${this.settings.showUI ? "" : "no-ui"}`,
            placeholder: "Pick a book and chapter to read."
        }));

        this.ui = this.addChild(new Element("div", {
            defaultClasses: "bible-ui",
            hidden: this.settings.showUI ? false : true
        }));

        this.goButton = this.ui.addChild(new Button("go", () => { this.openTo(); }, { 
            placeholder: "Go"
        }));
    }

    render() {
        base.do("get-bible-info", { route: "/global" }).then((res) => {
            this.bibleInfo = res.data;
            this.setBooks();
            this.setChapters();
            this.openTo({
                book: this.bibleInfo.findIndex((b) => b.name.toLowerCase() == this.settings.initialBook.toLowerCase()),
                chapter: this.settings.initialChapter != null ? this.settings.initialChapter - 1 : null,
                verse: this.settings.initialVerse != null ? this.settings.initialVerse - 1 : null
            });
        });

        this.settings.defaultClasses = "bible-viewer";
        this.$div = super.render(`.bible-viewer${this.settings.id ? `#${this.settings.id}` : ""}`);

        return this.$div;
    }

    setBooks = () => {
        let books = [];

        for (let i = 0; i < this.bibleInfo.length; i++) {
            books.push(this.bibleInfo[i].name);
        }

        this.bookSelect = this.ui.addChild(new Select({
            onChange: this.selectBook,
            options: books
        }));
    }

    setChapters = () => {
        if (this.chapterSelect) {
            this.chapterSelect.close();
            this.chapterSelect = null;
        }
        this.newLocation.chapter = 0;
        let chapters = [];
        
        for (let i = 0; i < this.bibleInfo[this.newLocation.book].chapters.length; i++) {
            chapters.push(i + 1);
        }

        this.chapterSelect = this.ui.addChild(new Select({
            onChange: this.selectChapter,
            options: chapters
        }));
    }

    selectBook = (book, e, self) => {
        this.newLocation.book = this.bibleInfo.findIndex((b) => b.name.toLowerCase() == book);

        this.setChapters();
    }

    selectChapter = (chapter, e, self) => {
        this.newLocation.chapter = parseInt(chapter) - 1;
    }

    openTo = async (location = this.newLocation) => {
        this.location = {
            ...this.location,
            ...location
        };

        let res = await base.do("get-bible", {
            ...this.location,
            route: "/global"
        });

        let text = `${this.bibleInfo[this.location.book].name} ${this.location.chapter + 1}${this.location.verse ? `:${this.location.verse + 1}` : ""} <br />`;
        if (res.data.verses) {
            for (let i = 0; i < res.data.verses.length; i++) {
                text += `${i + 1}: `;
                text += res.data.verses[i].text;
                text += '<br /><br />';
            }
        }
        else text += res.data.text;

        this.content.setValue(text);
        this.bookSelect.setValue(this.bibleInfo[this.newLocation.book].name);
        this.setChapters();
        this.newLocation.chapter = this.location.chapter;
        this.chapterSelect.setValue((this.location.chapter + 1).toString());

        this.$div.find("h4").text(`${this.bibleInfo[this.location.book].name} ${this.location.chapter + 1}${this.location.verse ? `:${this.location.verse + 1}` : ""}`);
    }
}