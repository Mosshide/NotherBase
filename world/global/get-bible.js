export default async function (req, user) {
    //console.log(req.globals.nkjvBible.books.length);
    //66 books

    let query = {
        book: req.body.book,
        chapter: req.body.chapter,
        verse: req.body.verse,
        verseEnd: req.body.verseEnd
    }

    if (query.verse !== null) {
        if (query.verseEnd !== null) {
            let verses = [];
            for (let i = query.verse; i <= query.verseEnd; i++) {
                verses.push(req.globals.nkjvBible.books[query.book].chapters[query.chapter].verses[i]);
            }
            return verses;
        }
        else return req.globals.nkjvBible.books[query.book].chapters[query.chapter].verses[query.verse];
    }
    else if (query.chapter !== null) {
        return req.globals.nkjvBible.books[query.book].chapters[query.chapter];
    }
    else {
        return req.globals.nkjvBible.books[query.book];
    }
}