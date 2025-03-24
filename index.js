

let products = [
  {
    name: 'Fastrack Radiant FX4 Premium Metal',
    price: 5495,
    imgUrl: 'img1.jpg',
    type: 'men',
    id: 1,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin velnulla id orci gravida ullamcorper.",
    quantity: 0
  },
  {
    name: 'Fastrack Radiant FX1 Luxury Metal',
    price: 4999,
    imgUrl: 'img2.jpg',
    type: 'men',
    id: 2,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin velnulla id orci gravida ullamcorper.",
    quantity: 0
  },
  {
    name: 'Fastrack Vyb Challenger Quartz Analog',
    price: 1695,
    imgUrl: 'img3.jpg',
    type: 'men',
    id: 3,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin velnulla id orci gravida ullamcorper.",
    quantity: 0
  },
  {
    name: 'Fastrack Radiant FX4 Premium Metal',
    price: 1200,
    imgUrl: 'img4.jpg',
    type: 'men',
    id: 4,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin velnulla id orci gravida ullamcorper.",
    quantity: 0
  },
  {
    name: 'Fastrack Rogue with 3.5 CM UltraVU',
    price: 6000,
    imgUrl: 'img5.jpg',
    type: 'women',
    id: 5,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin velnulla id orci gravida ullamcorper.",
    quantity: 0
  },
  {
    name: 'Fastrack Vyb Challenger Quartz Analog',
    price: 4000,
    imgUrl: 'img6.jpg',
    type: 'women',
    id: 6,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin velnulla id orci gravida ullamcorper.",
    quantity: 0
  },
  {
    name: 'Fastrack I Love Me Quartz Analog',
    price: 4500,
    imgUrl: 'img7.jpg',
    type: 'women',
    id: 7,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin velnulla id orci gravida ullamcorper.",
    quantity: 0
  },
  {
    name: 'Fastrack Quartz Analog Silver Dial',
    price: 3200,
    imgUrl: 'img8.jpg',
    type: 'women',
    id: 8,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin velnulla id orci gravida ullamcorper.",
    quantity: 0
  }
]

function goToProduct(id) {
  let product = products.find(product => product.id === id); 
  window.location.href = "product.html?id=" + id;
}

function loadProduct() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id');
  let product = id ? products.find(product => product.id === +(id)) : products[0];
  let container = document.getElementsByClassName('product-container')[0];
  container.innerHTML = '';
  container.innerHTML = `
    <div class="col-md-6 text-center">
      <img
        src="../imgs/${product.imgUrl}"
        alt="${product.name}"
        class="img-fluid rounded"
      />
    </div>
    <div class="col-md-6">
      <h2>${product.name}</h2>
      <h4 class="text-primary">${product.price}</h4>
      <p>${product.desc}</p>
      <button class="btn btn-success" onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `
  //view item
  if (window.Evergage) {
    Evergage.sendEvent({
      itemAction: Evergage.ItemAction.ViewItem,
      catalog: {
        Product: {
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          imageUrl: `../imgs/${product.imgUrl}`,
          description: product.desc
        }
      }
    });
  }
}

function addToCart(id) {
  let addedItems = [];
  let product = products.find(product => product.id === +(id));
  addedItems = JSON.parse(localStorage.getItem('products'));
  if (addedItems && addedItems.length > 0) {
    let index = addedItems.findIndex(product => product.id === +(id));
    if (index != -1) {
      addedItems[index].quantity += 1;
      localStorage.setItem('products', JSON.stringify(addedItems));      
    } else {
      addedItems.push({...product, quantity: 1});
    }
  } else {
    addedItems = [{...product, quantity: 1}];
  }
  localStorage.setItem('products', JSON.stringify(addedItems));
  loadCart();

  // Evergage Add to Cart Tracking
  if (window.Evergage) {
    const lineItem = {
      _id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1, 
    };

    Evergage.sendEvent({
      itemAction: Evergage.ItemAction.AddToCart,
      cart: {
        singleLine: {
          Product: lineItem,
        },
      },
    });
    console.log("Evergage Add to Cart event fired:", lineItem);
    
  }
}


function loadCart() {
  document.getElementById("cart-count");
  let products = JSON.parse(localStorage.getItem("products"));
  if (products) {
    document.getElementById("cart-count").textContent = products.reduce((sum, item) => sum + item.quantity, 0);
  } else {
    document.getElementById("cart-count").textContent = 0;
  }
}

function goToCart() {

  window.location.href = "cart.html";
}

function loadCartItems() {
  let products = JSON.parse(localStorage.getItem("products"));
  let cartContainer = document.getElementById("cart-container");
  let cartTotal = document.getElementById("cart-total-price");
  cartContainer.innerHTML = "";

  let total = 0;

  products?.forEach((item, index) => {
    let cartItem = document.createElement("tr");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td class="action-icons">
          <div class="quantity-controls">
              <button type="button" class="quantity-btn" onclick="changeQuantity(${item.id}, 'minus')">-</button>
              <span>${item.quantity}</span>
              <button  type="button" class="quantity-btn" onclick="changeQuantity(${item.id}, 'add')">+</button>
              <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
      </td>
    `
    cartContainer.appendChild(cartItem);
    total += (item.price * item.quantity);
  });

  cartTotal.innerText = total.toFixed(2);
  let elem = document.getElementById('btn-purchase-icon');
  if (products && products.length > 0) {
    elem.getElementsByClassName('btn-purchase')[0].style.display = 'block';
  } else {
    elem.getElementsByClassName('btn-purchase')[0].style.display = 'none';
  }
}

function changeQuantity(id, method) {
  // console.log(item)
  let products = JSON.parse(localStorage.getItem("products"));
  let index = products.findIndex(product => product.id === id);
  if (index !== -1) {
    products[index].quantity = method == 'add' ? products[index].quantity + 1 : products[index].quantity - 1;
    if (products[index].quantity <= 0) {
      products.splice(index, 1);
    }
    localStorage.setItem("products", JSON.stringify(products));
    loadCartItems();
  }
}

function removeFromCart(id) {
  let products = JSON.parse(localStorage.getItem("products"));
  let index = products.findIndex(product => product.id === id);

  if (index != -1) {
    const removedProduct = products[index];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadCartItems(); 
  
  // Evergage Remove from Cart Event
  if (window.Evergage) {
    const lineItem = {
      _id: removedProduct.id.toString(),
      name: removedProduct.name,
      price: removedProduct.price,
      imageUrl: `../imgs/${removedProduct.imgUrl}`,
      quantity: removedProduct.quantity, 
    };

    Evergage.sendEvent({
      itemAction: Evergage.ItemAction.RemoveFromCart,
      cart: {
        singleLine: {
          Product: lineItem,
        },
      },
    });         
    
  }
}
}

function loadProducts(type) {
  let filteredProducts = [];
  if (type === 'all') {
    filteredProducts = JSON.parse(JSON.stringify(products));
  } else {
    filteredProducts = products.filter(product => product.type === type);
  }
  let container = document.getElementsByClassName('product-container')[0];
  container.innerHTML = '';
  filteredProducts.map(product => {
    let column = createElement('div', ['col', 'filter-item', 'all', 'new']);
    column.innerHTML = `
      <div class="card h-100 product" onclick="goToProduct(${product.id})">
        <img src="../imgs/${product.imgUrl}" class="card-img-top shop-item-image" alt="...">
        <div class="card-body">
          <h5 class="card-title shop-item-title">${product.name}</h5>
          <p class="card-text shop-item-price">$${product.price}</p>
          <button type="button" style="width: 100%;" class="btn btn-warning mt-auto shop-item-button" onclick="goToProduct(${product.id})">View</button>
        </div>
      </div>
    `;
    container.appendChild(column);
  })
  
  if (window.Evergage) {
    Evergage.sendEvent({
      itemAction: Evergage.ItemAction.ViewCategory,
      catalog: {
        Category: {
          id: type, 
          name: type.charAt(0).toUpperCase() + type.slice(1), 
          productCount: filteredProducts.length, 
        },
      },
    });
    console.log("Evergage View Category event fired:", type); 
  }
}

function createElement(type, classNames) {
  let elem = document.createElement(type);
  classNames.forEach(name => {
    elem.classList.add(name);
  })
  return elem
}

function onPurchase() {
  let products = JSON.parse(localStorage.getItem("products"));

  if (!products || products.length === 0) {
    console.error("No products in the cart to purchase.");
    return;
  }

  let totalValue = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let orderId = `ORDER_${Date.now()}`;

  let lineItems = products.map(item => ({
    _id: item.id.toString(), 
    name: item.name, 
    price: item.price, 
    imageUrl: `../imgs/${item.imgUrl}`, 
    quantity: item.quantity, 
  }));

  // Evergage Purchase Event
  if (window.Evergage) {
    Evergage.sendEvent({
      itemAction: 'Purchase',
      order: {
        Product: {
          orderId: orderId,
          totalValue: totalValue, 
          currency: 'INR', 
          lineItems: lineItems, 
        },
      },
    });
    console.log("Evergage Purchase event fired:", { orderId, totalValue, lineItems }); 


  let elem = document.getElementById('btn-purchase-icon');
  if (elem) {
    elem.innerHTML = 'Thank you for your purchase';
  } else {
    console.error("Element with ID 'btn-purchase-icon' not found.");
  }

  
  if (typeof Storage !== "undefined") {
    localStorage.setItem('products', JSON.stringify([]));
  } else {
    console.error("LocalStorage is not supported in this browser.");
  }

  if (typeof loadCartItems === "function") {
    loadCartItems();
  } else {
    console.error("loadCartItems function is not defined.");
  }
}
}

function ready() {
  var removeCartItemButton = document.getElementsByClassName("btn-danger");
  for (var i = 0; i < removeCartItemButton.length; i++) {
    var button = removeCartItemButton[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", purchaseClicked);
}

function purchaseClicked() {
  alert("Thank you for your purchase!!!");

  var cartItems = document.getElementsByClassName("cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();

}
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();



  }

function addItemToCart(title, price, imageSrc) {
console.log("item added to cart");


  var cartRow = document.createElement("tr");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");

  for (i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("This item already has added to the cart!");
      return;
    }
  }
  var cartRowContents = `

        <td class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
            <span class="cart-item-title">${title}</span>                  
        </td>
        <td class="cart-item cart-column">
            <span class="cart-price cart-column">${price}</span>
        </td>
        <td class="cart-item cart-column">
            <input class="cart-quantity-input" type="number" value="1" style="width: 50px">
            <button class="btn btn-danger" type="button">Remove</button>
        </td>        
    `;

  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
 
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("Rs ", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "Rs " + total + ".00";
}

function checkEvergage() {
  if (window.Evergage && typeof Evergage.init === "function") {
    console.log("Evergage Loaded");

    let currentPage = window.location.pathname;

    if (currentPage.includes("watches.html")) {
      Evergage.sendEvent({
        action: "Watch Page",
      });
    } else if (currentPage.includes("index.html")) {
      Evergage.sendEvent({
        action: "Home Page",
      });
    }
  } else {
    console.log("Waiting for Evergage...");
    setTimeout(checkEvergage, 500);
  }
}
