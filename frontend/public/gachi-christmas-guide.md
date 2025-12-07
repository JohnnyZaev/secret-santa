# 🎅 Как добавить свои GACHI картинки

## Шаг 1: Найдите картинки

Найдите изображения в новогоднем/зимнем стиле (желательно PNG с прозрачным фоном)

## Шаг 2: Добавьте в проект

1. Положите изображения в папку `frontend/public/images/`
   - Например: `gachi-santa.png`, `gachi-snowman.png`, `gachi-tree.png`

## Шаг 3: Обновите CSS

Добавьте в `frontend/src/index.css`:

```css
/* Фоновые изображения */
.background-image-1 {
  position: fixed;
  bottom: 50px;
  left: 50px;
  width: 200px;
  height: 200px;
  background-image: url('/images/gachi-santa.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.2;
  pointer-events: none;
  z-index: 0;
  animation: float 4s ease-in-out infinite;
}

.background-image-2 {
  position: fixed;
  top: 100px;
  right: 100px;
  width: 150px;
  height: 150px;
  background-image: url('/images/gachi-tree.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
  animation: float 5s ease-in-out infinite;
  animation-delay: 1s;
}
```

## Шаг 4: Добавьте элементы в HTML

В `frontend/src/App.tsx` добавьте:

```tsx
<div className="background-image-1"></div>
<div className="background-image-2"></div>
```

## Готово! 🎉

