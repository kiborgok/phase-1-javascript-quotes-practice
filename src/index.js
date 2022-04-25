document.addEventListener("DOMContentLoaded", () => {
  const quoteList = document.getElementById("quote-list");
  const quoteForm = document.getElementById("new-quote-form");

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const quote = e.target.quote.value;
    const author = e.target.author.value;
    addQuote({ quote, author }).then((res) => {
      getQuote(res.id).then((data) => {
        createQuoteCard(data);
      });
    });
  });

  displayQuotes();
  function displayQuotes() {
    getQuotes().then((res) => {
      createQuoteCard(res);
    });
  }
  function handleLike(likes, quote) {
    const likeAvailable = likes.find((like) => like.quoteId == quote.id);
    if (likeAvailable) {
      console.log("available");
      removeLike(likeAvailable.id);
      likes.innerHTML = `Likes <span>${quote.likes.length - 1}</span>`;
      return;
    }
    let quoteId = quote.id;
    addLike(quoteId).then((data) => {
      getQuote(quoteId).then((res) => {
        likes.innerHTML = `Likes <span>${res.likes.length}</span>`;
      });
    });
    console.log("not available");
  }
  function createQuoteCard(data) {
    if (Array.isArray(data)) {
      data.forEach((quote) => {
        const li = document.createElement("li");
        li.setAttribute("class", "quote-card");
        const blockquote = document.createElement("blockquote");
        blockquote.setAttribute("class", "blockquote");

        const p = document.createElement("p");
        p.setAttribute("class", "mb-0");
        p.textContent = quote.quote;
        const footer = document.createElement("footer");
        footer.setAttribute("class", "blockquote-footer");
        footer.textContent = quote.author;
        const br = document.createElement("br");
        const likes = document.createElement("button");
        likes.setAttribute("class", "btn-success");
        likes.innerHTML = `Likes <span>${quote.likes.length}</span>`;
        likes.addEventListener("click", (e) => {
          getLikes().then((res) => {
            handleLike(res, quote);
          });
        });
        const del = document.createElement("button");
        del.setAttribute("class", "btn-danger");
        del.textContent = "Delete";
        del.addEventListener("click", (e) => {
          e.target.parentNode.parentNode.remove();
          deleteQuote(quote.id);
        });
        blockquote.appendChild(p);
        blockquote.appendChild(footer);
        blockquote.appendChild(br);
        blockquote.appendChild(likes);
        blockquote.appendChild(del);
        li.appendChild(blockquote);
        quoteList.appendChild(li);
      });
      return;
    }
    const li = document.createElement("li");
    li.setAttribute("class", "quote-card");
    const blockquote = document.createElement("blockquote");
    blockquote.setAttribute("class", "blockquote");

    const p = document.createElement("p");
    p.setAttribute("class", "mb-0");
    p.textContent = data.quote;
    const footer = document.createElement("footer");
    footer.setAttribute("class", "blockquote-footer");
    footer.textContent = data.author;
    const br = document.createElement("br");
    const likes = document.createElement("button");
    likes.setAttribute("class", "btn-success");
    likes.innerHTML = `Likes <span>${0}</span>`;
    const del = document.createElement("button");
    del.setAttribute("class", "btn-danger");
    del.textContent = "Delete";
    blockquote.appendChild(p);
    blockquote.appendChild(footer);
    blockquote.appendChild(br);
    blockquote.appendChild(likes);
    blockquote.appendChild(del);
    li.appendChild(blockquote);
    quoteList.appendChild(li);
  }
  function addQuote(quoteObject) {
    return fetch(`http://localhost:3000/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quoteObject),
    }).then((res) => res.json());
  }
  function deleteQuote(id) {
    return fetch(`http://localhost:3000/quotes/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }
  function removeLike(id) {
    return fetch(`http://localhost:3000/likes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
  function getQuotes() {
    return fetch(`http://localhost:3000/quotes?_embed=likes`).then((res) =>
      res.json()
    );
  }
  function getQuote(id) {
    return fetch(`http://localhost:3000/quotes/${id}?_embed=likes`).then(
      (res) => res.json()
    );
  }
  function getLikes() {
    return fetch(`http://localhost:3000/likes`).then((res) => res.json());
  }
  function addLike(quoteId) {
    return fetch(`http://localhost:3000/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId }),
    }).then((res) => res.json());
  }
});
