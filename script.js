const products = [
    {
        name: "Luxury Watch",
        price: 4500,
        category: "watch",
        image: "images/watch.jpg"
    },
    {
        name: "Leather Wallet",
        price: 2000,
        category: "leather",
        image: "images/wallet.jpg"
    },
    {
        name: "Leather Belt",
        price: 1800,
        category: "leather",
        image: "images/belt.jpg"
    }
];

let cart = [];

function displayProducts(filter = "all") {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    products
        .filter(p => filter === "all" || p.category === filter)
        .forEach((product, index) => {
            list.innerHTML += `
            <div class="product">
                <img src="${product.image}">
                <h3>${product.name}</h3>
                <p class="price">Rs. ${product.price}</p>
                <input type="number" min="1" value="1" class="quantity" id="qty${index}">
                <br><br>
                <button onclick="addToCart(${index})">Add to Cart</button>
            </div>
        `;
        });
}

function filterCategory(cat) {
    displayProducts(cat);
}

function addToCart(index) {
    const qty = document.getElementById(`qty${index}`).value;
    const product = products[index];

    cart.push({
        name: product.name,
        price: product.price,
        qty: qty
    });

    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
            <li>${item.name} x ${item.qty} = Rs. ${item.price * item.qty}</li>
        `;
    });

    document.getElementById("total").innerText = "Total: Rs. " + total;
}

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let message = "Hello, I want to order:%0A%0A";

    let total = 0;
    cart.forEach(item => {
        message += `${item.name} x ${item.qty} = Rs. ${item.price * item.qty}%0A`;
        total += item.price * item.qty;
    });

    message += `%0ATotal: Rs. ${total}`;

    const whatsappNumber = "923058961089";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

displayProducts();
