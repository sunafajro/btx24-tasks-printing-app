# Bitrix24 :: Приложение для печати заданий

## Project setup
```
npm ic
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### После сборки билда необходимо:
- Исправить пути для script, css файлов на относительные (./css/style.css) в файле index.html.
- Указать ID вашего списка в атрибуте data-listid блока app в файле index.html.
- Исправить значение handler url на адрес вашего сервера (требуется для установки, но использоваться не будет) в файле install.html.
- Заархивировать содержимое папки dist и загрузить результат в birtrix24.
