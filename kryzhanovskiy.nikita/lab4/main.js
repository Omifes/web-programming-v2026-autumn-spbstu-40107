import {Recipe} from './model.js';

const STORAGE_KEY = 'recipes';

let recipes = [];

function delay(ms = 60) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function loadRecipes() {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (rawData !== null) {
    try {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed.map(
          (item) => new Recipe(item.title, item.ingredients, item.steps),
        );
      }
    } catch {
      return [];
    }
  }

  return [
    new Recipe(
      'Блины',
      ['Молоко', 'Мука', 'Яйца', 'Сахар'],
      [
        'Взбить яйца с сахаром',
        'Добавить молоко и муку',
        'Жарить на сковороде',
      ],
    ),
  ];
}

function saveRecipes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function renderRecipes() {
  const container = document.querySelector('[data-testid="entity-list"]');
  if (!container) {
    return;
  }
  container.innerHTML = '';

  recipes.forEach((recipe, recipeIndex) => {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('data-testid', 'entity-item');

    // Название сущности
    const titleEl = document.createElement('h3');
    titleEl.setAttribute('data-testid', 'entity-title');
    titleEl.textContent = recipe.title;

    // Мета-информация
    const metaEl = document.createElement('div');
    metaEl.className = 'recipe-meta';
    metaEl.textContent = `Ингредиентов: ${recipe.ingredientCount} | Шагов: ${recipe.stepCount}`;

    // Список ингредиентов
    const ingTitle = document.createElement('h4');
    ingTitle.textContent = 'Ингредиенты:';
    const ingList = document.createElement('ul');

    recipe.ingredients.forEach((ing) => {
      const li = document.createElement('li');
      li.className = 'item-row';
      const textSpan = document.createElement('span');
      textSpan.textContent = ing;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-item-action';
      removeBtn.textContent = '×';
      removeBtn.title = 'Убрать ингредиент';
      removeBtn.addEventListener('click', async () => {
        removeBtn.disabled = true;
        await recipe.asyncRemoveIngredient(ing);
        saveRecipes();
        renderRecipes();
      });

      li.append(textSpan, removeBtn);
      ingList.appendChild(li);
    });

    // Список шагов
    const stepsTitle = document.createElement('h4');
    stepsTitle.textContent = 'Шаги приготовления:';
    const stepsList = document.createElement('ol');

    recipe.steps.forEach((step, stepIndex) => {
      const li = document.createElement('li');
      li.className = 'item-row';
      const textSpan = document.createElement('span');
      textSpan.textContent = step;

      const removeStepBtn = document.createElement('button');
      removeStepBtn.type = 'button';
      removeStepBtn.className = 'btn-item-action';
      removeStepBtn.textContent = '×';
      removeStepBtn.title = 'Убрать шаг';
      removeStepBtn.addEventListener('click', async () => {
        removeStepBtn.disabled = true;
        await recipe.asyncRemoveStep(stepIndex);
        saveRecipes();
        renderRecipes();
      });

      li.append(textSpan, removeStepBtn);
      stepsList.appendChild(li);
    });

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const deleteRecipeBtn = document.createElement('button');
    deleteRecipeBtn.type = 'button';
    deleteRecipeBtn.className = 'btn-danger';
    deleteRecipeBtn.setAttribute('data-testid', 'delete-button');
    deleteRecipeBtn.setAttribute('data-action', 'delete');
    deleteRecipeBtn.textContent = 'Удалить';
    deleteRecipeBtn.addEventListener('click', async () => {
      deleteRecipeBtn.disabled = true;
      await delay(60);
      recipes.splice(recipeIndex, 1);
      saveRecipes();
      renderRecipes();
    });
    actions.appendChild(deleteRecipeBtn);

    card.append(
      titleEl,
      metaEl,
      ingTitle,
      ingList,
      stepsTitle,
      stepsList,
      actions,
    );
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  recipes = loadRecipes();
  renderRecipes();

  const form = document.querySelector('[data-testid="entity-form"]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      const titleInput = form.querySelector('[name="title"]');
      const ingredientsInput = form.querySelector('[name="ingredients"]');
      const stepsInput = form.querySelector('[name="steps"]');

      const title = titleInput ? titleInput.value.trim() : '';
      const rawIngredients = ingredientsInput ? ingredientsInput.value : '';
      const rawSteps = stepsInput ? stepsInput.value : '';

      const ingredients = rawIngredients
        ? rawIngredients
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const steps = rawSteps
        ? rawSteps
            .split(';')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      if (title) {
        await delay(60);
        const newRecipe = new Recipe(title, ingredients, steps);
        recipes.push(newRecipe);
        saveRecipes();
        renderRecipes();
        form.reset();
      }

      if (submitBtn) {
        submitBtn.disabled = false;
      }
    });
  }

  window.addEventListener('beforeunload', () => {
    saveRecipes();
  });
});
