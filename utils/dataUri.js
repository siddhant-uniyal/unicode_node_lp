const DataUriParser = require("datauri/parser.js")

const path = require("path")

const getDataUri = (file) =>{

    const parser = new DataUriParser();

    const extName = path.extname(file.originalName).toString();

    return parser.format(extName , file.buffer)

}

module.exports = getDataUri