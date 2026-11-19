/* ============================================================
   АЙБОЛИТ · js/main.js — только телефонная маска.
   Всё остальное на странице — чистые HTML+CSS.

   Поведение:
   · фокус на пустое поле → появляется «+7 (»;
   · печатаем 8   → 8 заменяется на +7 (…           (для РФ: 8→+7)
   · печатаем 9   → +7 остаётся, «9» дописывается   (+7 подставляется САМ)
   · печатаем +7  → остаётся как есть               (дубль +7 схлопывается)
   · восьмёрка после «+7» (+7 8…) тоже выбрасывается;
   · ровно 11 цифр → поле валидно (зелёная галочка, активна кнопка)
   ============================================================ */
'use strict';

const phoneInput = document.getElementById('f-phone');
if (phoneInput) {
  phoneInput.addEventListener('focus', () => {
    if (!phoneInput.value) phoneInput.value = '+7 (';
  });

  phoneInput.addEventListener('input', () => {
    const raw = phoneInput.value;
    let d = raw.replace(/\D/g, '');

    if (d.startsWith('8')) {
      d = '7' + d.slice(1);          // 8-916… → +7 916…
    } else if (d.startsWith('78')) {
      d = '7' + d.slice(2);          // «+7 8…» — восьмёрка после +7 выбрасывается
    }
    while (d.startsWith('77')) {
      d = d.slice(1);                // дубль «+7» (авто-подстановка + ручной ввод) схлопывается
    }
    if (d && !d.startsWith('7')) {
      d = '7' + d;                   // 9… → +7 9…
    }
    d = d.slice(0, 11);

    if (!d) {                        // остался только «+» / пусто
      phoneInput.value = raw.includes('+') ? '+7 (' : '';
      return;
    }

    let out = '+7';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length >= 4) out += ') ' + d.slice(4, 7);
    if (d.length >= 7) out += '-' + d.slice(7, 9);
    if (d.length >= 9) out += '-' + d.slice(9, 11);
    phoneInput.value = out;
  });

  phoneInput.addEventListener('blur', () => {
    // недозаполненная маска — очищаем поле
    if (phoneInput.value === '+7 (' || phoneInput.value === '+7') {
      phoneInput.value = '';
    }
  });
}
