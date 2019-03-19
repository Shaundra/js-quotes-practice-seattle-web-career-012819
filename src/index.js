document.addEventListener('DOMContentLoaded', function() {});

QUOTES_URL = 'http://localhost:3000/quotes';

function renderQuotes() {
  fetch(QUOTES_URL)
    .then(res => res.json())
    .then(json => json.forEach( function(quote) {addQuote(quote)} ))
}

function createElmt(elmt, parent, className, callback = () => {}) {
  let e = document.createElement(elmt);
  e.className = className;
  callback(e);
  parent.appendChild(e);
  return e;
}

function addQuote(quote) {
  let quoteList = document.getElementById('quote-list');
  let li = createElmt('li', quoteList, 'quote-card');
  // li.setAttribute('id', quote.id)

  let blockQuote = createElmt('blockquote', li, 'blockquote')

  createElmt('p', blockQuote, 'mb-0', (p) => p.innerText = quote.quote)

  createElmt('footer', blockQuote, 'blockquote-footer',
    (foot) => foot.innerText = quote.author)

  let likeButton = createElmt('button', blockQuote, 'btn-success',
    (like) => like.innerText = 'Likes: ');
  let likeCt = createElmt('span', likeButton, '',
    (ct) => ct.innerText = quote.likes)
  likeButton.addEventListener('click', () => { likeQuote(quote, likeCt) })

  let delButton = createElmt('button', blockQuote, 'btn-danger',
    (del) => del.innerText = 'Delete')
  delButton.addEventListener('click', () => { deleteQuote(quote, li) })
}

function likeQuote(quote, likeCount) {
  quote.likes++

  fetch(QUOTES_URL + '/' + quote.id, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'likes': quote.likes})
  })
    .then(res => res.json())
    .then(likeCount.innerText = quote.likes)
}

function deleteQuote(quote, li) {
  fetch(QUOTES_URL + '/' + quote.id, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  })
    .then(res => res.json())
    .then(li.remove())
}

function createQuote(e) {
  let newQuote = {'likes': 0};
  newQuote['quote'] = e.target[0].value;
  newQuote['author'] = e.target[1].value;

  fetch(QUOTES_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newQuote)
  })
    .then(res => res.json())
    .then(json => addQuote(json))
}

let quoteForm = document.getElementById('new-quote-form')
quoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  createQuote(e);
})


renderQuotes()
