let cart = [];
let totalPrice = 0;

function addToCart(name, price) {
    cart.push({name, price});
    totalPrice += price;
    displayCart();
}

function displayCart() {
    let cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} - Rs. ${item.price}`;
        cartItems.appendChild(li);
    });

    document.getElementById("total").textContent = "Total: Rs. " + totalPrice;
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Hello, I want to order:\n\n";
    cart.forEach(item => {
        message += `${item.name} - Rs. ${item.price}\n`;
    });
    message += `\nTotal: Rs. ${totalPrice}`;

    let whatsappNumber = "923058961089"; // Pakistan format
    let whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}
