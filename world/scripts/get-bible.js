export default async function (req, user) {
    //console.log(req.globals.nkjvBible.books.length);
    //66 books

    let query = {
        book: req.body.book,
        chapter: `${req.body.chapter}`,
        verse: req.body.verse ? `${req.body.verse}` : null,
        verseEnd: req.body.verseEnd ? `${req.body.verseEnd}` : null
    }

    if (query.verse !== null) {
        if (query.verseEnd !== null) {
            let verses = [];
            
            for (let i = parseInt(query.verse); i <= parseInt(query.verseEnd); i++) {
                verses.push(req.globals.nltBible[query.book][query.chapter][i]);
            }
            return verses;
        }
        else return req.globals.nltBible[query.book][query.chapter][query.verse];
    }
    else if (query.chapter !== null) {
        return req.globals.nltBible[query.book][query.chapter];
    }
    else if (query.book !== null) {
        return req.globals.nltBible[query.book];
    }
}