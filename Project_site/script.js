// Функция для переключения между залами
function switchHall(hallId) {
    // Скрываем все залы
    document.querySelectorAll('.hall').forEach(hall => {
        hall.style.display = 'none';
        hall.classList.remove('active');
    });

    // Показываем выбранный зал
    const selectedHall = document.getElementById(hallId);
    if (selectedHall) {
        selectedHall.style.display = 'block';
        selectedHall.classList.add('active');
    }

    // Обновляем активную вкладку
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-hall') === hallId) {
            tab.classList.add('active');
        }
    });
}

// Делаем функцию switchHall глобально доступной
window.switchHall = switchHall;

function showPaymentModal(type, price) {
    const modal = document.getElementById('paymentModal');
    const selectedCandle = document.getElementById('selectedCandle');
    const selectedPrice = document.getElementById('selectedPrice');
    const paymentWidget = document.getElementById('paymentWidget');
    
    if (!modal || !selectedCandle || !selectedPrice || !paymentWidget) {
        console.error('Не найдены необходимые элементы модального окна');
        return;
    }
    
    selectedCandle.textContent = getCandleName(type);
    selectedPrice.textContent = `${price}₽`;
    
    // Очищаем предыдущий виджет
    paymentWidget.innerHTML = '';
    
    // Создаем кнопку оплаты
    const payButton = document.createElement('a');
    payButton.href = `https://yoomoney.ru/quickpay/confirm.xml?receiver=4100118637823014&quickpay-form=shop&targets=%D0%9E%D0%BF%D0%BB%D0%B0%D1%82%D0%B0%20%D1%81%D0%B2%D0%B5%D1%87%D0%B8&default-sum=${price}&button-text=11&yoomoney-payment-type=on&button-size=m&button-color=black&successURL=https%3A%2F%2Fpisun.site%2Fsuccess&fio=on&mail=on&phone=on&comment=on&hint=&mail=on&hint=&successURL=&quickpay-form=shop&label=sw-123456789`;
    payButton.className = 'pay-button';
    payButton.textContent = 'Оплатить';
    payButton.target = '_blank';
    
    // Добавляем кнопку в контейнер
    paymentWidget.appendChild(payButton);
    
    // Показываем модальное окно
    modal.style.display = 'block';
}

function getCandleName(type) {
    switch(type) {
        case 'white': return 'Белая Свеча';
        case 'blue': return 'Синяя Свеча';
        case 'pink': return 'Розовая Свеча';
        case 'gold': return 'Золотая Свеча';
        case 'rare': return 'Редкая Свеча';
        case 'mystic': return 'Мистическая Свеча';
        default: return 'Свеча';
    }
}

function handleSuccessfulPayment(type) {
    try {
        // Находим соответствующий элемент свечи в хранилище
        const candleItem = document.querySelector(`.candle-item[data-candle-type="${type}"]`);
        if (!candleItem) {
            console.error('Не найден элемент свечи для типа:', type);
            return;
        }

        // Получаем текущее количество свечей
        const countElement = candleItem.querySelector('.count');
        if (!countElement) {
            console.error('Не найден элемент счетчика');
            return;
        }

        // Увеличиваем счетчик
        const currentCount = parseInt(countElement.textContent) || 0;
        countElement.textContent = currentCount + 1;

        // Обновляем счетчик хранилища
        updateStorageCount();
        
        // Сохраняем состояние
        saveStoredCandles();
        
        // Закрываем модальное окно
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.style.display = "none";
        }
        
        // Показываем сообщение об успешной покупке
        alert('Свеча успешно куплена!');
    } catch (error) {
        console.error('Ошибка при обработке успешной оплаты:', error);
    }
}

// Делаем функции глобально доступными
window.showPaymentModal = showPaymentModal;
window.getCandleName = getCandleName;
window.handleSuccessfulPayment = handleSuccessfulPayment;

// Обработчики для модального окна
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});

// Функция для получения изображения свечи по типу
function getCandleImage(candleType) {
    const candleImages = {
        'red': 'Свечи/White Candle Flame Illustration PNG _ TopPNG.png',
        'blue': 'Свечи/Blue.png',
        'green': 'Свечи/miphik.png',
        'yellow': 'Свечи/Gold.png',
        'purple': 'Свечи/miphik.png',
        'orange': 'Свечи/Gold.png',
        'pink': 'Свечи/Pink.png',
        'emerald': 'Свечи/miphik.png',
        'legendary': 'Свечи/Rare.png'
    };

    const imageName = candleImages[candleType];
    if (!imageName) {
        console.error('Неизвестный тип свечи:', candleType);
        return null;
    }

    return imageName;
}

// Функция для сохранения свечей в localStorage
function saveStoredCandles() {
    try {
        const counts = {};
        
        // Сохраняем количество свечей в хранилище
        const candleItems = document.querySelectorAll('#storage-container .candle-item');
        candleItems.forEach(item => {
            const type = item.getAttribute('data-candle-type');
            const countElement = item.querySelector('.count');
            if (type && countElement) {
                counts[type] = parseInt(countElement.textContent) || 0;
            }
        });

        // Сохраняем количество свечей на подсвечниках
        document.querySelectorAll('.candlestick').forEach(stand => {
            const standId = stand.id;
            const candles = stand.querySelectorAll('.candle-on-candlestick').length;
            if (standId) {
                counts[standId] = candles;
            }
        });
        
        localStorage.setItem('candleCounts', JSON.stringify(counts));
        console.log('Свечи сохранены:', counts);
    } catch (error) {
        console.error('Ошибка при сохранении свечей:', error);
    }
}

// Функция для загрузки сохраненных свечей
function loadStoredCandles() {
    try {
        const storedCounts = localStorage.getItem('candleCounts');
        if (storedCounts) {
            const counts = JSON.parse(storedCounts);
            
            // Загружаем количество свечей в хранилище
            Object.entries(counts).forEach(([type, count]) => {
                if (type.startsWith('stand-')) {
                    // Это подсвечник
                    const stand = document.getElementById(type);
                    if (stand) {
                        const countElement = stand.parentElement.querySelector('.count');
                        if (countElement) {
                            countElement.textContent = count;
                        }
                    }
                } else {
                    // Это свеча в хранилище
                    const candleItem = document.querySelector(`#storage-container .candle-item[data-candle-type="${type}"]`);
                    if (candleItem) {
                        const countElement = candleItem.querySelector('.count');
                        if (countElement) {
                            countElement.textContent = count;
                        }
                    }
                }
            });
            
            updateStorageCount();
        }
        console.log('Загружены сохраненные свечи');
    } catch (error) {
        console.error('Ошибка при загрузке сохраненных свечей:', error);
    }
}

// Функция для обновления счетчика хранилища
function updateStorageCount() {
    try {
        const storageContainer = document.getElementById('storage-container');
        const storageCountElement = document.getElementById('storage-count');
        
        if (!storageContainer || !storageCountElement) {
            console.error('Не найдены элементы хранилища или счетчика');
            return;
        }

        let totalCount = 0;
        const candleItems = storageContainer.querySelectorAll('.candle-item');
        candleItems.forEach(item => {
            const countElement = item.querySelector('.count');
            if (countElement) {
                totalCount += parseInt(countElement.textContent) || 0;
            }
        });

        // Обновляем счетчики на подсвечниках
        document.querySelectorAll('.candlestick').forEach(stand => {
            const standId = stand.id;
            const countElement = stand.parentElement.querySelector('.count');
            if (countElement) {
                const candles = stand.querySelectorAll('.candle-on-candlestick').length;
                countElement.textContent = candles;
                totalCount += candles;
            }
        });
        
        storageCountElement.textContent = totalCount;
        console.log('Обновлен счетчик хранилища:', totalCount);
    } catch (error) {
        console.error('Ошибка при обновлении счетчика хранилища:', error);
    }
}

// Функция для очистки всех подсвечников
function clearAllCandlesticks() {
    try {
        document.querySelectorAll('.candlestick').forEach(stand => {
            const candles = stand.querySelectorAll('.candle-on-candlestick');
            candles.forEach(candle => candle.remove());
            stand.classList.remove('has-candle');
            stand.removeAttribute('data-candle-type');
        });
    } catch (error) {
        console.error('Ошибка при очистке подсвечников:', error);
    }
}

// Функция для добавления баланса
function addBalance(amount) {
    const currentBalance = parseInt(localStorage.getItem('userBalance') || '0');
    const newBalance = currentBalance + amount;
    localStorage.setItem('userBalance', newBalance.toString());
    
    const userBalanceElement = document.getElementById('user-balance');
    if (userBalanceElement) {
        userBalanceElement.textContent = newBalance;
    }
}

// Функция для покупки свечи
function buyCandle(type) {
    const prices = {
        'red': 100,
        'blue': 200,
        'pink': 300,
        'yellow': 500,
        'purple': 1000,
        'orange': 2000,
        'emerald': 80,
        'legendary': 100
    };

    const currentBalance = parseInt(localStorage.getItem('userBalance') || '0');
    const price = prices[type] || 0;

    if (currentBalance >= price) {
        try {
            // Вычитаем стоимость
            const newBalance = currentBalance - price;
            localStorage.setItem('userBalance', newBalance.toString());
            
            // Обновляем отображение баланса
            const userBalanceElement = document.getElementById('user-balance');
            if (userBalanceElement) {
                userBalanceElement.textContent = newBalance;
            }

            // Находим элемент свечи в хранилище
            const candleItem = document.querySelector(`.candle-item[data-candle-type="${type}"]`);
            if (!candleItem) {
                console.error('Не найден элемент свечи для типа:', type);
                return;
            }

            // Получаем текущее количество свечей
            const countElement = candleItem.querySelector('.count');
            if (!countElement) {
                console.error('Не найден элемент счетчика');
                return;
            }

            // Увеличиваем счетчик
            const currentCount = parseInt(countElement.textContent) || 0;
            countElement.textContent = currentCount + 1;

            // Обновляем счетчик хранилища
            updateStorageCount();
            
            // Сохраняем состояние
            saveStoredCandles();

            // Показываем уведомление об успешной покупке
            alert(`Вы успешно купили ${getCandleName(type)}!`);
        } catch (error) {
            console.error('Ошибка при покупке свечи:', error);
            alert('Произошла ошибка при покупке свечи. Пожалуйста, попробуйте снова.');
        }
    } else {
        alert('Недостаточно средств!');
    }
}

// Функция для сохранения количества свечей
function saveCandleCounts() {
    try {
        const counts = {};
        document.querySelectorAll('.candlestick').forEach(stand => {
            const subject = stand.getAttribute('data-subject');
            const count = stand.querySelectorAll('.candle-on-candlestick').length;
            counts[subject] = count;
        });
        localStorage.setItem('candleCounts', JSON.stringify(counts));
    } catch (error) {
        console.error('Ошибка при сохранении количества свечей:', error);
    }
}

// Функция для инициализации обработчиков событий
function initializeEventListeners() {
    try {
        // Обработчики для кнопок покупки
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                if (type) {
                    buyCandle(type);
                }
            });
        });

        // Обработчики для вкладок
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const hallId = this.getAttribute('data-hall');
                if (hallId) {
                    switchHall(hallId);
                }
            });
        });
    } catch (error) {
        console.error('Ошибка при инициализации обработчиков событий:', error);
    }
}

// Функция для очистки ящика со свечами
function clearCandleStorage() {
    try {
        // Очищаем localStorage
        localStorage.removeItem('candleCounts');
        
        // Сбрасываем счетчики в HTML
        const candleItems = document.querySelectorAll('#storage-container .candle-item .count');
        candleItems.forEach(item => {
            item.textContent = '0';
        });
        
        console.log('Ящик со свечами очищен');
    } catch (error) {
        console.error('Ошибка при очистке ящика:', error);
    }
}

// Добавляем вызов функции очистки при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    clearCandleStorage(); // Очищаем ящик при загрузке
    loadStoredCandles();
    // Затем инициализируем остальные элементы
    try {
        // Удаляем все элементы candle-on-candlestick
        document.querySelectorAll('.candle-on-candlestick').forEach(el => el.remove());
        
        // Очищаем сохраненные свечи на подсвечниках
        localStorage.removeItem('placedCandles');
        
        // Удаляем все элементы с классом 'candle'
        document.querySelectorAll('.candle').forEach(candle => {
            candle.remove();
        });
        
        // Очищаем все подсвечники
        document.querySelectorAll('.candlestick').forEach(stand => {
            stand.classList.remove('has-candle');
            stand.removeAttribute('data-candle-type');
        });

        // Скрываем все залы
        const halls = document.querySelectorAll('.hall');
        if (!halls.length) {
            console.error('Залы не найдены');
            return;
        }
        halls.forEach(hall => {
            hall.style.display = 'none';
        });

        // Показываем главный зал по умолчанию
        const mainHall = document.getElementById('main-hall');
        if (!mainHall) {
            console.error('Главный зал не найден');
            return;
        }
        mainHall.style.display = 'block';
        mainHall.classList.add('active');

        // Активируем первую вкладку
        const firstTab = document.querySelector('.tab');
        if (!firstTab) {
            console.error('Вкладки не найдены');
            return;
        }
        firstTab.classList.add('active');
        
        // Добавляем обработчики для кнопок переключения залов
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const hallId = this.getAttribute('data-hall');
                if (!hallId) {
                    console.error('Не указан ID зала для вкладки');
                    return;
                }
                switchHall(hallId);
            });
        });
        
        // Загружаем баланс пользователя
        const userBalanceElement = document.getElementById('user-balance');
        if (userBalanceElement) {
            const userBalance = localStorage.getItem('userBalance') || '0';
            userBalanceElement.textContent = userBalance;
        } else {
            console.error('Элемент баланса пользователя не найден');
        }
        
        // Добавляем обработчики для кнопок покупки
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                if (type) {
                    buyCandle(type);
                } else {
                    console.error('Не указан тип свечи для кнопки покупки');
                }
            });
        });
        
        // Добавляем кнопку для тестового пополнения баланса
        try {
            const shopContainer = document.querySelector('.shop-container');
            if (shopContainer) {
                const addBalanceButton = document.createElement('button');
                addBalanceButton.textContent = 'Пополнить баланс (1000₽)';
                addBalanceButton.className = 'add-balance-btn';
                addBalanceButton.onclick = () => addBalance(1000);
                shopContainer.appendChild(addBalanceButton);
            } else {
                console.error('Контейнер магазина не найден');
            }
        } catch (error) {
            console.error('Ошибка при добавлении кнопки пополнения баланса:', error);
        }

        // Добавляем обработчики для подсвечников
        const candlesticks = document.querySelectorAll('.candlestick');
        console.log('Найдено подсвечников:', candlesticks.length);
        
        candlesticks.forEach(stand => {
            stand.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Клик по подсвечнику:', stand.id);
                handleCandlestickClick(this);
            });
        });
    } catch (error) {
        console.error('Ошибка при инициализации страницы:', error);
    }
});

// Функция для удаления свечи с подсвечника
function removeCandle(standId) {
    try {
        const stand = document.getElementById(standId);
        if (!stand) {
            console.error(`Подсвечник ${standId} не найден`);
            return;
        }

        const candle = stand.querySelector('.candle-on-candlestick');
        if (!candle) {
            console.log('На этом подсвечнике нет свечи');
            return;
        }

        // Получаем тип свечи перед удалением
        const candleType = candle.getAttribute('data-candle-type');
        
        // Удаляем свечу
        stand.removeChild(candle);
        
        // Обновляем класс подсвечника
        stand.classList.remove('has-candle');
        
        // Увеличиваем количество свечей в коробке
        const candleCount = document.querySelector(`.candle-item[data-candle-type="${candleType}"] .count`);
        if (candleCount) {
            const currentCount = parseInt(candleCount.textContent) || 0;
            candleCount.textContent = currentCount + 1;
        }
        
        // Сохраняем состояние
        saveCandleCounts();
        
        console.log(`Свеча ${candleType} удалена с подсвечника ${standId}`);
    } catch (error) {
        console.error('Ошибка при удалении свечи:', error);
    }
}

// Функция для обработки клика по подсвечнику
function handleCandlestickClick(stand) {
    try {
        const standId = stand.id;
        if (!standId) {
            console.error('У подсвечника нет ID');
            return;
        }

        console.log('Клик по подсвечнику:', standId);

        // Проверяем, есть ли уже свеча на этом подсвечнике
        const existingCandle = stand.querySelector('.candle-on-candlestick');
        if (existingCandle) {
            console.log('Удаляем существующую свечу');
            removeCandle(standId);
        } else {
            console.log('Пытаемся установить новую свечу');
            // Проверяем все типы свечей в коробке
            const candleTypes = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'emerald', 'legendary'];
            let foundCandle = false;

            for (const type of candleTypes) {
                const candleItem = document.querySelector(`#storage-container .candle-item[data-candle-type="${type}"]`);
                console.log('Ищем свечу типа:', type, 'Найден элемент:', candleItem);
                
                if (candleItem) {
                    const candleCount = candleItem.querySelector('.count');
                    console.log('Найден счетчик:', candleCount);
                    
                    if (candleCount) {
                        const count = parseInt(candleCount.textContent) || 0;
                        console.log(`Количество ${type} свечей:`, count);
                        
                        if (count > 0) {
                            console.log(`Нашли ${type} свечу, устанавливаем`);
                            // Если есть свечи этого типа - добавляем свечу
                            placeCandle(type, standId);
                            foundCandle = true;
                            break;
                        }
                    }
                }
            }

            if (!foundCandle) {
                console.log('Нет свечей в коробке');
            }
        }
    } catch (error) {
        console.error('Ошибка при обработке клика по подсвечнику:', error);
    }
}

// Функция для размещения свечи
function placeCandle(candleType, standId) {
    try {
        const stand = document.getElementById(standId);
        if (!stand) {
            console.error('Подсвечник не найден:', standId);
            return;
        }

        // Проверяем наличие свечей в хранилище
        const candleItem = document.querySelector(`.candle-item[data-candle-type="${candleType}"]`);
        if (!candleItem) {
            console.error('Не найден элемент свечи в хранилище:', candleType);
            return;
        }

        const countElement = candleItem.querySelector('.count');
        if (!countElement) {
            console.error('Не найден счетчик свечей');
            return;
        }

        const currentCount = parseInt(countElement.textContent) || 0;
        if (currentCount <= 0) {
            console.error('Нет свечей в хранилище');
            return;
        }

        // Уменьшаем количество свечей в хранилище
        countElement.textContent = currentCount - 1;

        // Создаем элемент свечи
        const candle = document.createElement('div');
        candle.className = 'candle-on-candlestick burning';
        candle.style.backgroundImage = `url('${getCandleImage(candleType)}')`;
        
        // Добавляем свечу на подсвечник
        stand.appendChild(candle);
        stand.classList.add('has-candle');
        
        // Обновляем счетчик
        updateStorageCount();
        
        // Сохраняем состояние
        saveStoredCandles();
        
        // Удаляем свечу через минуту
        setTimeout(() => {
            if (candle.parentNode === stand) {
                stand.removeChild(candle);
                stand.classList.remove('has-candle');
                updateStorageCount();
            }
        }, 60000); // 60 секунд = 1 минута

    } catch (error) {
        console.error('Ошибка при размещении свечи:', error);
    }
} 