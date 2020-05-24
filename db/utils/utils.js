exports.formatDates = (list) => {
  if (list.length === 0) return [];
  else {
    return list.map((obj) => {
      const unformattedTimestamp = obj.created_at;
      obj.created_at = new Date(unformattedTimestamp);
      return obj;
    });
  }
};

exports.makeRefObj = (list) => {
  return list.reduce((refObj, listItem) => {
    refObj[listItem.title] = listItem.article_id;
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  if (!comments) return [];
  else {
    const timeFormattedComments = this.formatDates(comments);
    return timeFormattedComments.map((comment) => {
      const belongsToValue = comment.belongs_to;
      const {
        created_by: author,
        belongs_to: article_id,
        ...restOfComment
      } = comment;

      const newObj = {
        author,
        article_id: articleRef[belongsToValue],
        ...restOfComment,
      };

      return newObj;
    });
  }
};
