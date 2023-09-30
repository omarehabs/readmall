function handlePagination(limit, page) {
    limit = +limit;
    page = +page;
    if (limit) {
        if (!page) {
            return { limit };
        }
        const offset = (page - 1) * limit;
        return { limit, offset };
    } else if (page && !limit) {
        const offset = (page - 1) * 10;
        return { limit: 10, offset };
    } else {
        return { limit: 10 };
    }
}

module.exports = handlePagination;