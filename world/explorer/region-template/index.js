module.exports = {
    name: "region", // the name of this region that will be used in the url
    dirname: __dirname, //always include
    options: {},
    areas: [
        require("./area") // one of these for every area
    ]
};