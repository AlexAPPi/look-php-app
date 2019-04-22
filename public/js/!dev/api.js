/**
 * @version 0.1.0b
 * @author Alexandr Shamarin [alexsandrshamarin@yandex.ru]
 * @copyright Alexandr Shamarin [2018]
 * @license MIT
 */    
if(!Look) var Look = {};

Look.Waiter = {};

/**
 * Объект ожидания (Официант)
 * 
 * @param {number} delays Время задержки в милисекундах (По умолчанию, задержка перед отправкой составляет 100 мс)
 * @returns {Look.Waiter.Simple} Объект ожидания
 */
Look.Waiter.Simple = function(delays) {

    /** Время задержки в милисекундах */
    var delay = delays || 100;
    /** Указатель на объект this в callback */
    var newThis = this;
    /** Массив с функциями обработки событий */
    var callbacks  = {};
     /** Индекс таймера запуска */
    var timerBegin = null;
    /** Буфер обмена */
    var buffer = null;
    /** Флаг запуска */
    var running = false;
    /** Всегда вызывать ошибку если ответ не получен */
    var vCallErrorIfNotSuccess = false;

    /**
     * Возвращает время ожидания
     * @returns {Number} Время ожидания в милисекундах
     */
    this.getDelay = function () { return delay; };

    /**
     * Возвращает массив из обработчиков
     * @returns {Array}
     */
    this.getCallbacks = function () { return callbacks; };

    /**
     * Очищает массив с обработчиками
     * @returns {this}
     */
    this.clearCallbacks = function(eventName) {
        
        if(eventName) {
            if (typeof callbacks[eventName] === 'undefined') {
                callbacks[eventName] = null; // clear memory
                callbacks[eventName] = [];
            }
        }
        else {
            callbacks = null; // clear memory
            callbacks = {};
        }
        return this;
    };

    /**
     * Устанавливает значение в буфер
     * 
     * @param {type} data Значение
     * @returns {Look.Waiter.Simple}
     */
    this.setBuffer = function (data) {
        buffer = data;
        return this;
    };

    /**
     * Устанавливает указатель this для callback
     * @param {type} nthis -> Указатель this
     * @returns {Look.Waiter.Simple}
     */
    this.setThis = function(nthis) {
        newThis = nthis;
        return this;
    };

    /**
     * Обнуляет указатель this в обработчиках событий
     * @returns {Look.Waiter.Simple}
     */
    this.unsetThis = function() {
        newThis = this;
        return this;
    };

    /**
     * Функция присвоения событию callback
     * 
     * @param {string} eventName Название события
     * @param {function} callback Функция обработчика
     * @returns {Look.Waiter.Simple}
     */
    this.on = function(eventName, callback) {

        // Еще нет обработчиков
        if (typeof callbacks[eventName] === 'undefined') {
            callbacks[eventName] = [];
            //console.log(callbacks);
        }

        callbacks[eventName].push(callback);
        return this;
    };

    /**
     * Функция вызова функции для указанного события
     *  
     * @param {string} eventName Название события
     * @param {object} data Данные для возврата
     * @returns {Boolean}
     */
    this.callback = function (eventName, data) {

        var flag  = false,
            calls = callbacks[eventName], i = 0;

        // Список обраток пустой
        if (Look.Assistants.isArray(calls) && calls.length > 0) {

            // Вызываем функции
            for (; i < calls.length; i++) {

                // Вызываем функции с конца
                //var callback = calls[count - i - 1];
                var callback = calls[i];

                if (Look.Assistants.isFunction(callback)) {

                    callback.call(newThis, data, this);
                    flag = true;
                }
            }
        }

        return flag;
    };

    /**
     * Всегда вызывает ошибку, вместо других событий (onabort, ontimeout, ...),
     * если ответ не получен
     * 
     * @argument {boolean} value -> Флаг
     * @returns {Look.Waiter.Simple}
     */
    this.callErrorIfNotSuccess = function(value) {
        vCallErrorIfNotSuccess = value || true;
        return this;
    };

    /**
     * Проверяет, вызывается ли ошибка, вместо других событий (onabort, ontimeout, ...)
     * @returns {boolean}
     */
    this.calledErrorIfNotSuccess = function() {
        return vCallErrorIfNotSuccess;
    };

    /**
     * Устанавливает событие при инициализации
     * @param {function} callback
     * @returns {Look.Waiter.Simple}
     */
    this.onInit = function (callback) { return this.on("init", callback); };

    /**
     * Устаналивает событие при вызове отмены запроса
     * @param {function} callback
     * @returns {Look.Waiter.Simple}
     */
    this.onAbort = function (callback) { return this.on("abort", callback); };

    // Функции вызова события
    this.callbackInit  = function (data) { this.callback("init", data); };
    this.callbackAbort = function (data) { this.callback("abort", data); };

    /**
     * Останавливает ожидание
     * 
     * @param {Mixed}    data     Данные для передачи
     * @param {Function} callback Функция обработки
     * @returns {Look.Waiter.Simple}
     */
    this.abort = function (data, callback) {

        callback = callback || true;

        if(timerBegin) {
            clearTimeout(timerBegin);
        }
        
        // Процесс был уже запущен, прерываем его
        if (running && callback) {
            this.callbackAbort(data);
        }
        
        running = false;

        return this;
    };
    
    /**
     * Прерывает все ожидания и немедленно запускает инициализацию процесса
     * 
     * @param {number} time На сколько стоит отложить ожидание в милисекундах
     * @returns {Look.Waiter.Simple}
     */
    this.init = function() {
        
        if(!running) {
            
            if(timerBegin) {
                clearTimeout(timerBegin);
            }
            
            running = true;
            this.callbackInit();
        }
        
        return this;
    };

    /**
     * Откладывает ожидание
     * 
     * @param {number} time На сколько стоит отложить ожидание в милисекундах
     * @returns {Look.Waiter.Simple}
     */
    this.sleep = function (time) {

        var self = this;

        this.abort(null, false);
        delay = time || delay;

        timerBegin = setTimeout(function () {
            self.init();
        }, delay);

        return this;
    };

    // Запускает процесс ожидания
    this.sleep();
};

/**
 * Функция перезапускает процесс
 * 
 * @param {Number} delay Задержка перед перезапуском
 * @returns {Look.Waiter.Simple}
 */
Look.Waiter.Simple.prototype.repeat = function (delay) {

    this.sleep(delay);
    return this;
};

/**
 * Проверяет существование обработчиков для указанного события
 * @param {String} eventName 
 * @returns {Boolean}
 */
Look.Waiter.Simple.prototype.callbackExists = function (eventName) {

    var tmp = this.getCallbacks();

    if(typeof tmp[eventName] !== 'undefined' && tmp[eventName].length > 0)
        return true;

    return false;
};

/**
 * Объект ожидания с ошибкой
 * 
 * @param {Number} delay Задержка перед выполнением
 * @returns {Look.Waiter.Errorable}
 */
Look.Waiter.Errorable = function(delay) { Look.Waiter.Simple.call(this, delay); };

Look.Waiter.Errorable.prototype = Object.create(Look.Waiter.Simple.prototype);
Look.Waiter.Errorable.prototype.constructor = Look.Waiter.Errorable;

Look.Waiter.Errorable.prototype.onSuccess = function (callback) { return this.on("success", callback); };
Look.Waiter.Errorable.prototype.onError   = function (callback) { return this.on("error", callback); };

Look.Waiter.Errorable.prototype.callbackSuccess = function (data) { return this.callback("success", data); };
Look.Waiter.Errorable.prototype.callbackError   = function (data) { return this.callback("error", data); };

/**
 * Объект ожидания ответа
 * 
 * @param {number} delay Задержка перед выполнением
 * @returns {Look.Waiter.Queryable}
 */
Look.Waiter.Queryable = function(delay) { Look.Waiter.Errorable.call(this, delay); };

Look.Waiter.Queryable.prototype = Object.create(Look.Waiter.Errorable.prototype);
Look.Waiter.Queryable.prototype.constructor = Look.Waiter.Queryable;

Look.Waiter.Queryable.prototype.callbackStart   = function (data) { return this.callback("start", data); };
Look.Waiter.Queryable.prototype.callbackTimeout = function (data) { return this.callback("timeout", data); };
Look.Waiter.Queryable.prototype.callbackProcess = function (data) { return this.callback("process", data); };

Look.Waiter.Queryable.prototype.onStart   = function (callback) { return this.on("start", callback); };
Look.Waiter.Queryable.prototype.onTimeout = function (callback) { return this.on("timeout", callback); };
Look.Waiter.Queryable.prototype.onProcess = function (callback) { return this.on("process", callback); };

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Look.API = {};

/**
 * Базовый класс для работы с REST API движка LooK
 * 
 * @param {String} accessToken Ключ доступа
 * @param {String} publicKey   Публичный ключ шифрования
 * @param {String} privateKey  Приватный ключ шифрования
 * @param {Number} expiresIn   Время обновления токена
 * @returns {Look.API.Token}
 */
Look.API.Token = function(accessToken, publicKey, privateKey, expiresIn) {

    publicKey  = Look.Assistants.hex2a(publicKey);
    privateKey = Look.Assistants.hex2a(privateKey);

    var encrypt = new JSEncrypt(),
        decrypt = new JSEncrypt();
    
    encrypt.setPublicKey(publicKey);
    decrypt.setPrivateKey(privateKey);

    /**
     * @type {String}
     */
    this.accessToken = accessToken;
    
    /**
     * @type {JSEncrypt}
     */
    this.publicKey  = encrypt;
    
    /**
     * @type {JSEncrypt}
     */
    this.privateKey = decrypt;
    
    /**
     * @type {Number}
     */
    this.expiresIn  = expiresIn;
};

/**
 * Проверяет, данный токен еще не устарел
 * @returns {Boolean}
 */
Look.API.Token.prototype.isExpired = function() {
    
    // бессмертный
    if(this.expiresIn === 0) {
        return false;
    }
    
    return Look.Assistants.getCurrectTimeStamp() > this.expiresIn;
};

/**
 * Проверяет, поддерживает ли данный токен возможность шифрованя
 * @returns {Boolean}
 */
Look.API.Token.prototype.supportSendProtectedData = function() {
    return typeof this.publicKey !== 'undefined';
};

/**
 * Проверяет, поддерживает ли данный токен возможность получать зашифрованные данные
 * @returns {Boolean}
 */
Look.API.Token.prototype.supportGetProtectedData = function() {
    return typeof this.privateKey !== 'undefined';
};

/**
 * Создает новую сессию для запроса к API<br>
 * 
 * При успешном создании новой сессии,<br>
 * <b>onSuccess</b> будет передан новый объект <b>API</b>,<br>
 * с новым токеном и секретным ключом<br>
 * 
 * @param {String} login   Логин
 * @param {String} pass    Пароль
 * @param {Number} expires Время жизни сессии (в секундах) 0 - бессметрная
 * @param {Number} delay   Задержка перед открытием сессии
 * @param {Number} timeout Максимальное время ожидание запроса
 * @returns {Look.API.Session}
 */
Look.API.Session = function(login, pass) {
        
    /**
     * Токен
     * @type {Look.API.Token}
     */
    this.token     = null;
    this.login     = login;
    this.signature = md5(pass + login);
    this.baseUrl   = '/api/';
};

/**
 * Обновляет токен
 * @param {Number} expires Время жизни сессии
 * @param {Number} delay   Задержка перед обновлением
 * @param {Number} timeout Максимальное время ожидание запроса
 * @returns {undefined}
 */
Look.API.Session.prototype.start = function(expires, delay, timeout) {
    
    var method, data, self = this,
        waiter = new Look.Waiter.Queryable(delay);
    
    this.expires = expires || 0;
    
    method = {
        name:   'auth.getTunnelToken',
        method: 'GET',
        tunnel: false
    };
    
    data = {
        login:     this.login,
        signature: this.signature,
        expires:   this.expires
    };
    
    self.ask(method, data, delay, timeout)
    .onStart(function(data) { waiter.callbackStart(data); })
    .onProcess(function(data) { waiter.callbackProcess(data); })
    .onTimeout(function(data) { waiter.callbackError(data); })
    .onError(function(err) { waiter.callbackError(err); })
    .onSuccess(function(data) {
        
        self.token = new Look.API.Token(
            data.access_token,
            data.public_key,
            data.private_key,
            data.expires_in
        );

        waiter.callbackSuccess();
    });
    
    return waiter;
};

/**
 * Обновляет токен, если он устарел
 * @param {Number} expires Время жизни сессии
 * @param {Number} delay   Задержка перед обновлением
 * @param {Number} timeout Максимальное время ожидание запроса
 * @returns {Look.Waiter.Queryable|Boolean}
 */
Look.API.Session.prototype.updateIfExpired = function(expires, delay, timeout) {
    if(!this.token || this.token.isExpired()) {
        return this.start(expires, delay, timeout);
    }
    return false;
};

/**
 * Устанавливает базовый url
 * 
 * @param {String} url
 * @returns {Look.API.Session}
 */
Look.API.Session.prototype.setBaseUrl = function(url) {
    
    this.baseUrl = url;
    return this;
};

/**
 * Конструктор URL запроса
 * 
 * @param {Array} method Метод запроса
 * @param {Array} data   Параметры запроса
 * @returns {Array|XMLHttpRequest}
 */
Look.API.Session.prototype._askXhrBuilder = function(method, data) {
    
    var url, send, headers = {}, xhr = Look.Assistants.getXhr();
    
    if(!data) {
        data = {};
    }
    
    // set token if not exists
    if(!data.accessToken && this.token) {
        data.accessToken = this.token.accessToken;
    }
    
    // no cache
    data._ = Look.Assistants.getCurrectTimeStamp();
    url    = this.baseUrl + method.name;
    send   = Look.Assistants.param(data);
    
    if(method.tunnel) {
        
        // Не поддерживает отправку зашифрованный данных
        if(!this.token.supportSendProtectedData()) {
            throw new Error('Session token can\'t send protected data');
        }
        
        var data = '';
        headers['X-LOOK-PROTECTED-DATA'] = data;
        send = '';
    }
    
    if(method.method === 'GET' && send.length > 0) {
        url += '?' + send;
    }
    
    xhr.open(method.method, url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    
    for(var name in headers) {
        xhr.setRequestHeader(name, headers[name]);
    }
    
    return [xhr, url, send];
};

/**
 * Обработчик ответа 200
 * 
 * @param {XMLHttpRequest}       xhr     Обхект XMLHttpRequest
 * @param {Look.Waiter.Simple}   waiter  Объект Waiter
 * @param {Array}                data    Параметры запроса
 * @returns {Boolean}
 */
Look.API.Session.prototype._askResponceHandler = function(xhr, waiter, data) {

    var ans;

    // Парсим полученне данные
    // Если данные вернулись не в JSON формате
    // возвращаем ошибку 500
    try { ans = JSON.parse(xhr.responseText); }
    catch (e) {
        ans = Look.Assistants.errorSimulationObject(500, xhr.responseText, data);
    }
    
    // Сервер возвращает ответ в объекте response
    if (typeof ans.response !== 'undefined') {

        waiter.callbackSuccess(ans.response);
        return true;
    }
    
    waiter.callbackError(ans.error);
    return false;
};

/**
 * Функция создает запрос к API
 * 
 * @param {Array|String} _method  Метод запроса
 * @param {Array}        _data    Тело запроса
 * @param {Number}       _delay   Задержка перед запросом
 * @param {Number}       _timeout Максимальное время ожидание запроса
 * @returns {Look.Waiter.Queryable}
 */
Look.API.Session.prototype.ask = function(_method, _data, _delay, _timeout) {

    var data    = _data || {},
        timeout = _timeout,
        self    = this,
        method, waiter;

    if(typeof _method === 'string') {

        method = {
            name:    _method,
            method: 'GET',
            tunnel: false
        };
    }
    else if(typeof _method.name === "undefined") {

        method = {};
        method.name = _method[0];

        if(typeof _method[1] === "boolean") {
            method.method = 'GET';
            method.tunnel = _method[1];
        } else {
            method.method = _method[1] || 'GET';
            method.tunnel = _method[2] || false;
        }
    }
    else {
        method = _method;
    }

    waiter = new Look.Waiter.Queryable(_delay);
    
    return waiter.onInit(function() {
        
        var callFromChange  = false,
            abortFromWaiter = false;

        var builder         = self._askXhrBuilder(method, data),
            xhr             = builder[0],
            value           = builder[2];

        xhr.onreadystatechange = function() {

            if (xhr.readyState === 4) {

                if(xhr.status === 200) {

                    if(!self._askResponceHandler(xhr, waiter, data))
                        callFromChange = true;
                }
                else {
                    callFromChange = true;
                    waiter.callbackError(
                        Look.Assistants.errorSimulationObject(xhr.status, xhr.responseText, data, true)
                    );
                }
            }
        };

        xhr.onerror = function() {
            if(!callFromChange)
                waiter.callbackError(
                    Look.Assistants.errorSimulationObject(xhr.status, xhr.responseText, data, true)
                );
        };

        waiter.onAbort(function() {
            abortFromWaiter = true;
            xhr.abort();
        });

        xhr.onabort = function() {
            if(abortFromWaiter) {
                if(waiter.calledErrorIfNotSuccess())
                    waiter.callbackError(
                        Look.Assistants.errorSimulationObject(-300, 'query abort', data, true)
                    );
                else waiter.callbackAbort();
            }
        };

        xhr.ontimeout = function() {

            var error = Look.Assistants.errorSimulationObject(-300, 'query timeout', data, true);

            if(waiter.calledErrorIfNotSuccess()) waiter.callbackError(error);
            else                                 waiter.callbackTimeout(error);
        };

        // Активируем ограничение времени ожидания запроса
        if (timeout) {
            xhr.timeout = timeout;
        }

        if(method.method === 'GET') {

            xhr.onprogress = function(event) { waiter.callbackProcess(event); };
            xhr.send();
        }
        else {

            xhr.upload.onprogress = function(event) { waiter.callbackProcess(event); };
            xhr.send(value);
        }
        
        waiter.callbackStart();
    });
};