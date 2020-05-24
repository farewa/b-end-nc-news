exports.formatDates = (list) => {
  return list.map((obj) => {
    const unformattedTimestamp = obj.created_at;
    obj.created_at = new Date(unformattedTimestamp);
    return obj;
  });
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
