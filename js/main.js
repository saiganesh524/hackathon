// alert("working");
let bikes;
let productCompareLimit = 5;
const bikeProduct = document.querySelector("#products-data");
const homeResult = document.querySelector("#results-display");
const mobileResult = document.querySelector("#mobile-results-display");
const loadmore = document.querySelector(".load");
window.onload = function () {
    fetch("./data/data.json")
        .then(response => response.json())
        .then(data => {
            bikes = data;
            // console.log(bikes);
            let cardEnd = bikes.length, cardStart = 0, cardLimit = 8;
            // console.log(cardEnd);
            for (cardStart; cardStart <= cardLimit; cardStart++) {
                let output = displays(bikes[cardStart]);
                bikeProduct.innerHTML += output;
            }
            displayProducts(bikes);
            addToCompare(bikes);
            searchingProducts();
            homeResult.innerHTML = `<p>Showing 1 – ${cardStart} of ${cardEnd} results for "Bikes"</p>`;
            mobileResult.innerHTML = `<p>Showing 1 – ${cardStart} of ${cardEnd} results for "Bikes"</p>`;
            loadMoreCards(bikes, cardStart, cardEnd, cardLimit);
            searchingProducts();
        })
        .catch(function (err) {
            console.log(err);
        }
        );
}

function displays(product) {
    let output = `<div class="card-product">
                        <div class="wishlist-icon">
                            <p class="heart-icon"><i class="fa-regular fa-heart" onclick="wishlist(this);"></i></p>
                        </div>
                        <div class="product-image-container">
                            <img class="product-image" src="${product.image}" alt="${product.productName}">
                        </div>
                        <div class="product-details">
                            <p class="product-name">${product.productName}</p>
                        </div>
                        <div class="rating">
                            ${reviewStars(product.ratings)}
                        </div>
                        <div class="price">
                            <p class="listprice">₹${product.price}/-</p>
                        </div>
                        <div class="mobilebutton">
                            <button id=${product.id} class="add-to-comp">Add to Compare</button>
                            <button class="addtocart" onclick="addtocart()">Add to cart</button>
                        </div>
                    </div>`
    return output;
}

/****  To get the ratings and display from json by checking count of star rating  ****/

function reviewStars(ratings) {
    let out = ``;
    for (let i = 1; i <= ratings; i++) {
        out += `<i class="fa fa-star checked" aria-hidden="true"></i>`;
    }
    for (let i = 1; i <= 5 - ratings; i++) {
        out += `<i class="fa fa-star" aria-hidden="true"></i>`;
    }
    return out;
}

/**** On click of LoadMore Button, displays the remaining cards in json ****/

function loadMoreCards(bikes, cardStart, cardEnd, cardLimit) {
    let currentCards = cardStart;
    loadmore.addEventListener('click', () => {
        for (currentCards; (currentCards <= cardStart + cardLimit) && (currentCards != cardEnd); currentCards++) {
            let output = displays(bikes[currentCards]);
            bikeProduct.innerHTML += output;
        }
        homeResult.innerHTML = `<p>Showing 1 – ${currentCards} of ${cardEnd} results for “Bikes”</p>`;
        mobileResult.innerHTML = `<p>Showing 1 – ${currentCards} of ${cardEnd} results for "Bikes"</p>`;
        addToCompare(bikes);
        displayProducts(bikes);
        cardStart = currentCards;
        if (cardStart == cardEnd) {
            loadmore.style.display = "none";
        }
    });
}

document.getElementById("scroll").addEventListener("click", function () {
    //document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

/**** To make the cards wishlisted when heart is clicked ****/
var c = 0;
function wishlist(a) {
    for (const className in a.classList) {
        const element = a.classList[className];
        if (element === "fa-regular") {
            a.classList.remove("fa-regular");
            a.classList.add("fa-solid");
            a.classList.add("heart");
            c = c + 1;
        } else if (element === "fa-solid") {
            a.classList.add("fa-regular");
            a.classList.remove("fa-solid");
            a.classList.remove("heart");
            c = c - 1;
        }
    }
    if (c != 0) {
        document.getElementById("wishlist").style.display = "initial";
        document.getElementById("wishlist").innerHTML = c;
    }
    else {
        document.getElementById("wishlist").style.display = "none";
    }
}

// -------------------------------------add to cart function-----------------------------
const cart = document.getElementById('cart');
const mobileCart = document.getElementById('mobile-cart')
let increment = 0;
function addtocart() {
    increment += 1;
    console.log(increment)
    cart.style.backgroundColor = "#FF3465";
    cart.innerHTML = increment;
}

//---------------------------------price range filter---------------------------------------
const rangeInput = document.querySelectorAll(".range-input input"),
    priceInput = document.querySelectorAll(".price-input input"),
    range = document.querySelector(".slider .progress");
let priceGap = 1000;
rangeInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(rangeInput[0].value),
            maxVal = parseInt(rangeInput[1].value);

        if ((maxVal - minVal) < priceGap) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = maxVal - priceGap
            } else {
                rangeInput[1].value = minVal + priceGap;
            }
        } else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});

/**** To display the products by searching ****/

function searchingProducts() {
    let input, product, transformTxt, productName, txtValue;
    input = document.getElementById("myInput");
    transformTxt = input.value.toUpperCase();
    product = document.querySelectorAll(".card-product");
    for (const element of product) {
        productName = element.getElementsByClassName("product-name")[0];
        // console.log(productName);
        txtValue = productName.textContent || productName.innerText;
        // console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(transformTxt) > -1) {
            element.style.display = "";
        } else {
            element.style.display = "none";
        }
    }
}


/**** To display the dialogbox modal when each card is clicked  ****/

function displayProducts(bikes) {
    let modalBox = document.getElementById("modalBox"),
        cardBike = document.querySelectorAll(".product-image"),
        closeBtn = document.getElementsByClassName("modal-close")[0],
        cardImage = document.querySelector(".modal-image"),
        cardName = document.querySelector(".modal-name");
    // console.log(cardBike);
    for (let item = 0; item < cardBike.length; item++) {
        cardBike[item].addEventListener('click', () => {
            document.querySelector("body").style.overflowY = "hidden";
            modalBox.style.display = "block";
            cardName.innerHTML = `<h3>${bikes[item].productName}<\h3>`;
            cardImage.innerHTML = `<img src="${bikes[item].image}" alt="Image not supported">`;
        });
        closeBtn.addEventListener('click', () => {
            modalBox.style.display = "none";
            document.querySelector("body").style.overflowY = "visible";
        });
    }
}

/****Function to compare products (add to compare) ****/

function addToCompare(bikes) {
    let addCompareBtn = document.querySelectorAll(".add-to-comp"),
        compareList = document.querySelector(".compare-list"),
        compareBar = document.getElementById("home-comparision-bar"),
        compareCount = document.querySelector(".compare-count"),
        compareBtn = document.querySelector("#compare-btn"),
        closeBtn = document.querySelector("#modalcomp-close");
    // console.log(addCompareBtn);
    for (let i = 0; i < addCompareBtn.length; i++) {
        compareBtn.style.visibility = "hidden";
        addCompareBtn[i].addEventListener("click", (btn) => {
            let count = compareList.childElementCount;
            if (count < productCompareLimit) {
                compareBar.style.display = "flex";
                compareBar.style.flexDirection = "row-reverse";
                compareList.innerHTML += `<div id=${bikes[i].id} class="compare-content">
                                            <span id="compare-close" parentid=${bikes[i].id} onclick="closeProductCompare(this)">&times;</span>
                                            <img src=" ${bikes[i].image}" > 
                                            <p>${bikes[i].productName} </p>    
                                          </div>`;
                count += 1;
                if (count > 1) {
                    console.log(count, "in");
                    compareBtn.style.visibility = "visible";
                    compareCount.innerHTML = `<p> (${count}/${productCompareLimit}) </p>`;
                }
                btn.target.setAttribute('disabled', true);
            }
            else {
                window.alert('comparision limit reached');
            }
        });
        closeBtn.addEventListener('click', (btn) => {
            compareBar.style.display = "none";
            compareBtn.style.visibility = "hidden";
            compareList.innerHTML = '';
            compareCount.innerHTML = '';
            addCompareBtn[i].style.display = "block";
            remove[i].style.display = "none";
            for (let item of document.getElementsByClassName('mobilebutton')) {
                item.getElementsByClassName('add-to-comp')[0].removeAttribute('disabled', false);
            }
        });
    }
}

function closeProductCompare(btn) {
    let productCard = btn.parentElement,
        productCompareList = productCard.parentElement,
        totalCards = productCompareList.childElementCount,
        closeCompareBtn = document.getElementById('modalcomp-close');
    if (totalCards === 1) {
        closeCompareBtn.click();
    }
    else {
        document.getElementsByClassName('mobilebutton')[productCard.getAttribute('id') - 1].
            getElementsByClassName('add-to-comp')[0].removeAttribute('disabled');
        productCard.remove();
        
    }
    updateProductCompareCount();
}

function updateProductCompareCount() {
    let compareList = document.querySelector(".compare-list"),
        compareCount = document.querySelector(".compare-count"),
        count = compareList.childElementCount;
    compareCount.innerHTML = count > 1 ? `<p> (${count}/${productCompareLimit}) </p>` : '';
}

function showCompareproductView() {
    toggleCompareproductView();
    let compareList = document.getElementsByClassName('compare-list')[0];
    let compareContent = document.querySelectorAll('.compare-content');
    let compareValues = document.getElementsByClassName('compare-values')[0];
    let closeBtn = document.querySelector("#modal-close");
    console.log(compareList, compareContent[0]);
    let cardIds = [];
    for (let i = 0; i < compareContent.length; i++) {
        cardIds[i] = compareContent[i].getAttribute("id");
        console.log(cardIds[i]);
    }
    for (const element of cardIds) {
        compareValues.innerHTML += `
                        <div class="compare-card">
                            <div class="compare-name"> <h4>${bikes[element - 1].productName}</h4> </div>
                            <div  class="compare-img compare-image"> <img src="${bikes[element - 1].image}" alt ="${bikes[element - 1].image}"></div>
                            <div> <h4>₹${bikes[element - 1].price}/-</h4> </div>
                            <div> <h4>${bikes[element - 1].displacement}cc</h4> </div>
                            <div> <h4>${bikes[element - 1].mileageArai}kmpl</h4> </div>
                            <div> <h4>${bikes[element - 1].mileageOwnerReported}kmpl</h4> </div>
                            <div> <h4>${bikes[element - 1].ridingRange}Km</h4> </div>
                            <div> <h4>${bikes[element - 1].topSpeed}Kmph</h4> </div>
                            <div> <h4>${bikes[element - 1].fuelTankCapacity}litres</h4> </div>
                            <div> <h4>${bikes[element - 1].emissionStandard}</h4> </div>
                            <div> <h4>${bikes[element - 1].fuelType}</h4> </div>
                            <div> <h4>${bikes[element - 1].frontBrakeType}</h4> </div>
                            <div> <h4>${bikes[element - 1].frontBrakeSize}mm</h4> </div>
                            <div> <h4>${bikes[element - 1].rearBrakeType}</h4> </div>
                            <div> <h4>${bikes[element - 1].rearBrakeSize}mm</h4> </div>
                            <div> <h4>${bikes[element - 1].wheelType}</h4> </div>
                            <div> <h4>${bikes[element - 1].frontWheelSize}inch</h4> </div>
                            <div> <h4>${bikes[element - 1].rearWheelSize}inch</h4> </div>
                            <div> <h4>${bikes[element - 1].kerbWeight}kg</h4> </div>
                            <div> <h4>${bikes[element - 1].seatHeight}mm</h4> </div>
                            <div> <h4>${bikes[element - 1].groundClearance}mm</h4> </div>
                            <div> <h4>${bikes[element - 1].overallLength}mm</h4> </div>
                            <div> <h4>${bikes[element - 1].overallWidth}mm</h4> </div>
                            <div> <h4>${bikes[element - 1].overallHeight}mm</h4> </div>
                            <div> <h4>${bikes[element - 1].wheelBase}mm</h4> </div>
                            <div> <h4>${bikes[element - 1].standardWarranty}Years</h4> </div>
                            <div> <h4>${bikes[element - 1].standardWarrantyKm}Km</h4> </div>

                        </div>`;
    }
    closeBtn.addEventListener('click', () => {
        console.log(compareValues, "close");
        compareValues.innerHTML = '';
        document.getElementById('home-comparision-bar').style.display = 'none';
    });
    // document.getElementsByClassName('compare-products')[0].getElementsByClassName('row')[0].appendChild(compareList.cloneNode(true));
}

function showHomeView() {
    toggleCompareproductView(false);
}

function toggleCompareproductView(showCompareProduct = true) {
    let homeContent = document.getElementsByClassName('page-one-content')[0],
        compareContent = document.getElementsByClassName('compare-products')[0];

    homeContent.style.display = showCompareProduct ? 'none' : 'inline';
    compareContent.style.display = showCompareProduct ? 'inline' : 'none';
}
