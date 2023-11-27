// CONFIRMATION

function orderConfirm() {
    // Recupération de l'id du produit
    const id = new URL(window.location.href).searchParams.get('id')
  
    // Envoyer numéro de commande sur le ticket de commande validée
    const orderId = document.getElementById('orderId')
  
    // Afficher numéro de commande
    orderId.innerHTML = id
  
    // Clean localstorage
    localStorage.clear()
  }
  
  orderConfirm();

  // FIN CONFIRMATION //