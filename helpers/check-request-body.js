function checkRequestBody(body, methodName) {
  const sample = ['title', 'rating', 'year', 'budget', 'gross', 'poster', 'position'];
  if(
    typeof body !== 'object' ||
    body === null ||
    body.id && (isNaN(body.id) || +body.id < 0) ||
    body.position && (isNaN(body.position) || +body.position < 0) ||
    body.rating && isNaN(body.rating) ||
    body.budget && isNaN(body.budget) ||
    body.gross && isNaN(body.gross) ||
    body.year && isNaN(body.year) ||
    body.poster && typeof body.poster !== 'string' ||
    body.title && typeof body.title !== 'string'
  ) {
    return false;
  }
  if(methodName === 'create') {
    return Object.keys(body).every((key) => sample.includes(key)) && Object.keys(body).length === sample.length;
  }
  if(methodName === 'update') {
    return Object.keys(body).some((key) => sample.includes(key)) && body.id && !isNaN(body.id);
  }
  if(methodName === 'delete') {
    return body.id && !isNaN(body.id) && body.id >= 0 && Object.keys(body).length === 1;
  }
  return true;
}

module.exports = { checkRequestBody };
