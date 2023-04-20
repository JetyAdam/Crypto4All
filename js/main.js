const COIN_RANKING_API_URL = 'http://localhost:5500/coins';
// const COIN_RANKING_API_URL = "https://crypto4all.onrender.com:5000/coins";
// const COIN_RANKING_API_URL = "https://crypto4all.onrender.com:5000/coins/coinrankingcd15a650e918b72736a33f4d0c1dcdfed2e2aa8914ddf0af";
const coinListEl = document.getElementById('market-data');
let coinsData = [];

// Variables for pagination
const paginationEl = document.getElementById('pagination');
let currentPage = 1;
const ROWS_PER_PAGE = 10;

// Hamburger menu and navigation for mobile screens
const menuBtn = document.querySelector('.navbar__menu-btn');
const overlay = document.querySelector('.overlay');
const navbar = document.querySelector('.header');
const navbarMobileLinks = document.querySelectorAll('.navbar-mobile__link');
const body = document.querySelector('body');
let menuOpen = false;

const toggleOverlay = function () {
  if (!menuOpen) {
    menuOpen = true;

    // Disable scrolling through body element when overlay is opened
    body.style.height = '100vh';
    body.style.overflow = 'hidden';
  } else {
    menuOpen = false;

    // Allow scrolling through body
    body.style.height = '100%';
    body.style.overflow = 'visible';
  }

  menuBtn.classList.toggle('open');
  overlay.classList.toggle('hidden');
};

menuBtn.addEventListener('click', toggleOverlay);
for (link of navbarMobileLinks) {
  link.addEventListener('click', toggleOverlay);
}

// Helper function that converts a huge number to a billion notation for a  better readability
const formatCash = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e4) return +(n / 1e9).toFixed(2) + ' billion';
};

const loadCoins = async () => {
  try {
    const res = await fetch(COIN_RANKING_API_URL);
    const dataResponse = await res.json();
    coinsData = dataResponse.data.coins;
    displayCoins(dataResponse.data.coins, currentPage);
    displayPopularCoins(dataResponse.data.coins);
    setupPagination(dataResponse.data.coins, paginationEl, ROWS_PER_PAGE);
  } catch (err) {
    console.error(err);
  }
};

const displayCoins = (coins, page) => {
  page--;
  let start = ROWS_PER_PAGE * page;
  let end = start + ROWS_PER_PAGE;
  let paginatedCoins = coins.slice(start, end);

  const markup = paginatedCoins
    .map((coin) => {
      return `
    <tr class="market-table__row">
    <td class="market-table__data">
      <button class="add-to-fav" data-add-to-fav>
        <ion-icon
          name="star-outline"
          class="icon-outline"
        ></ion-icon>
      </button>
    </td>

    <td class="market-table__data market-table__data--order">
      ${coin.rank}
    </td>

    <td class="market-table__data">
      <div class="container">
        <img
          src="${coin.iconUrl}"
          width="20"
          height="20"
          alt="${coin.name} logo"
        />

        <h3>
          <a href="#" class="asset-title"
            >${coin.name} <span>${coin.symbol}</span></a
          >
        </h3>
      </div>
    </td>

    <td class="market-table__data market-table__data--price">
      ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(coin.price)}
    </td>

    <td class="market-table__data market-table__data--marketcap">
      ${formatCash(coin.marketCap)}
    </td>

    <td class="market-table__data">
      <button class="btn-outline btn-trade"><a href="${
        coin.coinrankingUrl
      }" target="_blank">Trade</a></button>
    </td>
  </tr>
        `;
    })
    .join('');
  coinListEl.innerHTML = '';
  coinListEl.innerHTML = markup;
};

loadCoins();

const makeBtnActive = function () {
  // Remove active class from currently active button
  let currentBtn = document.querySelector('.pagenumbers button.btn-active');
  currentBtn.classList.remove('btn-active');

  // Make new button active
  const btn = document.querySelector(
    `.pagenumbers [data-page="${currentPage}"]`
  );
  btn.classList.add('btn-active');
};

const setupPagination = function (coins, wrapper, rowsPerPage) {
  wrapper.innerHTML = '';

  let pageCount = Math.ceil(coins.length / rowsPerPage);

  for (let i = 1; i < pageCount + 1; i++) {
    let btn = paginationButton(i, coins);
    wrapper.appendChild(btn);
  }

  // Insert left arrow to HTML
  wrapper.insertAdjacentHTML(
    'afterbegin',
    '<ion-icon name="chevron-back-outline" class="pagination-arrow" id="left-arrow"></ion-icon>'
  );

  document.getElementById('left-arrow').addEventListener('click', function () {
    if (currentPage <= 1) return;

    currentPage--;
    displayCoins(coins, currentPage);
    makeBtnActive(currentPage);
  });

  // Insert Right arrow to HTML
  wrapper.insertAdjacentHTML(
    'beforeend',
    '<ion-icon name="chevron-forward-outline" class="pagination-arrow" id="right-arrow"></ion-icon>'
  );

  document.getElementById('right-arrow').addEventListener('click', function () {
    if (currentPage >= pageCount) return;

    currentPage++;
    displayCoins(coins, currentPage);
    makeBtnActive(currentPage);
  });
};

const paginationButton = function (page, coins) {
  let button = document.createElement('button');
  button.innerText = page;
  button.dataset.page = +page;

  if (currentPage == page) button.classList.add('btn-active');

  button.addEventListener('click', function () {
    // currentPage = page;
    currentPage = button.innerText;
    displayCoins(coins, currentPage);

    makeBtnActive();
  });

  return button;
};

// sticky mobile navigation
window.addEventListener('scroll', () => {
  scrollPos = window.scrollY;

  if (window.scrollY > 20) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
});

// Slide up animation for some sections
// function reveal() {
//   const reveals = document.querySelectorAll(".reveal");

//   for (let i = 0; i < reveals.length; i++) {
//     const windowHeight = window.innerHeight;
//     const elementTop = reveals[i].getBoundingClientRect().top;
//     const elementVisible = 100;

//     if (elementTop < windowHeight - elementVisible)
//       reveals[i].classList.add("active");
//   }
// }

//window.addEventListener("scroll", reveal);

// To check the scroll position on page load
//reveal();

// Display 4 popular tabs in popular secion
const displayPopularCoins = function (coins) {
  const popularSectionCards = document.getElementById('popular-tab__list');
  if (coins.length !== 4) coins = coins.slice(0, 4);
  else if (typeof coins !== 'array') return;

  const markup = coins
    .map((coin) => {
      return `<li>
    <div class="popular-tab__card">
      <div class="popular-tab__card--title-container">
        <img
          src="${coin.iconUrl}"
          alt="${coin.name} logo"
          width="24"
          height="24"
        />
        <a href="#" class="popular-tab__card--title">
          ${coin.name} <span>${coin.symbol}/USD</span></a
        >
      </div>

      <div class="popular-tab__card--value">USD ${new Intl.NumberFormat(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
        }
      ).format(coin.price)}</div>

      
        <span class="popular-tab__card--badge badge badge-${
          coin.change >= 0 ? 'green' : 'red'
        }"
          >${coin.change}%</span
        >
      </div>
    </div>
  </li>`;
    })
    .join('');

  popularSectionCards.innerHTML = '';
  popularSectionCards.insertAdjacentHTML('afterbegin', markup);
};
