// forked from https://github.com/tootsuite/mastodon/blob/995f8b389a66ab76ec92d9a240de376f1fc13a38/app/javascript/mastodon/features/emoji/emoji.js

// A mapping of unicode strings to an object containing the filename
// (i.e. the svg filename) and a shortCode intended to be shown
// as a "title" attribute in an HTML element (aka tooltip).

const [
    shortCodesToEmojiData,
    skins, // eslint-disable-line no-unused-vars
    categories, // eslint-disable-line no-unused-vars
    short_names, // eslint-disable-line no-unused-vars
    emojisWithoutShortCodes,
] = require('./emoji_compressed');
const { unicodeToFilename } = require('./unicode_to_filename');

// decompress
const unicodeMapping = {};

function processEmojiMapData(emojiMapData, shortCode) {
    let [native, filename] = emojiMapData;
    if (!filename) {
        // filename name can be derived from unicodeToFilename
        filename = unicodeToFilename(native);
    }
    unicodeMapping[native] = {
        shortCode: shortCode,
        filename: filename,
    };
}

Object.keys(shortCodesToEmojiData).forEach((shortCode) => {
    let [filenameData] = shortCodesToEmojiData[shortCode];
    filenameData.forEach(emojiMapData => processEmojiMapData(emojiMapData, shortCode));
});
emojisWithoutShortCodes.forEach(emojiMapData => processEmojiMapData(emojiMapData));

export default unicodeMapping;
//module.exports = unicodeMapping;