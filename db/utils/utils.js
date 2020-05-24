exports.formatDates = (list) => {
  return list.map((obj) => {
    const unformattedTimestamp = obj.created_at;
    obj.created_at = new Date(unformattedTimestamp);
    return obj;
  });
};

exports.makeRefObj = (list) => {
  return list.reduce((refObj, listItem) => {
   refObj[listItem.title] = listItem.article_id
   return refObj
  }, {})
};

exports.formatComments = (comments, articleRef) => {
  const formattedComment =  comments.map((comment) => {
    const belongsToValue = comment.belongs_to

    const {created_by: author, belongs_to: article_id, ...restOfComment} = comment
  
    const newObj = {author, article_id: articleRef[belongsToValue], ...restOfComment}

    return newObj
 
  })
  return this.formatDates(formattedComment)
};
