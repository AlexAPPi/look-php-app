String.prototype.toUrl = function() {
    var str = this.toLowerCase(); // все в нижний регистр
    var cyr2latChars = new Array(
        ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'],
        ['д', 'd'],  ['е', 'e'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'],
        ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'],
        ['м', 'm'],  ['н', 'n'], ['о', 'o'], ['п', 'p'],  ['р', 'r'],
        ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'],
        ['х', 'h'],  ['ц', 'c'], ['ч', 'ch'],['ш', 'sh'], ['щ', 'shch'],
        ['ъ', ''],  ['ы', 'y'], ['ь', ''],  ['э', 'e'], ['ю', 'yu'], ['я', 'ya'],

        ['А', 'A'], ['Б', 'B'],  ['В', 'V'], ['Г', 'G'],
        ['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'],  ['Ж', 'ZH'], ['З', 'Z'],
        ['И', 'I'], ['Й', 'Y'],  ['К', 'K'], ['Л', 'L'],
        ['М', 'M'], ['Н', 'N'], ['О', 'O'],  ['П', 'P'],  ['Р', 'R'],
        ['С', 'S'], ['Т', 'T'],  ['У', 'U'], ['Ф', 'F'],
        ['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'],
        ['Ъ', ''],  ['Ы', 'Y'],
        ['Ь', ''],
        ['Э', 'E'],
        ['Ю', 'YU'],
        ['Я', 'YA'],

        ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'],
        ['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'],
        ['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'],
        ['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'],
        ['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'],
        ['z', 'z'],

        ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'],['E', 'E'],
        ['F', 'F'],['G', 'G'],['H', 'H'],['I', 'I'],['J', 'J'],['K', 'K'],
        ['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'],['P', 'P'],
        ['Q', 'Q'],['R', 'R'],['S', 'S'],['T', 'T'],['U', 'U'],['V', 'V'],
        ['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'],

        [' ', '_'],['0', '0'],['1', '1'],['2', '2'],['3', '3'],
        ['4', '4'],['5', '5'],['6', '6'],['7', '7'],['8', '8'],['9', '9'],
        ['-', '-']
    );

    var newStr = new String();
    for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i), newCh = '';
        for (var j = 0; j < cyr2latChars.length; j++) {
            if (ch == cyr2latChars[j][0]) {
                newCh = cyr2latChars[j][1];
            }
        }
        newStr += newCh;
    }
    // Удаляем повторяющие знаки - Именно на них заменяются пробелы.
    // Так же удаляем символы перевода строки, но это наверное уже лишнее
    return newStr.replace(/[_]{2,}/gim, '_').replace(/\n/gim, '');
};

/** Проверяет строку на соответствие типу char[16] @returns {Boolean} */
String.prototype.isChar16 = function() { return this.length < 17; };
/** Проверяет строку на соответствие типу char[32] @returns {Boolean} */
String.prototype.isChar32 = function() { return this.length < 33; };
/** Проверяет строку на соответствие типу char[64] @returns {Boolean} */
String.prototype.isChar64 = function() { return this.length < 65; };
/** Проверяет строку на соответствие типу char[128] @returns {Boolean} */
String.prototype.isChar128 = function() { return this.length < 129; };
/** Проверяет строку на соответствие типу char[255] @returns {Boolean} */
String.prototype.isChar255 = function() { return this.length < 256; };

/**
 * @version 0.1.0b
 * @author Alexandr Shamarin [alexsandrshamarin@yandex.ru]
 * @copyright Alexandr Shamarin [2018]
 * @license MIT
 * @type API
 */

if(!Look) var Look = {};
Look.Object = {};

/**
 * Базовый объект Фреймворка
 * @param {Number}  id     -> Уникальный индекс
 * @param {Boolean} active -> Флаг активности
 * @returns {Look.Object.Simple}
 */
Look.Object.Simple = function(id, active) {
    
    /** Уникальный ID @type int */
    this.id = id;
    /** Возможность использоания */
    this.active = active || true;
};

/**
 * Класс свойства
 * 
 * @param {number}    id          -> Уникальный индификатор
 * @param {char[255]} code        -> Уникальный код
 * @param {char[255]} name        -> Название свойства
 * @param {char[255]} title       -> Заголовок в шаблоне
 * @param {char[255]} description -> Описание в шаблоне
 * @param {char[32]}  type        -> Тип (varchar, color, dimension, numeric)
 * @param {char[16]}  status      -> Статус доступности (public, private, protected)
 * @param {boolean}   active      -> Возможность использоания
 * @returns {Property}
 */
Look.Object.Property = function (id, code, name, title, description, type, status, active) {
    
    Look.Object.Simple.call(this, id, active);
    
    /** Код свойства @type string */
    this.code = null;
    
    /** Название свойтва @type string[255] */
    this.name = name || '';
    
    /** Заголовок @type string[255] */
    this.title = title || '';
    
    /** Описание */
    this.description = description || '';
    
    /** Тип свойства @type string */
    this.type   = type   || 'varhar';
    
    /** Доступ свойства @type string */
    this.status = status || 'public';
};

Look.Object.Property.prototype = Object.create(Look.Object.Simple.prototype);
Look.Object.Property.prototype.constructor = Look.Object.Property;

/******************************************************************************/
Look.Object.PropertyValue = {};
/******************************************************************************/

/**
 * Базовый класс значения свойства
 * @param {Number} id          -> Уникальный индекс
 * @param {Number} property_id -> Уникалный индекс свойства
 * @param {Number} active      -> Флаг активности
 * @returns {Look.Object.PropertyValue.Simple}
 */
Look.Object.PropertyValue.Simple = function(id, property_id, active) {
    Look.Object.Simple.call(this, id, active);
    this.property_id = property_id;
};

Look.Object.Property.prototype = Object.create(Look.Object.Simple.prototype);
Look.Object.Property.prototype.constructor = Look.Object.Property;

/**
 * 
 * @param {Number}  id
 * @param {Number}  property_id
 * @param {String}  code
 * @param {String}  name
 * @param {Number}  r Составляющая часть красного цвета
 * @param {Number}  g Составляющая часть зеленого цвета
 * @param {Number}  b Составляющая часть голубого цвета
 * @param {Boolean} active
 * @returns {Look.Object.PropertyValueColor}
 */
Look.Object.PropertyValue.Color = function(id, property_id, code, name, r, g, b, active) {
    
    Look.Object.Simple.call(this, id, active);
    
    /** Индекс свойства */
    this.property_id = property_id;
    /** Уникальный код */
    this.code = code || '';
    /** Имя */
    this.name = name || '';
    /** Составляющая часть красного цвета */
    this.r = r || 0;
    /** Составляющая часть зеленого цвета */
    this.g = g || 0;
    /** Составляющая часть голубого цвета */
    this.b = b || 0;
};

Look.Object.PropertyValue.Color.prototype = Object.create(Look.Object.Simple.prototype);
Look.Object.PropertyValue.Color.prototype.constructor = Look.Object.PropertyValueColor;

/**
 * Устанавливает значения цвета из int 
 * @param {Number} int
 * @returns {Look.Object.PropertyValueColor.prototype}
 */
Look.Object.PropertyValueColor.prototype.setFromInt = function(int) {
    if (typeof int !== 'number') throw new Error('Type of int must be number');
    if (Math.floor(int) !== int) throw new Error('Type of int must be integer');
    if (int < 0 || int > 16777215) throw new Error('Type of int must be more 0 and less 16777215');
    this.r = int >> 16;
    this.g = int - (this.r << 16) >> 8;
    this.b = int - (this.r << 16) - (this.g << 8);
    return this;
};

/**
 * Устанавливает значения цвета из hex 
 * @param {String} hex
 * @returns {Look.Object.PropertyValueColor.prototype}
 */
Look.Object.PropertyValueColor.prototype.setFromHex = function(hex) {
    var bigint = parseInt(hex, 16);
    this.r = (bigint >> 16) & 255;
    this.g = (bigint >> 8) & 255;
    this.b = bigint & 255;
    return this;
};






var t = new Look.Object.Property(2);



console.log(t);





var session = new Look.API('qwe', 'qwe'), count = 0;

session.newSession('', '', ['addphoto']).onSuccess(function(session) {
    console.log(session);
}).onError(function(err, waiter) {

    console.log(err);
    count++;

    if(count < 4)
        waiter.repeat(1000);
});

function Name(name, key) {
    this.name = name;
    this.key  = key;
}

function User(id, name, key) {
    this.id   = id;
    this.test = new Name(name, key);
}

session.ask(['auth.test', true], {user: new User(123, 'EEEE its work', 'EEE')})
.callErrorIfNotSuccess()
.onSuccess(function(data) { console.log(data); })
.onError(function(error) { console.log(error); })
.onProcess(function(event, waiter) { waiter.abort(); console.log(event); })
.onAbort(function() { console.log('Abort!!!'); });

