// JSON: https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json


let cartItems = []
let category = "Burguers"
let data = undefined
const createItem = (name, description, price, image) => {
    /*
    <div class="itemcard col-md-3">
            <img src="assets/junior-reis-XdNgE6NIHp4-unsplash.jpg" alt="">
            <h3>Veggie Burger</h3>
            <p>Lorem ipsum lorem ipsumLorem ipsum lorem ipsumLorem ipsum lorem ipsumLorem ipsum lorem ipsum</p>
            <p>$10.01</p>
            <a href="#" class="cartbutton text-center">Add to cart</a>
        </div>
     */
    const bigCardDivElem = document.createElement("div");
    bigCardDivElem.classList.add("col-md-3")

    const divElem = document.createElement("div")
    divElem.classList.add("itemcard")
    const imgElem = document.createElement("img")
    imgElem.src = image
    const nameElem = document.createElement("h3")
    nameElem.textContent = name
    const descriptionElem = document.createElement("p")
    descriptionElem.textContent = description
    const priceElem = document.createElement("p")
    priceElem.classList.add("itemprice")
    priceElem.textContent = "$" + price.toFixed(2)

    const buttonElem = document.createElement("a")
    buttonElem.textContent = "Add to cart"
    buttonElem.classList.add("cartbutton", "text-center")
    buttonElem.addEventListener("click", () => addToCart({name, description, price, image}))

    divElem.appendChild(imgElem)
    divElem.appendChild(nameElem)
    divElem.appendChild(descriptionElem)
    divElem.appendChild(priceElem)
    divElem.appendChild(buttonElem)
    bigCardDivElem.appendChild(divElem)
    return bigCardDivElem
}
fetch('https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json')
    .then(response => response.json())
    .then(res => {
        data = res
        console.log(data)
        selectCategory("Burguers")
    });
const switchCategory = () => {
    const switcher = document.getElementById("category-switcher-title");

    const newCategory = data[(data.indexOf(data.find(e => e.name === category)) + 1) % data.length].name
    selectCategory(newCategory)
    switcher.innerText = category
}

const selectCategory = (selCategory) => {
    const categorytabs = document.querySelectorAll(".nav-item a")
    categorytabs.forEach((e) => {
        if (e.getAttribute("data-category") === selCategory)
            e.classList.add("active")
        else
            e.classList.remove("active")
    })
    category = selCategory
    const row = document.getElementById("itemrow")
    row.innerHTML = ""
    const title = document.getElementById("category-title")
    let categoryObj = undefined

    for (const datum of data) {
        if (datum.name === selCategory) {
            categoryObj = datum
            break;
        }
    }
    if (!orderDetailShown) title.textContent = categoryObj.name
    for (const product of categoryObj.products) {
        row.appendChild(createItem(product.name, product.description, product.price, product.image))
    }
}
///////////////////////////////////
// Order detail functions
///////////////////////////////////
let orderDetailShown = false
const toggleOrderDetail = () => {
    const title = document.getElementById("category-title")
    if (orderDetailShown) {
        title.textContent = category
        document.getElementById("itemrow").style.display = "flex"
        document.getElementById("order-detail").style.display = "none"
    } else {
        title.textContent = "ORDER DETAIL"
        document.getElementById("itemrow").style.display = "none"
        document.getElementById("order-detail").style.display = "block"
        renderOrderDetail()
    }
    orderDetailShown = !orderDetailShown
}

const renderOrderDetail = () => {
    const tbody = document.getElementById("order-detail-big-tbody");
    const smalldiv = document.getElementById("order-detail-small")
    tbody.innerText = ""
    smalldiv.innerText = ""
    for (let i = 0; i < cartItems.length; i++) {
        let cartItem = cartItems[i];
        tbody.appendChild(renderOrderDetailItemBig(cartItem, i + 1))
        smalldiv.appendChild(renderOrderDetailItemSmall(cartItem))
    }

    const totalprice = document.getElementById("totalprice")
    let price = 0
    for (const cartItem of cartItems) {
        price += cartItem.unitPrice * cartItem.quantity
    }
    totalprice.innerText = `Total: $${price.toFixed(2)}`
}
const renderOrderDetailItemBig = (item, index) => {
    const tr = document.createElement("tr");

    const itemtd = document.createElement("td");
    itemtd.textContent = index
    tr.appendChild(itemtd)

    const qtytd = document.createElement("td");
    qtytd.textContent = item.quantity
    tr.appendChild(qtytd)

    const descriptiontd = document.createElement("td");
    descriptiontd.textContent = item.description
    tr.appendChild(descriptiontd)

    const pricetd = document.createElement("td");
    pricetd.textContent = item.unitPrice.toFixed(2)
    tr.appendChild(pricetd)

    const amounttd = document.createElement("td");
    amounttd.textContent = (item.unitPrice * item.quantity).toFixed(2).toString()
    tr.appendChild(amounttd)

    const buttonstd = document.createElement("td");
    const plusdiv = document.createElement("div");
    plusdiv.innerText = "+"
    const minusdiv = document.createElement("div");
    minusdiv.innerText = "-"
    plusdiv.addEventListener("click", () => addExtraItem(item.description, true))
    minusdiv.addEventListener("click", () => addExtraItem(item.description, false))
    buttonstd.appendChild(plusdiv)
    buttonstd.appendChild(minusdiv)

    tr.appendChild(buttonstd)

    return tr
}

const renderOrderDetailItemSmall = (item) => {
    const div = document.createElement("div");
    div.classList.add("order-detail-item-small")
    const desc = document.createElement("p");
    desc.innerText = `${item.quantity} ${item.description}`

    div.appendChild(desc)

    const buttonsdiv = document.createElement("div");
    buttonsdiv.classList.add("d-flex", "flex-row")
    const plusdiv = document.createElement("div");
    plusdiv.innerText = "+"
    const minusdiv = document.createElement("div");
    minusdiv.innerText = "-"
    plusdiv.addEventListener("click", () => addExtraItem(item.description, true))
    minusdiv.addEventListener("click", () => addExtraItem(item.description, false))
    buttonsdiv.appendChild(plusdiv)
    buttonsdiv.appendChild(minusdiv)
    div.appendChild(buttonsdiv)

    return div
}

const addExtraItem = (itemDescription, increment) => {
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].description === itemDescription) {
            if (!increment && cartItems[i].quantity > 0) {
                cartItems[i].quantity = cartItems[i].quantity - 1
            } else if (increment) {
                cartItems[i].quantity = cartItems[i].quantity + 1
            }
            break;
        }
    }
    renderOrderDetail()
}
///////////////////////////////////
// Cart functions
///////////////////////////////////

const printCart = () => {
    const cartCopy = [...cartItems];
    for (let i = 0; i < cartCopy.length; i++) {
        cartCopy[i].item = i + 1;
    }
    console.log(cartCopy)
}

const cartSize = () => {
    let size = 0
    for (const cartItem of cartItems) {
        size += cartItem.quantity
    }
    return size
}

const addToCart = (item) => {
    /*
    {
        item: 1,
        quantity: 2,
        description: "Diet Coke",
        unitPrice: 4.25
    }
     */
    let found = false;
    for (let i = 0; i < cartItems.length; i++) {
        const cartItem = cartItems[i];
        if (cartItem.description === item.name) {
            found = true;
            cartItems[i].quantity = cartItem.quantity + 1
        }
    }
    if (!found) {
        cartItems.push({
            quantity: 1,
            description: item.name,
            unitPrice: item.price
        });
    }
    const cartcount = document.getElementById("cartcount");

    cartcount.textContent = `${cartSize()} items`
    if (cartItems.length > 0) {
        cartcount.classList.remove("d-none")
    } else {
        cartcount.classList.add("d-none")
    }
    console.log("click")
}
