const fruits = [
  { name: "Alphonso Mango", price: 200, img: "https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Banana", price: 100, img: "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Apple", price: 200, img: "https://images.pexels.com/photos/209339/pexels-photo-209339.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Orange", price: 150, img: "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Kiwi", price: 300, img: "https://images.pexels.com/photos/867349/pexels-photo-867349.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Grapes", price: 180, img: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Pineapple", price: 120, img: "https://images.pexels.com/photos/5945760/pexels-photo-5945760.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Watermelon", price: 80, img: "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Strawberry", price: 250, img: "https://images.pexels.com/photos/934066/pexels-photo-934066.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Papaya", price: 90, img: "https://images.pexels.com/photos/5945743/pexels-photo-5945743.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Avocado", price: 400, img: "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Dragon Fruit", price: 350, img: "https://images.pexels.com/photos/5945902/pexels-photo-5945902.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Blueberry", price: 600, img: "https://images.pexels.com/photos/70862/pexels-photo-70862.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Guava", price: 110, img: "https://images.pexels.com/photos/5945790/pexels-photo-5945790.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Cherries", price: 550, img: "https://images.pexels.com/photos/109274/pexels-photo-109274.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = JSON.parse(localStorage.getItem('total')) || 0;

function displayFruits(data) {
  const fruitList = document.getElementById('fruit-list');
  if (fruitList) {
    fruitList.innerHTML = "";
    data.forEach(fruit => {
      fruitList.innerHTML += `
        <div class="product-card">
          <img src="${fruit.img}" alt="${fruit.name}" loading="lazy" onerror="this.style.display='none';"/>
          <h3>${fruit.name}</h3>
          <p>₹${fruit.price}/kg</p>
          <input type="number" id="kg-${fruit.name}" min="0.1" step="0.1" placeholder="Enter kg (e.g., 0.5)" style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <button onclick="addToCart('${fruit.name}', ${fruit.price})">Add to Cart</button>
        </div>
      `;
    });
  }
}

function addToCart(item, price) {
  let kgInput = document.getElementById(`kg-${item}`);
  let kg = parseFloat(kgInput ? kgInput.value : 1) || 1; // Default to 1 kg if invalid
  if (kg <= 0) {
    alert('Please enter a valid kg amount!');
    return;
  }
  let existingItem = cart.find(cartItem => cartItem.item === item);
  if (existingItem) {
    existingItem.quantity += kg;
  } else {
    cart.push({ item, price, quantity: kg });
  }
  total += price * kg;
  updateCart();

  // Instant pop-up message
  alert(`Added ${item} (${kg} kg) to Cart Successfully!`);

  // Optional: Blink message on cart.html if user navigates there
  let message = document.getElementById('cartMessage');
  if (message) {
    message.textContent = `Added ${item} Successfully (${kg} kg)`;
    message.style.display = 'block';
    let blinks = 0;
    let blinkInterval = setInterval(() => {
      message.style.visibility = blinks % 2 === 0 ? 'visible' : 'hidden';
      blinks++;
      if (blinks > 6) clearInterval(blinkInterval); // Blink 3 times
    }, 500);
    setTimeout(() => message.style.display = 'none', 3000);
  }
  if (kgInput) kgInput.value = ''; // Clear input
}

function updateQuantity(index, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(index);
    return;
  }
  let oldQuantity = cart[index].quantity;
  cart[index].quantity = newQuantity;
  total += (newQuantity - oldQuantity) * cart[index].price;
  updateCart();

  // Blinking message for quantity update
  let message = document.getElementById('cartMessage');
  if (message) {
    message.textContent = `Updated ${cart[index].item} to ${newQuantity} kg`;
    message.style.display = 'block';
    let blinks = 0;
    let blinkInterval = setInterval(() => {
      message.style.visibility = blinks % 2 === 0 ? 'visible' : 'hidden';
      blinks++;
      if (blinks > 6) clearInterval(blinkInterval);
    }, 500);
    setTimeout(() => message.style.display = 'none', 3000);
  }
}

function removeFromCart(index) {
  total -= cart[index].price * cart[index].quantity;
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('total', total);
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCounts = document.querySelectorAll('#cart-count');
  if (cartItems && cartTotal) {
    cartItems.innerHTML = cart.map((item, index) => `
      <p>
        ${item.item} - ₹${item.price} x 
        <input type="number" value="${item.quantity}" min="0.1" step="0.1" onchange="updateQuantity(${index}, parseFloat(this.value))" style="width: 80px;">
        kg = ₹${(item.price * item.quantity).toFixed(2)}
        <button onclick="removeFromCart(${index})">Remove</button>
      </p>
    `).join('');
    cartTotal.textContent = total.toFixed(2);
  }
  cartCounts.forEach(count => count.textContent = cart.reduce((sum, item) => sum + 1, 0));
}

function applyCoupon() {
  const coupon = document.getElementById('coupon').value;
  const coupons = { 'FARM10': 0.9, 'FARM20': 0.8 };
  if (coupons[coupon]) {
    total *= coupons[coupon];
    alert(`${(1 - coupons[coupon]) * 100}% discount applied!`);
    updateCart();
  } else {
    alert('Invalid coupon');
  }
}

// Initialize page
if (document.getElementById('fruit-list')) {
  displayFruits(fruits);
  const searchInput = document.getElementById('search');
  let timeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const query = searchInput.value.toLowerCase();
      const filtered = fruits.filter(fruit => fruit.name.toLowerCase().includes(query));
      displayFruits(filtered);
    }, 300);
  });
}

if (document.getElementById('cart-items')) {
  updateCart();
  document.getElementById('apply-coupon').addEventListener('click', applyCoupon);
  document.getElementById('place-order').addEventListener('click', () => {
    document.getElementById('order-form').style.display = 'block';
  });
}

const orderForm = document.getElementById('order-form');
if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    const orderDetails = `Order: ${cart.map(item => `${item.item} (${item.quantity}kg)`).join(', ')}\nTotal: ₹${total}\nName: ${name}\nAddress: ${address}, ${city}\nPhone: ${phone}\nPayment: ${payment}`;
    const message = encodeURIComponent(orderDetails);
    window.open(`https://wa.me/917893867904?text=${message}`);

    cart = [];
    total = 0;
    updateCart();
    orderForm.reset();
    orderForm.style.display = 'none';
  });
}