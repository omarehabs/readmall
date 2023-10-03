function handleNumOfPages(count, limit, deafult) {
    console.log(count)
return Math.ceil(limit ? count / limit : count / deafult)
}

module.exports = handleNumOfPages;