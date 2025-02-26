
function getSortPaging(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    let sort = { createdAt: -1 };

    if (query?.sort && query.order) {

        const newSort = {};
        newSort[query.sort] = query.order === 'asc' ? 1 : -1;
        sort = newSort;
    }

    return { sort, skip: (page - 1) * limit, limit };
}

async function listResponse(model, queryObject, items, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const total = await model.countDocuments(queryObject).exec();

    return {
        total,
        items,
        page,
        limit
    };
}

module.exports = {
    getSortPaging,
    listResponse
};
