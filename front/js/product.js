// Get paramètre id url
// searchParams permet de chercher les paramètres envoyés depuis l'URL
const params = new URL(document.location).searchParams
const id = params.get('id')

// Fetch resquest with product id
// Donne les détails du produits concernés à partir de son id
let url = `http://localhost:3000/api/products/${id}`
fetch(url)
  .then((response) => response.json())
  .then((product) => {
    showProduct(product)
  })

  // Affichage produits renvoyés par l'API
function showProduct(product) {
      //Add products informations
      const item__img = document.querySelector('.item__img')
      item__img.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`
  
      const title = document.getElementById('title')
      title.innerHTML = product.name
  
      const price = document.getElementById('price')
      price.innerHTML = product.price
  
      const description = document.getElementById('description')
      description.innerHTML = product.description
  
      // Liste déroulante
      const colorsSelect = document.getElementById('colors')
      product.colors.forEach((color) => {
        const colorOption = document.createElement('option')
        colorOption.value = color
        colorOption.innerText = color
        colorsSelect.appendChild(colorOption)
      })
}

    //// Bouton ajouter
    const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", () => {
  const quantity = parseInt(document.getElementById("quantity").value);
  const color = document.getElementById("colors").value;
  const id = params.get('id');

  // Vérifier si quantité < 1 et couleur sélectionée
  if (quantity < 1 || color === "") {
    alert("Veuillez sélectionner la couleur et la quantité de votre produit.");
    return;
  }

  const product = { id, quantity, color };
  let addProductLocalStorage = JSON.parse(localStorage.getItem("addToCart") || '[]');

  // Vérifier si le produit est déjà dans le panier
  const existingProductIndex = addProductLocalStorage.findIndex(p => p.id === id && p.color === color);

  if (existingProductIndex !== -1) {
    // Si le produit existe, mettez à jour la quantité
    addProductLocalStorage[existingProductIndex].quantity += quantity;
  } else {
    // Sinon, ajoutez un nouveau produit au panier avec la quantité spécifiée
    addProductLocalStorage.push(product);
  }
// Si le panier est vide, ajoutez le premier produit
  localStorage.setItem("addToCart", JSON.stringify(addProductLocalStorage));

  alert(`${quantity} articles de couleur ${color} ont été ajoutés au panier !`)

});
  
/// AJOUTER ALERTE PRODUIT AJOUTER DANS LE PANIER 

