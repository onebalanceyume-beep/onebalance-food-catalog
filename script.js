(() => {
  const data = Array.isArray(window.foodData) ? window.foodData : [];
  const foodGrid = document.getElementById('foodGrid');
  const emptyState = document.getElementById('emptyState');
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const foodCount = document.getElementById('foodCount');
  const currentCategoryLabel = document.getElementById('currentCategoryLabel');

  const categoryMap = {
    ALL: { label: 'すべて', badge: 'ALL', gradient: 'linear-gradient(135deg, #E89AAA 0%, #7AA8D8 100%)' },
    P: { label: 'タンパク質(P)', badge: 'P', gradient: 'linear-gradient(135deg, #FFB8C8 0%, #E89AAA 100%)' },
    F: { label: '脂質(F)', badge: 'F', gradient: 'linear-gradient(135deg, #FFD4A8 0%, #F5B878 100%)' },
    C: { label: '炭水化物(C)', badge: 'C', gradient: 'linear-gradient(135deg, #C8E0B8 0%, #A8C898 100%)' }
  };

  let activeFilter = 'ALL';

  const formatGram = (value) => `${Number(value).toLocaleString('ja-JP')}g`;
  const formatMacro = (value) => `${Number(value).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}g`;
  const formatKcal = (value) => `${Number(value).toLocaleString('ja-JP')}kcal`;

  const createChip = (type, value) => `
    <span class="pfc-chip pfc-chip--${type.toLowerCase()}">
      <span class="pfc-chip__label">${type}</span>
      ${formatMacro(value)}
    </span>
  `;

  const createCard = (food) => {
    const category = categoryMap[food.category] || categoryMap.P;

    return `
      <button class="food-card" type="button" data-id="${food.id}" style="--card-gradient:${category.gradient}; --badge-gradient:${category.gradient};" aria-pressed="false">
        <div class="food-card__image-wrap">
          <img src="images/${food.id}.png" alt="${food.name}" class="food-card__image" loading="lazy" onerror="this.style.display='none'" />
        </div>
        <div class="food-card__inner">
          <div class="food-card__top">
            <div class="food-card__title-wrap">
              <p class="food-card__id">${food.id}</p>
              <h2 class="food-card__title">${food.name}</h2>
            </div>
            <span class="category-badge" aria-label="カテゴリ ${category.label}">${category.badge}</span>
          </div>

          <div class="food-card__meta">
            <div class="meta-box">
              <p class="meta-box__label">1食の量目安</p>
              <p class="meta-box__value">${food.serving}</p>
            </div>
            <div class="meta-box">
              <p class="meta-box__label">標準量</p>
              <p class="meta-box__value">${formatGram(food.servingG)}</p>
            </div>
          </div>

          <div class="food-card__pfc-row" aria-label="PFCバランス">
            ${createChip('P', food.p)}
            ${createChip('F', food.f)}
            ${createChip('C', food.c)}
            <span class="kcal-chip">
              <span class="kcal-chip__label">K</span>
              ${formatKcal(food.calorie)}
            </span>
          </div>
        </div>
      </button>
    `;
  };

  const renderFoods = () => {
    const filtered = activeFilter === 'ALL'
      ? data
      : data.filter((food) => food.category === activeFilter);

    foodGrid.innerHTML = filtered.map(createCard).join('');
    foodCount.textContent = filtered.length;
    currentCategoryLabel.textContent = categoryMap[activeFilter]?.label || 'すべて';
    emptyState.classList.toggle('hidden', filtered.length !== 0);
    foodGrid.classList.toggle('hidden', filtered.length === 0);
  };

  const setActiveTab = (filter) => {
    activeFilter = filter;
    tabs.forEach((tab) => {
      const isCurrent = tab.dataset.filter === filter;
      tab.classList.toggle('is-active', isCurrent);
      tab.setAttribute('aria-selected', String(isCurrent));
    });
    renderFoods();
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.filter || 'ALL'), { passive: true });
  });

  foodGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.food-card');
    if (!card) return;
    const isSelected = card.classList.toggle('is-selected');
    card.setAttribute('aria-pressed', String(isSelected));
  });

  renderFoods();
})();
