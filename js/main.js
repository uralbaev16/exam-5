const wrapper = document.querySelector(".wrapper-products");
const loading = document.querySelector(".loading");
const btn = document.querySelector(".btn");
const searchInputEl = document.querySelector(".header-inp");
const saerchDropEl = document.querySelector(".search-drop");

const BASE_URL = "https://dummyjson.com";

let limitCount = 8;  
let offset = 0;  

async function getData(endpoint, count) {
    try {
        loading.style.display = "block"; 
        const response = await fetch(`${BASE_URL}/${endpoint}?limit=${limitCount}&skip=${offset}`);
        const res = await response.json();
        createProduct(res.products);  
    } catch (err) {
        console.error("Error fetching data:", err);
    } finally {
        loading.style.display = "none";  
    }
}

getData("products", offset);

btn.addEventListener("click", () => {
    offset += limitCount;  
    getData("products", offset);
});

function createProduct(data) {
    data.forEach(product => {
        const card = document.createElement("div");
        card.dataset.id = product.id;
        card.className = "card";
        card.innerHTML = ` 
                <div class="img-card">
                    <img data-id="${product.id}" class="card_img" src="${product.images?.[0] || './images/placeholder.jpg'}" alt="${product.title}" width="115" height="180">
                    <div class="image-wrapper">
                        <img class="card_img" src="./images/like-icon.svg" alt="like" width="34" height="34">
                        <img class="card_img" src="./images/eye-icon.svg" alt="eye" width="34" height="34">
                    </div>
                </div>
                <h3 class="card-title">${product.title}</h3>
                <div class="card-wrapper">
                    <p class="card-price">$${product.price}</p>
                    <p>${`<i class="card-rate fa-solid fa-star"></i>`.repeat(Math.round(product.rating?.rate || 0))} 
                    (${product?.rating || 0})</p>
                </div>
        `;
        wrapper.appendChild(card); 
    });
}

wrapper.addEventListener("click", (e) => {
    if (e.target.closest(".card")) {
        const id = e.target.closest(".card").dataset.id;
        open(`/pages/about.html?q=${id}`, "_self");
    }
});

searchInputEl.addEventListener("keyup", async (e) => {
    const value = e.target.value.trim()
    if(value){
        saerchDropEl.style.display = "block"
        const response = await fetch(`${BASE_URL}/products/search?q=${value}&limit=5`)
        response
        .json()
        .then(res => {
            saerchDropEl.innerHTML = null
            res.products.forEach((item) =>{
                const divEl = document.createElement("div")
                divEl.className = "search-item"
                divEl.dataset.id = item.id
                divEl.innerHTML = `
                            <img src="${item.thumbnail}" alt="">
                            <p>${item.title}</p>
                `
                saerchDropEl.appendChild(divEl)
            })
        })
        .catch(err => console.error(err))
    }else{
        saerchDropEl.style.display = "none"
    }
})
saerchDropEl.addEventListener("click", e => {
    if(e.target.closest(".search-item")){
        const id = e.target.closest(".search-item").dataset.id;
        open(`/pages/about.html?q=${id}`, "_self");
    }
})

function createCategory(data) {
    ["All", ...data].forEach((category) => {
      const categoryEl = document.createElement("div");
      categoryEl.classList.add("category__item");
      categoryEl.dataset.category = category === "All" ? "/products" : `/products/category/${category.slug || category}`;//+
      categoryEl.innerHTML = `
        <div class="category__item__img">
         <i class="fa-solid fa-list"></i>
        </div>
        <p class="category__item__name">${category.name || category}</p>
      `;
      categoryCollectionEl.appendChild(categoryEl);
      categoryEl.addEventListener("click", (e) => {
         let category = e.currentTarget.dataset.category; 
         productEndpoint = category;
         productsCollectionEl.innerHTML = "";
         fetchProducts(`${category}?limit=${perPageCount}`);
         if (totalProducts <= perPageCount + (offset * perPageCount)) {
          btnSeeMore.style.display = "none";
        }
      })
    });
  }