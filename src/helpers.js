const cleanAndSplit = (text) => {
    const filtered = text.toString().replace(/[^0-9a-zA-Z ]/g, '');
    const splitted = filtered.split(' ')

    return splitted
}


module.exports = cleanAndSplit