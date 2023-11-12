

// déclaration de la variable "addProductLocalStorage" dans laquelle on met les key et les value qui sont dans le local storage
let addToCart = []
cart = localStorage.getItem('addToCart')

// Affichage des produits dans le panier
// Si panier vide = message
if (cart === null) {
  addToCart = []

  alert('Votre panier est vide')
  console.log('localStorage vide')
} else {
  //JSON.parse prend une chaine de caractère et la transforme en objet ou tableau ou données complexes
  cart = JSON.parse(cart)

  const cartItems = document.getElementById('cart__items')

  // Afficher les produits du Local Storage sur la page panier
  // Fetch pour recuperr l'ensemble des produits car il faut rajouter les imgs le prix etc qui ne sont pas dans le localStorage
  // let url = `http://localhost:3000/api/products/${id}`
  let url = 'http://localhost:3000/api/products/'
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      showData(data)
    })
  function showData(data) {
    cart.forEach((productInCart) => {
      // Elément article
      const article = document.createElement('article')
      article.className = 'cart__item'
      article.dataset.id = productInCart.id
      article.dataset.color = productInCart.color
      cartItems.appendChild(article)

      // Div img
      const divImg = document.createElement('div')
      divImg.classList.add('cart__item__img')
      article.appendChild(divImg)

      // Image
      const image = document.createElement('img')
      divImg.appendChild(image)

      let imageSrc
      data.map((p) => {
        if (p._id == productInCart.id) {
          imageSrc = p.imageUrl
        }
      })
      image.src = imageSrc

      let imageAlt
      data.map((p) => {
        if (p._id == productInCart.id) {
          imageAlt = p.altTxt
        }
      })
      image.alt = imageAlt

      //  Div content item
      const divContent = document.createElement('div')
      divContent.className = 'cart__item__content'
      article.appendChild(divContent)

      //  Description item
      const divContentDescription = document.createElement('div')
      divContentDescription.className = 'cart__item__content__description'
      divContent.appendChild(divContentDescription)

      // Title item
      const h2Name = document.createElement('h2')
      divContentDescription.appendChild(h2Name)
      h2Name.innerText = data.name

      let h2NameInnerText
      data.map((p) => {
        if (p._id === productInCart.id) {
          h2NameInnerText = p.name
        }
      })
      h2Name.innerText = h2NameInnerText

      // Color item
      const color = document.createElement('p')
      color.innerText = productInCart.color
      divContentDescription.appendChild(color)

      // Price item
      const price = document.createElement('p')
      divContentDescription.appendChild(price)
      let priceInnerText
      data.map((p) => {
        if (p._id === productInCart.id) {
          priceInnerText = p.price + '€'
        }
      })
      price.innerText = priceInnerText

      // Item settings
      const divSettings = document.createElement('div')
      divSettings.className = 'cart__item__content__settings'
      divContent.appendChild(divSettings)

      //Setting quantity
      const divSettingsQuantity = document.createElement('div')
      divSettingsQuantity.className = 'cart__item__content__settings__quantity'
      divSettings.appendChild(divSettingsQuantity)

      // On crée un élément p
      const qte = document.createElement('p')
      qte.textContent = 'Qté : '
      divSettingsQuantity.appendChild(qte)

      // Input quantity
      const input = document.createElement('input')
      input.type = 'number'
      input.classList.add('itemQuantity')
      input.class = 'itemQuantity'
      input.name = 'itemQuantity'
      input.min = '1'
      input.max = '100'
      input.setAttribute('value', productInCart.quantity)
      divSettingsQuantity.appendChild(input)

      // Delete item
      const divSettingsDelete = document.createElement('div')
      divSettingsDelete.className = 'cart__item__content__settings__delete'
      divSettings.appendChild(divSettingsDelete)

      // On crée un élément p
      const buttonDelete = document.createElement('p')
      buttonDelete.className = 'deleteItem'
      buttonDelete.innerText = 'Supprimer'
      divSettingsDelete.appendChild(buttonDelete)

      // ...........................................
      // ...........................................

      // On crée la constante product
      const product = {
        id: productInCart.id,
        color: productInCart.color,
        quantity: ('value', productInCart.quantity),
        price: price.innerText,
        name: h2NameInnerText,
        image: imageSrc,
        altText: imageAlt,
      }
      console.log(product)
      console.log(productInCart)
      //..............................................................................
      //..............................................................................

      //....Fonction qui calcule la quantité et le prix des produits du panier........
      //..............................................................................
      async function totalPriceQuantity() {
        let totalPrice = 0
        let totalQty = 0

        if (cart.length != 0) {
          for (let j = 0; j < cart.length; j++) {
            let productInCart = cart[j]
            //  const product = await (product.id);
            totalPrice +=
              parseInt(productInCart.quantity) * parseInt(product.price)
            totalQty += parseInt(productInCart.quantity)
          }
        }

        const finalQty = document.getElementById('totalQuantity')
        finalQty.innerHTML = totalQty

        const finalPrice = document.getElementById('totalPrice')
        finalPrice.innerHTML = totalPrice
      }
      totalPriceQuantity()
      //....Fonction qui modifie la quantité..........................................
      //..............................................................................

      function changeQuantity() {
        const changedQuantity = document.getElementsByClassName('itemQuantity')

        for (let j = 0; j < changedQuantity.length; j++) {
          changedQuantity[j].addEventListener('change', function (event) {
            event.preventDefault()
            // ParseInt permet de changer un nombre en string
            cart[j].quantity = parseInt(event.target.value)

            if (cart[j].quantity < 0 || cart[j].quantity > 100) {
              alert(
                'Veuillez sélectionner une quantité comprise entre 1 et 100'
              )
              window.location.href = 'cart.html'
            } else {
              localStorage.setItem('addToCart', JSON.stringify(cart))
              totalPriceQuantity()
            }
          })
        }
      }
      // Fin de la fonction, changeQuantity()
      // totalPriceQuantity()

      changeQuantity()
      //..............................................................................
      //..............................................................................

      //....Fonction qui supprime un produit..........................................
      //..............................................................................

      function deleteProducts() {
        const deleteItem = document.getElementsByClassName('deleteItem')
        for (let d = 0; d < deleteItem.length; d++) {
          deleteItem[d].addEventListener('click', (event) => {
            event.preventDefault()

            // On enregistre l'id et la couleur séléctionnée par le bouton "supprimer"
            cart = cart.filter(
              (element) =>
                element.id !== productInCart.id ||
                element.color !== productInCart.color
            )

            // On envoie les nouvelles données dans le localStorage
            localStorage.setItem('addToCart', JSON.stringify(cart))

            // On avertit de la suppression et on recharge la page
            alert('Votre article a bien été supprimé.')

            window.location.href = 'cart.html'

            // On calcule le prix et la quantité
            totalPriceQuantity()
          })
        }
      }
      // Fin de la fonction, deleteProducts(products)

      deleteProducts()
      // .............................................................................
      // .............................................................................
    })
  }
}
//....Fin du else si des produits sont dans le panier.........................
// .............................................................................






//....Fonction de validation du formulaire......................................
//..............................................................................

//On envoi le formulaire dans le serveur
function postForm() {
  const order = document.getElementById('order')
  order.addEventListener('click', (event) => {
    event.preventDefault()

    //On récupère les données du formulaire dans un objet
    const contact = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      email: document.getElementById('email').value,
    }

    // On crée des variables de test
    const communeRegex = /^[a-zA-ZéèêëàâäôöîïùûüçÉÈÊËÀÂÄÔÖÎÏÙÛÜÇ\s-]+$/
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/
    ///^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/

    // On contrôle la validation des entrées de contact

    //On contrôle le prénom
    function controlFirstName() {
      const okFirstName = contact.firstName
      if (communeRegex.test(okFirstName)) {
        return true
      } else {
        let firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
        alert((firstNameErrorMsg.innerText = 'Veuillez entrer votre prénom'))
      }
    }

    // On contrôle le nom
    function controlName() {
      const okName = contact.lastName
      if (communeRegex.test(okName)) {
        return true
      } else {
        let lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
        alert((lastNameErrorMsg.innerText = 'Veuillez entrer votre nom'))
      }
    }

    // On contrôle l' adresse
    function controlAddress() {
      const okAddress = contact.address
      if (addressRegex.test(okAddress)) {
        return true
      } else {
        let addressErrorMsg = document.getElementById('addressErrorMsg')
        alert((addressErrorMsg.innerText = 'Veuillez entrer votre adresse'))
      }
    }

    // On contrôle la ville
    function controlCity() {
      const okAddress = contact.city
      if (communeRegex.test(okAddress)) {
        return true
      } else {
        let cityErrorMsg = document.getElementById('cityErrorMsg')
        alert((cityErrorMsg.innerText = 'Veuillez entrer votre ville'))
      }
    }

    // On contrôle l' email
    function controlEmail() {
      const okEmail = contact.email
      if (emailRegex.test(okEmail)) {
        return true
      } else {
        let emailErrorMsg = document.getElementById('emailErrorMsg')
        alert((emailErrorMsg.innerText = 'Veuillez entrer votre mail'))
      }
    }

    // On contrôle que les entrées de contact soient correctes
    function okControl() {
      if (
        controlFirstName() &&
        controlName() &&
        controlAddress() &&
        controlCity() &&
        controlEmail()
      ) {
        // On envoie l'objet contact dans le local storage
        localStorage.setItem('contact', JSON.stringify(contact))
        return true
      } else {
        alert('Merci de vérifier les données du formulaire')
      }
    }
    // okControl()

    // On crée un tableau avec les id des produits de la commande
    let products = []
    for (let p of cart) {
      products.push(p.id)
    }

    // On met les valeurs du formulaire et les
    // produits sélectionnés dans un objet qui contient contact et products
    const sendFormData = {
      contact,
      products,
    }
    // clef contenant les contacts et les produits
    console.log(sendFormData)

    if (products.quantity == 0) {
      alert('Veuillez sélectionner une quantité comprise entre 1 et 100')
      window.location.href = 'cart.html'
    }
    // On envoie le formulaire + localStorage (sendFormData),
    // au serveur avec la méthode POST
    const options = {
      method: 'POST',
      body: JSON.stringify(sendFormData),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    fetch('http://localhost:3000/api/products/order', options)
      .then((response) => response.json())

      .then((data) => {
        localStorage.setItem('orderId', data.orderId)
        if (okControl()) {
          document.location.href = 'confirmation.html?id=' + data.orderId
        }
      })
  }) // fin de l' eventListener postForm
} // fin de la function postForm()
postForm()

// ...................................................................................
// ...................................................................................


