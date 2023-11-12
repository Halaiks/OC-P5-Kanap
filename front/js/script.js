// Parent container
const container = document.getElementById('items')

let url = 'http://localhost:3000/api/products/'

// Appel de l'API permettant de recupérer la liste des produits de la boutique
fetch(url)
  .then((response) => response.json())
  .then((products) => {
    showProducts(products)
  })

// Affichage produits renvoyés par l'API
function showProducts(products) {
  products.forEach((product) => {
    // console.log(product);

    // Product link
    // Redirection vers la page product.html avec comme paramètre ID produit concerné
    const link = document.createElement('a')
    link.href = 'product.html?id=' + product._id

    // Article
    const article = document.createElement('article')
    link.appendChild(article)

    // Product image
    const image = document.createElement('img')
    image.src = product.imageUrl
    image.alt = product.altTxt
    article.appendChild(image)

    // Product name
    const h3 = document.createElement('h3')
    h3.innerText = product.name
    article.appendChild(h3)

    // Product description
    const p = document.createElement('p')
    p.innerText = product.description
    article.appendChild(p)

    // Add elements container
    container.appendChild(link)
  })
}
