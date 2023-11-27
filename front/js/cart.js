// PRODUITS //

// Déclaration des variables
let addToCart = [];
let cart = JSON.parse(localStorage.getItem('addToCart'));

// Affichage des produits dans le panier
if (cart === null) {
  addToCart = [];
  alert('Votre panier est vide');
  console.log('localStorage vide');
}

// Fonction asynchrone pour obtenir les détails d'un produit par son ID
async function getProductById(id) {
  let response = await fetch(`http://localhost:3000/api/products/${id}`);
  return response.json();
}

// Fonction pour afficher les produits du panier sur la page
async function showData() {
  const cartItems = document.getElementById('cart__items');

  for (item of cart) {
    const productDetails = await getProductById(item.id);

    // Création de l'élément article
    const article = document.createElement('article');
    article.className = 'cart__item';
    article.dataset.id = productDetails.id;
    article.dataset.color = productDetails.color;
    cartItems.appendChild(article);

    // Création de la div pour l'image
    const divImg = document.createElement('div');
    divImg.classList.add('cart__item__img');
    article.appendChild(divImg);

    // Création de l'image
    const image = document.createElement('img');
    divImg.appendChild(image);
    image.src = productDetails.imageUrl;
    image.alt = productDetails.imageAlt;

    // Création de la div pour le contenu de l'item
    const divContent = document.createElement('div');
    divContent.className = 'cart__item__content';
    article.appendChild(divContent);

    // Création de la description de l'item
    const divContentDescription = document.createElement('div');
    divContentDescription.className = 'cart__item__content__description';
    divContent.appendChild(divContentDescription);

    // Création du titre de l'item
    const h2Name = document.createElement('h2');
    divContentDescription.appendChild(h2Name);
    h2Name.innerText = productDetails.name;

    // Affichage de la couleur de l'item
    const color = document.createElement('p');
    color.innerText = item.color;
    divContentDescription.appendChild(color);

    // Affichage du prix de l'item
    const price = document.createElement('p');
    divContentDescription.appendChild(price);
    price.innerText = productDetails.price + '€';

    // Div settings pour la quantité et la suppression
    const divSettings = document.createElement('div');
    divSettings.className = 'cart__item__content__settings';
    divContent.appendChild(divSettings);

    // Setting quantity
    const divSettingsQuantity = document.createElement('div');
    divSettingsQuantity.className = 'cart__item__content__settings__quantity';
    divSettings.appendChild(divSettingsQuantity);

    // Création d'un élément p pour la quantité
    const qte = document.createElement('p');
    qte.textContent = 'Qté : ';
    divSettingsQuantity.appendChild(qte);

    // Input de la quantité
    const input = document.createElement('input');
    input.type = 'number';
    input.classList.add('itemQuantity');
    input.name = 'itemQuantity';
    input.min = '1';
    input.max = '100';
    input.setAttribute('value', item.quantity);
    divSettingsQuantity.appendChild(input);

    // Div settings pour la suppression
    const divSettingsDelete = document.createElement('div');
    divSettingsDelete.className = 'cart__item__content__settings__delete';
    divSettings.appendChild(divSettingsDelete);

    // Création d'un élément p pour le bouton de suppression
    const buttonDelete = document.createElement('p');
    buttonDelete.className = 'deleteItem';
    buttonDelete.innerText = 'Supprimer';
    divSettingsDelete.appendChild(buttonDelete);

    // Création de l'objet product
    const product = {
      id: productDetails.id,
      color: productDetails.color,
      quantity: item.quantity,
      price: productDetails.price,
      name: h2Name.innerText,
      image: image.src,
      altText: image.alt,
    };

    console.log(product);

    // Fonction qui calcule la quantité et le prix des produits du panier
    async function totalPriceQuantity() {
      let totalPrice = 0;
      let totalQty = 0;

      if (cart.length != 0) {
        for (let j = 0; j < cart.length; j++) {
          let item = cart[j];
          totalPrice += parseInt(item.quantity) * parseInt(productDetails.price);
          totalQty += parseInt(item.quantity);
        }
      }

      const finalQty = document.getElementById('totalQuantity');
      finalQty.innerHTML = totalQty;

      const finalPrice = document.getElementById('totalPrice');
      finalPrice.innerHTML = totalPrice;
    }

    totalPriceQuantity();

    // Fonction qui modifie la quantité
    function changeQuantity() {
      const changedQuantity = document.getElementsByClassName('itemQuantity');

      for (let j = 0; j < changedQuantity.length; j++) {
        changedQuantity[j].addEventListener('change', function (event) {
          event.preventDefault();
          cart[j].quantity = parseInt(event.target.value);

          if (cart[j].quantity < 0 || cart[j].quantity > 100) {
            alert('Veuillez sélectionner une quantité comprise entre 1 et 100');
            window.location.href = 'cart.html';
          } else {
            localStorage.setItem('addToCart', JSON.stringify(cart));
            totalPriceQuantity();
          }
        });
      }
    }

    changeQuantity();
  }

  // Fonction qui supprime un produit du panier
  function deleteProducts() {
    const deleteItem = document.getElementsByClassName('deleteItem');

    for (let d = 0; d < deleteItem.length; d++) {
      deleteItem[d].addEventListener('click', (event) => {
        event.preventDefault();

        // Récupérer l'index du produit dans le panier
        const productIndex = d;

        // Supprimer le produit spécifique à cet index
        cart.splice(productIndex, 1);

        // Mettre à jour le localStorage
        localStorage.setItem('addToCart', JSON.stringify(cart));

        // Avertir de la suppression et mettre à jour le total
        alert('Votre article a bien été supprimé.');
        window.location.href = 'cart.html';
        totalPriceQuantity();
      });
    }
  }

  deleteProducts();
}

showData();

// FIN PRODUITS //

  
// FORMULAIRE //

// Fonction pour gérer l'envoi du formulaire au serveur
function postForm() {
  // Récupération de l'élément bouton d'envoi du formulaire
  const order = document.getElementById('order')

  // Ajout d'un écouteur d'événement pour le clic sur le bouton d'envoi
  order.addEventListener('click', (event) => {
    event.preventDefault()

    // Récupération des données du formulaire dans un objet
    const contact = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      email: document.getElementById('email').value,
    }

    // Expressions régulières pour la validation des champs du formulaire
    const communeRegex = /^[a-zA-ZéèêëàâäôöîïùûüçÉÈÊËÀÂÄÔÖÎÏÙÛÜÇ\s-]+$/
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/

    // Fonction de contrôle pour le champ du prénom
    function controlFirstName() {
      const okFirstName = contact.firstName
      if (communeRegex.test(okFirstName)) {
        return true
      } else {
        let firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
        alert((firstNameErrorMsg.innerText = 'Veuillez entrer votre prénom'))
      }
    }

    // Fonction de contrôle pour le champ du nom
    function controlName() {
      const okName = contact.lastName
      if (communeRegex.test(okName)) {
        return true
      } else {
        let lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
        alert((lastNameErrorMsg.innerText = 'Veuillez entrer votre nom'))
      }
    }

    // Fonction de contrôle pour le champ de l'adresse
    function controlAddress() {
      const okAddress = contact.address
      if (addressRegex.test(okAddress)) {
        return true
      } else {
        let addressErrorMsg = document.getElementById('addressErrorMsg')
        alert((addressErrorMsg.innerText = 'Veuillez entrer votre adresse'))
      }
    }

    // Fonction de contrôle pour le champ de la ville
    function controlCity() {
      const okAddress = contact.city
      if (communeRegex.test(okAddress)) {
        return true
      } else {
        let cityErrorMsg = document.getElementById('cityErrorMsg')
        alert((cityErrorMsg.innerText = 'Veuillez entrer votre ville'))
      }
    }

    // Fonction de contrôle pour le champ de l'email
    function controlEmail() {
      const okEmail = contact.email
      if (emailRegex.test(okEmail)) {
        return true
      } else {
        let emailErrorMsg = document.getElementById('emailErrorMsg')
        alert((emailErrorMsg.innerText = 'Veuillez entrer votre mail'))
      }
    }

    // Fonction de contrôle globale pour tous les champs du formulaire
    function okControl() {
      if (
        controlFirstName() &&
        controlName() &&
        controlAddress() &&
        controlCity() &&
        controlEmail()
      ) {
        // Si tous les champs sont valides, on stocke l'objet contact dans le local storage
        localStorage.setItem('contact', JSON.stringify(contact))
        return true
      } else {
        alert('Merci de vérifier les données du formulaire')
      }
    }

    // Création d'un tableau avec les ID des produits de la commande
    let products = []
    for (let p of cart) {
      products.push(p.id)
    }

    // Création d'un objet contenant les données du formulaire et les produits sélectionnés
    const sendFormData = {
      contact,
      products,
    }

    // Vérification de la quantité des produits
    if (products.length === 0) {
      alert('Veuillez sélectionner au moins un produit')
      window.location.href = 'cart.html'
    }

    // Configuration de la requête POST pour envoyer le formulaire au serveur
    const options = {
      method: 'POST',
      body: JSON.stringify(sendFormData),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // Envoi de la requête au serveur
    fetch('http://localhost:3000/api/products/order', options)
      .then((response) => response.json())
      .then((data) => {
        // Stockage de l'ID de la commande dans le local storage
        localStorage.setItem('orderId', data.orderId)
        // Si le contrôle des champs est OK, redirection vers la page de confirmation avec l'ID de commande
        if (okControl()) {
          document.location.href = 'confirmation.html?id=' + data.orderId
        }
      })
  }) // Fin de l'eventListener postForm
}

// Appel de la fonction postForm
postForm()

// FIN FORMULAIRE //