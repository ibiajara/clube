import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, child, get} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Get the modal.
var modal = document.getElementById("myModal");

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBjp1xZR6T0fBs4uYST8PNV7rC2rUxNjpg",
  authDomain: "e-commerce-3c41b.firebaseapp.com",
  databaseURL: "https://e-commerce-3c41b-default-rtdb.firebaseio.com",
  projectId: "e-commerce-3c41b",
  storageBucket: "e-commerce-3c41b.appspot.com",
  messagingSenderId: "352196438207",
  appId: "1:352196438207:web:40360967b69b7bf4093e0a",
  measurementId: "G-86PHKPHGWE"
});

const db = getDatabase(firebaseApp);
const starCountRef = ref(db);

let idHambIcon = 1;
let nameHambIcon = 'fas fa-birthday-cake';

let fbArray = [];
let catAcais = [];

function closeModal() {
  modal.style.display = "none";
}


function showArr(arr) {
  closeModal();
  fbArray = arr;
  catAcais = arr.sorveteria.subsections[0].products;
}

window.openLanchonete = function openLanchonete(tabId) {
  var i;
  var x = document.getElementsByClassName("tabLanchonete");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  document.getElementById(tabId).style.display = "flex";
  
  var el = document.querySelectorAll('#tabsLanchonete .tabInsideLanchonete');
  for (let i = 0; i < el.length; i++) { 
    el[i].className = 'btn tabInsideLanchonete';
  }
  document.getElementById(`tab${tabId}`).className = "btn tabInsideLanchonete active";
}

window.openItensTabs = function openItensTabs(prodName, tabName, subsID) {
  var i;
  var x = document.getElementsByClassName(tabName);
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  document.getElementById(prodName).style.display = "flex";  

  var params = `#listInside1-${subsID} .btnInside`;

  var el = document.querySelectorAll(params);
  for (let i = 0; i < el.length; i++) { 
    el[i].className = 'btnInside';
  }
  document.getElementById(`subTab${prodName}`).className = "btnInside active";
}

// let refModalProd = document.getElementById("modalProduct");

// function closeFormLogin() {
//   refModalLog.classList.remove('active');
// }

let detailsModal = document.querySelector('.modal-product');
let formClose = document.querySelector('#form-close');

formClose.addEventListener('click', () =>{
  detailsModal.style.display = "none";
  detailsModal.classList.remove('active');
});

const arrayProducts = [];
const arrayPrices = [];

function convertToReal(value) {
  const valueConverted = value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
  return valueConverted;
}

function returnPrice(product) {
  console.log('arrayProducts:', arrayProducts)
  console.log('arrayPrices:', arrayPrices)
  let prices = product.prices || [];
  if(product.specialPriceId) {
    let tempPrice = arrayPrices.find(price => price.id === product.specialPriceId)
    prices = tempPrice?.prices || prices;
  } 
  console.log('prices oficial:', prices)
  const lengthArray = prices.length;
  if(lengthArray>1) {
    return `
      <span id="priceDetail">${convertToReal(prices[0]?.value)}</span>
      <div class="variationsPrices">
        ${prices.map(price => `
          <input type="radio" id="${price.value}" value="${price.value}">
          <label for="${price.value}">${convertToReal(price.value)} | ${price.description}</label><br>
        `).join('')}
      </div>
    `
  }
  return `
    <span id="priceDetail">${convertToReal(prices[0]?.value)}</span>
  ` 
}

window.openModalDetails = function openModalDetails(catId, prodId) {
  let product = arrayProducts.find(product => product.prodId === prodId && product.catId === catId)
  console.log('product found:', product)
  if(!product) {
    alert("error product!")
    return
  }

  document.querySelector('#divDetails').innerHTML = `
    <div class="containerImg">
      <img src="${product.image}" alt="">
    </div>
    <div class="detailsProduct">
      <h1>${product.name}</h1>
      ${product.description ? `<h3>${product.description}</h3>` : '' }
      ${returnPrice(product)}
      <button>Adicionar ao carrinho</button>
    </div>
  `

  detailsModal.classList.add('active');
  detailsModal.style.display = "flex"
}

async function loadFirebase() {
  try {
    await get(starCountRef).then((snapshot) => {
      if (!snapshot.exists()) {
        console.log('111Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
        return;
      }
      showArr(snapshot.val());

      //START CLUB SECTION
      const dataClub = []
      Object.entries(snapshot.val().clubeIbiajara).map((keyValueDataClub, index) => {
        let dataClubObj = keyValueDataClub[1];
        let dataClubObjKey = keyValueDataClub[0];

        dataClubObj.id = dataClubObjKey;
        
        dataClub.push(dataClubObj);
      }); 

      dataClub.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })

      let stringDataClub = '';
      dataClub.map(transaction => {
        stringDataClub = `${stringDataClub}<li class="liTrans"><span class='nameTrans'>${transaction.name}<span> | <span class="valueTrans ${transaction.isEntrance ? "positive" : "negative"}">${convertToReal(transaction.value)}<span> | <span class="isPaidTrans">${transaction.isPaid ? "✔️" : "AGUARDE"}<span></li>`
      })

      document.getElementById('listTransactions').innerHTML = stringDataClub;

      const sumTotal = dataClub.reduce(
        (acc, curr) => acc + curr.value,
        0
      );

      document.getElementById('dataTotal').innerHTML = convertToReal(sumTotal);

      Object.entries(snapshot.val().client.specialPrices).map((keyValueSpecPric, index) => {
        let specialPrice = keyValueSpecPric[1];
        let specialPriceKey = keyValueSpecPric[0];

        specialPrice.id = specialPriceKey;
        arrayPrices.push(specialPrice);
      }); 
      
      let newNavigationLinks = '<li><a class="active" href="#inicio">Início</a></li><li><a href="#sobre">Sobre</a></li>';
      
      let htmlCategories = '';
      Object.entries(snapshot.val().client.categories).map((keyValueCategory, index) => {
        let category = keyValueCategory[1];
        let categoryKey = keyValueCategory[0];

        let shortcutCat = String(category?.name).toLowerCase();

        newNavigationLinks = newNavigationLinks.concat(`<li><a href="#${shortcutCat}">${String(category?.name)}</a></li>`);

        htmlCategories = htmlCategories.concat(`
        <section class="menu" id="${shortcutCat}">
          <h3 class="heading" data-aos="fade-down"><span>${category?.name}</span></h3>
          <br>

          <div data-aos="fade-right">
          
              <div class="menu__container bd-grid">
        `);

        let htmlProducts = '';
        Object.entries(category.products).map(keyValueProduct => {
          let product = keyValueProduct[1];
          let productKey = keyValueProduct[0];

          product.prodId = productKey;
          product.catId = categoryKey;
          product.catName = category?.name;

          arrayProducts.push(product)
          
          htmlProducts = htmlProducts.concat(`
            <div class="menu__content">
                <img src="${product?.image}" alt="${product?.name}" class="menu__img">
                <h3 class="menu__name">${product?.name}</h3>
                <span class="menu__detail">Delicious dish etc etc etc...</span>
                <span class="menu__preci">$22.00</span>
                <a class="button_cart menu__button" onclick="openModalDetails('${product.catId}', '${product.prodId}')"><i class='fas fa-cart-plus'></i></a>
            </div>
          `);
          
        })
        htmlCategories = htmlCategories.concat(htmlProducts, `
                </div>
    
            </div>
        
            <hr class="hrCustom" data-aos="fade-right">
        </section>`)
      });

      //document.getElementById('headerProducts').insertAdjacentHTML( 'afterend', htmlCategories );
      

      newNavigationLinks = newNavigationLinks.concat(`<li><a href="#fotos">Fotos</a></li><li><a href="#contato">Contato</a></li>`)      
      //document.getElementById('ulNavId').innerHTML = newNavigationLinks;


    }).catch((error) => {
      closeModal();
      alert('222Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
      console.log('Erro ao carregar dados!');
    })
  } catch {
    closeModal();
    alert('333Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
  }
}

await loadFirebase();

//begin code

let productsInCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
if(!productsInCart){
	productsInCart = [];
}

const parentElement = document.querySelector('#buyItems');

window.convertToReal = function convertToReal(value) {
  const valueConverted = value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
  return valueConverted;
}

window.clearsessionStorage = function clearsessionStorage() {
  productsInCart = [];
  updateShoppingCartHTML();
}

const updateShoppingCartHTML = function () {  // 3
	sessionStorage.setItem('shoppingCart', JSON.stringify(productsInCart));
	if (productsInCart.length > 0) {
    let numberOfItens = 0;
		let result = productsInCart.map(product => {
			return `
				<li class="buyItem">
					<img src="${product.img}">
					<div>
						<h5 class="cartProdName">${product.name}</h5>
						<h6>${convertToReal(product.priceNumb)}</h6>
            <div class="adittionals">${product.adittionals ? product.adittionals : ''}</div>
						<div>
							<button class="button-minus" data-id=${product.id} 
              onclick="changeCountOfItens('${product.id}', false)"
              >-</button>
							<span class="countOfProduct">${product.count}</span>
							<button class="button-plus" data-id=${product.id}
              onclick="changeCountOfItens('${product.id}', true)"
              >+</button>
						</div>
					</div>
				</li>`
		});

    let stringItems = 'Olá! O meu pedido é:';
    let sumTotal = 0;
    productsInCart.map(prod => {
      numberOfItens = numberOfItens + prod.count;
      stringItems = `${stringItems}\n\n- *${prod.name}* (${prod.count} unid.) [${convertToReal(prod.priceNumb)}]${prod.adittionals ? ` \n${prod.isPizza ? 'Sabor:' : 'Complemento:'} _${prod.adittionals}_` : ''}${prod.whichFlavor ? `\n${prod.count>1 ? 'Sabores: ' : 'Sabor: '}` : ''}`;
      sumTotal  = sumTotal + prod.priceNumb;
    });
    let maskedSumTotal = convertToReal(sumTotal);
    stringItems = `${stringItems}\n\n*****************\nSubtotal: *${maskedSumTotal}* \n*****************\nObservações: `;
    
		parentElement.innerHTML = result.join('');
		document.querySelector('.checkout').classList.remove('hidden');
    document.getElementById("badgeId").innerHTML = `${numberOfItens>99 ? '<i class="fas fa-infinity" style="font-size: 0.9rem"></i>' : numberOfItens}`;
    document.getElementById("buttonWhatsapp").href=`https://api.whatsapp.com/send?phone=+5577991998770&text=${encodeURI(stringItems)}`;
    document.getElementById("cartSumTotal").innerHTML = `<i class="fas fa-trash-alt" title="Limpar Sacola" onclick="clearsessionStorage()"></i>${maskedSumTotal}`;
	}
	else {
		document.querySelector('.checkout').classList.add('hidden');
		parentElement.innerHTML = '<h4 class="empty">Sua sacola está vazia!</h4>';
    document.getElementById("badgeId").innerHTML = '0';
    document.getElementById("cartSumTotal").innerHTML = '';
	}
}

window.addItemToCart = function addItemToCart(prodObj) {
  for (let i = 0; i < productsInCart.length; i++) {
		if (productsInCart[i].id == prodObj.id) {
			productsInCart[i].count = productsInCart[i].count + 1;
			productsInCart[i].priceNumb = productsInCart[i].priceOne*productsInCart[i].count;
      updateShoppingCartHTML();
			return;
		}
	}
	productsInCart.push(prodObj);
  updateShoppingCartHTML();
}

window.addAcaiToCart = function addAcaiToCart() {
  let adittionalsString = '';

  fbArray.adittionals.map(add => {
    if (add.selected) {
      adittionalsString = `${adittionalsString}${add.name}-`;
    }
  })

  let idString = `ACAI-${catAcais[0].priceOriginalAcai}.${adittionalsString}`;

  for (let i = 0; i < productsInCart.length; i++) {
		if (productsInCart[i].id === idString) {
			productsInCart[i].count = productsInCart[i].count + 1;
			productsInCart[i].priceNumb = catAcais[0].priceTotalAcai*productsInCart[i].count;
      updateShoppingCartHTML();
			return;
		}
	}

  let acaiObj = {
    id: `${idString}`,
    name: `${catAcais[0].name}`,
    adittionals: `${adittionalsString==='' ? 'Sem adicionais' : adittionalsString}`,
    priceOne: catAcais[0].priceTotalAcai,
    priceNumb: catAcais[0].priceTotalAcai,
    img: `${catAcais[0].img}`,
    count: 1
  };

	productsInCart.push(acaiObj);
  updateShoppingCartHTML();
}

window.addMSToCart = function addMSToCart() {
  let adittionalsStringMS = '';

  additionalsMilkShake.map(add => {
    if (add.selected) {
      adittionalsStringMS = `${adittionalsStringMS}${add.name}-`;
    }
  })

  let idStringMS = `MILKSHAKE-${catMilkShakes[0].priceOriginalMS}.${adittionalsStringMS}`;

  for (let i = 0; i < productsInCart.length; i++) {
		if (productsInCart[i].id === idStringMS) {
			productsInCart[i].count = productsInCart[i].count + 1;
			productsInCart[i].priceNumb = catMilkShakes[0].priceTotalMS*productsInCart[i].count;
      updateShoppingCartHTML();
			return;
		}
	}

  let msObj = {
    id: `${idStringMS}`,
    name: `${catMilkShakes[0].name}`,
    adittionals: `${adittionalsStringMS==='' ? 'Sem adicionais' : adittionalsStringMS}`,
    whichFlavor: true,
    priceOne: catMilkShakes[0].priceTotalMS,
    priceNumb: catMilkShakes[0].priceTotalMS,
    img: `${catMilkShakes[0].img}`,
    count: 1
  };

	productsInCart.push(msObj);
  updateShoppingCartHTML();
}

window.changeCountOfItens = function changeCountOfItens(idProd, IsIncrease) {
  for (let i = 0; i < productsInCart.length; i++) {
		if (productsInCart[i].id == idProd) {
      if (IsIncrease) {
        productsInCart[i].count = productsInCart[i].count + 1;
      } else {
        productsInCart[i].count = productsInCart[i].count - 1;
      }
			productsInCart[i].priceNumb = productsInCart[i].priceOne*productsInCart[i].count;
      if (productsInCart[i].count <= 0) {
				productsInCart.splice(i, 1);
			}
		}
	}
  updateShoppingCartHTML();
}

$(document).ready(function(){

  $('#menu-bar').click(function(){
      $(this).toggleClass('fa-times');
      $('.navbar').toggleClass('nav-toggle');
  });

  $(window).on('load scroll',function(){

      $('#menu-bar').removeClass('fa-times');
      $('.navbar').removeClass('nav-toggle');

      $('section').each(function(){

          let top = $(window).scrollTop();
          let height = $(this).height();
          let id = $(this).attr('id');
          let offset = $(this).offset().top - 200;

          if(top > offset && top < offset + height){
              $('.navbar ul li a').removeClass('active');
              $('.navbar').find(`[href="#${id}"]`).addClass('active');
          }

      });

  });


  $('.list .btn').click(function(){
      $(this).addClass('active').siblings().removeClass('active');
  });
  
  $('.listInside .btnInside').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
  });

  /*$('.boxAcaiSizes .acaiSizeInside').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
  }); */

  $('.boxMSSizes .msSizeInside').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
  });
});
/*Cart functions*/

function closeCart() {
	const cart = document.querySelector('.producstOnCart');
	cart.classList.toggle('hide');
	/*document.querySelector('body').classList.toggle('stopScrolling') */
}

const openShopCart = document.querySelector('.bagDiv');
openShopCart.addEventListener('click', () => {
	const cart = document.querySelector('.producstOnCart');
	cart.classList.toggle('hide');
	/*document.querySelector('body').classList.toggle('stopScrolling'); */
});

/*close cart when click the closeButton */
const closeShopCart = document.querySelector('#closeButton');
closeShopCart.addEventListener('click', closeCart);
/*close cart when click on overlay */
const overlay = document.querySelector('.overlay');
overlay.addEventListener('click', closeCart);

updateShoppingCartHTML();