function handleNumOfPages(count, limit, deafult) {
return Math.ceil(limit ? count / limit : count / deafult)
}

module.exports = handleNumOfPages;