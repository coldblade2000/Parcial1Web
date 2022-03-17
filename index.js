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
    const divElem = document.createElement("div")
    divElem.classList.add("itemcard", "col-md-3")
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
    return divElem
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

    const newCategory = data[(data.indexOf(data.find(e=>e.name===category))+1) % data.length].name
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
    title.textContent = categoryObj.name
    for (const product of categoryObj.products) {
        row.appendChild(createItem(product.name, product.description, product.price, product.image))
    }
}

const addToCart = (item) => {
    cartItems.push(item)
    const cartcount = document.getElementById("cartcount");
    cartcount.textContent = `${cartItems.length} items`
    if (cartItems.length > 0) {
        cartcount.classList.remove("d-none")
    } else {
        cartcount.classList.add("d-none")
    }
    console.log("click")
}
