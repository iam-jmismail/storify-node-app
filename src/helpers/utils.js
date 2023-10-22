const getPaginationMeta = (page, limit, count) => {
  const last_page = Math.ceil(count / limit);

  return {
    current_page: page,
    last_page,
    total_records: count,
  };
};

module.exports = { getPaginationMeta };
