module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var parser = __webpack_require__(1);
	var invalidInputMessage = 'invalid input';
	function read(input) {
	    var data;
	    if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
	        data = input;
	    }
	    else if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
	        data = new Uint8Array(input);
	    }
	    else {
	        return Promise.reject(new Error(invalidInputMessage));
	    }
	    return parser.read(data).catch(function () { return Promise.reject(new Error(invalidInputMessage)); });
	}
	exports.read = read;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var tokens_1 = __webpack_require__(2);
	var transaction_reference_number_1 = __webpack_require__(3);
	var related_reference_number_1 = __webpack_require__(5);
	var account_id_1 = __webpack_require__(6);
	var statement_number_1 = __webpack_require__(7);
	var opening_balance_1 = __webpack_require__(8);
	var closing_available_balance_1 = __webpack_require__(9);
	var forward_available_balance_1 = __webpack_require__(10);
	var closing_balance_1 = __webpack_require__(11);
	var information_for_account_owner_1 = __webpack_require__(12);
	var transaction_info_1 = __webpack_require__(13);
	var tags = [
	    transaction_reference_number_1.default,
	    related_reference_number_1.default,
	    account_id_1.default,
	    statement_number_1.default,
	    information_for_account_owner_1.default,
	    opening_balance_1.default,
	    closing_balance_1.default,
	    closing_available_balance_1.default,
	    forward_available_balance_1.default,
	    transaction_info_1.default
	];
	var tagsCount = tags.length;
	function closeCurrentTag(state) {
	    if (state.tag && state.tag.close) {
	        state.tag.close(state);
	    }
	}
	function read(data) {
	    var length = data.length;
	    var state = {
	        pos: 0,
	        statementIndex: -1,
	        transactionIndex: -1,
	        data: data,
	        statements: []
	    };
	    while (state.pos < length) {
	        var symbolCode = data[state.pos];
	        var skipReading = false;
	        // check if it's a tag
	        if (symbolCode === tokens_1.colonSymbolCode && (state.pos === 0 || data[state.pos - 1] === tokens_1.newLineSymbolCode)) {
	            for (var i = 0; i < tagsCount; i++) {
	                var tag = tags[i];
	                var newPos = tag.readToken(state);
	                if (newPos) {
	                    closeCurrentTag(state);
	                    state.pos = newPos;
	                    state.tagContentStart = newPos;
	                    state.tagContentEnd = newPos;
	                    state.tag = tag;
	                    if (state.tag.open) {
	                        state.tag.open(state);
	                    }
	                    break;
	                }
	            }
	        }
	        else if (symbolCode === tokens_1.newLineSymbolCode || symbolCode === tokens_1.returnSymbolCode) {
	            skipReading = !state.tag || !state.tag.multiline;
	        }
	        if (!skipReading && state.tag) {
	            state.tagContentEnd++;
	            if (state.tag.readContent) {
	                state.tag.readContent(state, data[state.pos]);
	            }
	        }
	        state.pos++;
	    }
	    closeCurrentTag(state);
	    return Promise.resolve(state.statements);
	}
	exports.read = read;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * @description ":"
	 * @type {number}
	 */
	exports.colonSymbolCode = 58;
	/**
	 * @description "\n"
	 * @type {number}
	 */
	exports.newLineSymbolCode = 10;
	/**
	 * @description "\r"
	 * @type {number}
	 */
	exports.returnSymbolCode = 13;
	/**
	 * @description "/"
	 * @type {number}
	 */
	exports.slashSymbolCode = 47;
	/**
	 * @description "0"
	 * @type {number}
	 */
	exports.zeroSymbolCode = 48;
	/**
	 * @description "9"
	 * @type {number}
	 */
	exports.nineSymbolCode = 57;
	/**
	 * @description "."
	 * @type {number}
	 */
	exports.dotSymbolCode = 46;
	/**
	 * @description ","
	 * @type {number}
	 */
	exports.commaSymbolCode = 44;
	/**
	 * @description "C"
	 * @type {number}
	 */
	exports.bigCSymbolCode = 67;
	/**
	 * @description Space symbol, " "
	 * @type {number}
	 */
	exports.spaceSymbolCode = 32;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	/**
	 * @description :20:
	 * @type {Uint8Array}
	 */
	var token = new Uint8Array([tokens_1.colonSymbolCode, 50, 48, tokens_1.colonSymbolCode]);
	var tokenLength = token.length;
	var transactionReferenceNumberTag = {
	    readToken: function (state) {
	        if (!compare_arrays_1.default(token, 0, state.data, state.pos, tokenLength)) {
	            return 0;
	        }
	        return state.pos + tokenLength;
	    },
	    open: function (state) {
	        state.statementIndex++;
	        state.transactionIndex = -1;
	        state.statements.push({
	            transactions: []
	        });
	    },
	    close: function (state) {
	        state.statements[state.statementIndex].referenceNumber = String.fromCharCode.apply(String, state.data.slice(state.tagContentStart, state.tagContentEnd));
	    }
	};
	exports.default = transactionReferenceNumberTag;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function compareArrays(firstArray, firstArrayOffset, secondArray, secondArrayOffset, length) {
	    for (var i = 0; i < length; i++) {
	        if (firstArray[firstArrayOffset + i] !== secondArray[secondArrayOffset + i]) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.default = compareArrays;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	/**
	 * @description :21:
	 * @type {Uint8Array}
	 */
	var token = new Uint8Array([tokens_1.colonSymbolCode, 50, 49, tokens_1.colonSymbolCode]);
	var tokenLength = token.length;
	var relatedReferenceNumberTag = {
	    readToken: function (state) {
	        if (!compare_arrays_1.default(token, 0, state.data, state.pos, tokenLength)) {
	            return 0;
	        }
	        return state.pos + tokenLength;
	    },
	    close: function (state) {
	        state.statements[state.statementIndex].relatedReferenceNumber = String.fromCharCode.apply(String, state.data.slice(state.tagContentStart, state.tagContentEnd));
	    }
	};
	exports.default = relatedReferenceNumberTag;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	/**
	 * @description :25:
	 * @type {Uint8Array}
	 */
	var token = new Uint8Array([tokens_1.colonSymbolCode, 50, 53, tokens_1.colonSymbolCode]);
	var tokenLength = token.length;
	var accountIdTag = {
	    readToken: function (state) {
	        if (!compare_arrays_1.default(token, 0, state.data, state.pos, tokenLength)) {
	            return 0;
	        }
	        return state.pos + tokenLength;
	    },
	    close: function (state) {
	        state.statements[state.statementIndex].accountId = String.fromCharCode.apply(String, state.data.slice(state.tagContentStart, state.tagContentEnd));
	    }
	};
	exports.default = accountIdTag;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	/**
	 * @description :28:
	 * @type {Uint8Array}
	 */
	var token1 = new Uint8Array([tokens_1.colonSymbolCode, 50, 56, tokens_1.colonSymbolCode]);
	/**
	 * @description :28C:
	 * @type {Uint8Array}
	 */
	var token2 = new Uint8Array([tokens_1.colonSymbolCode, 50, 56, 67, tokens_1.colonSymbolCode]);
	var token1Length = token1.length;
	var token2Length = token2.length;
	var statementNumberTag = {
	    readToken: function (state) {
	        var isToken1 = compare_arrays_1.default(token1, 0, state.data, state.pos, token1Length);
	        var isToken2 = !isToken1 && compare_arrays_1.default(token2, 0, state.data, state.pos, token2Length);
	        if (!isToken1 && !isToken2) {
	            return 0;
	        }
	        this.slashPos = 0;
	        return state.pos + (isToken1 ? token1Length : token2Length);
	    },
	    readContent: function (state, symbolCode) {
	        if (symbolCode === tokens_1.slashSymbolCode) {
	            this.slashPos = state.pos;
	        }
	    },
	    close: function (state) {
	        state.statements[state.statementIndex].number = String.fromCharCode.apply(String, state.data.slice(state.tagContentStart, this.slashPos || state.tagContentEnd));
	    }
	};
	exports.default = statementNumberTag;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	/**
	 * @description :60M:
	 * @type {Uint8Array}
	 */
	var token1 = new Uint8Array([tokens_1.colonSymbolCode, 54, 48, 77, tokens_1.colonSymbolCode]);
	/**
	 * @description :60F:
	 * @type {Uint8Array}
	 */
	var token2 = new Uint8Array([tokens_1.colonSymbolCode, 54, 48, 70, tokens_1.colonSymbolCode]);
	var token1Length = token1.length;
	var token2Length = token2.length;
	var openingBalanceTag = {
	    readToken: function (state) {
	        var isToken1 = compare_arrays_1.default(token1, 0, state.data, state.pos, token1Length);
	        var isToken2 = !isToken1 && compare_arrays_1.default(token2, 0, state.data, state.pos, token2Length);
	        if (!isToken1 && !isToken2) {
	            return 0;
	        }
	        this.init();
	        state.statements[state.statementIndex].openingBalance = this.info;
	        return state.pos + (isToken1 ? token1Length : token2Length);
	    },
	    init: function () {
	        this.info = {
	            isCredit: false,
	            date: '',
	            currency: '',
	            value: 0
	        };
	        this.contentPos = 0;
	        this.balance = [];
	    },
	    readContent: function (state, symbolCode) {
	        var _a = this, info = _a.info, contentPos = _a.contentPos;
	        if (!contentPos) {
	            // status is 'C'
	            info.isCredit = symbolCode === tokens_1.bigCSymbolCode;
	        }
	        else if (contentPos < 7) {
	            // it's a date. Collect date and convert it from YYMMDD to YYYY-MM-DD
	            if (!info.date) {
	                if (symbolCode === tokens_1.nineSymbolCode) {
	                    info.date = '19';
	                }
	                else {
	                    info.date = '20';
	                }
	            }
	            info.date += String.fromCharCode(symbolCode);
	            if (contentPos === 2 || contentPos === 4) {
	                info.date += '-';
	            }
	        }
	        else if (contentPos < 10) {
	            // it's a currency
	            info.currency += String.fromCharCode(symbolCode);
	        }
	        else {
	            // it's a balance
	            // use always a dot as decimal separator
	            if (symbolCode === tokens_1.commaSymbolCode) {
	                symbolCode = tokens_1.dotSymbolCode;
	            }
	            this.balance.push(symbolCode);
	        }
	        this.contentPos++;
	    },
	    close: function () {
	        this.info.value = parseFloat(String.fromCharCode.apply(String, this.balance));
	    }
	};
	exports.default = openingBalanceTag;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	var opening_balance_1 = __webpack_require__(8);
	/**
	 * @description :64:
	 * @type {Uint8Array}
	 */
	exports.token = new Uint8Array([tokens_1.colonSymbolCode, 54, 52, tokens_1.colonSymbolCode]);
	var tokenLength = exports.token.length;
	var closingAvailableBalance = {
	    readToken: function (state) {
	        if (!compare_arrays_1.default(exports.token, 0, state.data, state.pos, tokenLength)) {
	            return 0;
	        }
	        opening_balance_1.default.init.call(this);
	        state.statements[state.statementIndex].closingAvailableBalance = this.info;
	        return state.pos + tokenLength;
	    },
	    readContent: opening_balance_1.default.readContent,
	    close: opening_balance_1.default.close
	};
	exports.default = closingAvailableBalance;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	var opening_balance_1 = __webpack_require__(8);
	/**
	 * @description :65:
	 * @type {Uint8Array}
	 */
	exports.token = new Uint8Array([tokens_1.colonSymbolCode, 54, 53, tokens_1.colonSymbolCode]);
	var tokenLength = exports.token.length;
	var forwardAvailableBalance = {
	    readToken: function (state) {
	        if (!compare_arrays_1.default(exports.token, 0, state.data, state.pos, tokenLength)) {
	            return 0;
	        }
	        opening_balance_1.default.init.call(this);
	        state.statements[state.statementIndex].forwardAvailableBalance = this.info;
	        return state.pos + tokenLength;
	    },
	    readContent: opening_balance_1.default.readContent,
	    close: opening_balance_1.default.close
	};
	exports.default = forwardAvailableBalance;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	var opening_balance_1 = __webpack_require__(8);
	/**
	 * @description :62M:
	 * @type {Uint8Array}
	 */
	exports.token1 = new Uint8Array([tokens_1.colonSymbolCode, 54, 50, 77, tokens_1.colonSymbolCode]);
	/**
	 * @description :62F:
	 * @type {Uint8Array}
	 */
	exports.token2 = new Uint8Array([tokens_1.colonSymbolCode, 54, 50, 70, tokens_1.colonSymbolCode]);
	var token1Length = exports.token1.length;
	var token2Length = exports.token2.length;
	var closingBalanceTag = {
	    readToken: function (state) {
	        var isToken1 = compare_arrays_1.default(exports.token1, 0, state.data, state.pos, token1Length);
	        var isToken2 = !isToken1 && compare_arrays_1.default(exports.token2, 0, state.data, state.pos, token2Length);
	        if (!isToken1 && !isToken2) {
	            return 0;
	        }
	        opening_balance_1.default.init.call(this);
	        state.statements[state.statementIndex].closingBalance = this.info;
	        return state.pos + (isToken1 ? token1Length : token2Length);
	    },
	    readContent: opening_balance_1.default.readContent,
	    close: opening_balance_1.default.close
	};
	exports.default = closingBalanceTag;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var tokens_1 = __webpack_require__(2);
	/**
	 * @description :86:
	 * @type {Uint8Array}
	 */
	var token = new Uint8Array([tokens_1.colonSymbolCode, 56, 54, tokens_1.colonSymbolCode]);
	var tokenLength = token.length;
	var informationTag = {
	    multiline: true,
	    readToken: function (state) {
	        if (!compare_arrays_1.default(token, 0, state.data, state.pos, tokenLength)) {
	            return 0;
	        }
	        return state.pos + tokenLength;
	    },
	    close: function (state) {
	        var statement = state.statements[state.statementIndex];
	        var description = [];
	        var descriptionLength = 0;
	        // filter denied symbols
	        for (var i = state.tagContentStart; i < state.tagContentEnd; i++) {
	            var symbolCode = state.data[i];
	            if (
	            // remove \r & \n
	            symbolCode !== tokens_1.returnSymbolCode && symbolCode !== tokens_1.newLineSymbolCode && (
	            // use 1 space instead of multiple ones
	            symbolCode !== tokens_1.spaceSymbolCode || description[descriptionLength - 1] !== symbolCode)) {
	                description[descriptionLength] = symbolCode;
	                descriptionLength++;
	            }
	        }
	        statement.transactions[state.transactionIndex].description = String.fromCharCode.apply(String, description).trim();
	    }
	};
	exports.default = informationTag;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compare_arrays_1 = __webpack_require__(4);
	var md5_1 = __webpack_require__(14);
	var tokens_1 = __webpack_require__(2);
	var transactionInfoPattern = new RegExp([
	    '^\\\s*',
	    '([0-9]{2})',
	    '([0-9]{2})',
	    '([0-9]{2})',
	    '([0-9]{2})?',
	    '([0-9]{2})?',
	    '(C|D|RD|RC)',
	    '([A-Z]{1})?',
	    '([0-9,\.]+)',
	    '([A-Z0-9]{4})' // Transaction code
	].join(''));
	var commaPattern = /,/;
	var dotSymbol = String.fromCharCode(tokens_1.dotSymbolCode);
	var incomeTransactionCodes = [
	    // ABN AMRO bank
	    'N653',
	    'N654',
	    // ING bank
	    'N060'
	];
	/**
	 * @description :61:
	 * @type {Uint8Array}
	 */
	exports.token = new Uint8Array([tokens_1.colonSymbolCode, 54, 49, tokens_1.colonSymbolCode]);
	var tokenLength = exports.token.length;
	var transactionInfoTag = {
	    readToken: function (state) {
	        if (!compare_arrays_1.default(exports.token, 0, state.data, state.pos, tokenLength)) {
	            return 0;
	        }
	        return state.pos + tokenLength;
	    },
	    open: function (state) {
	        var statement = state.statements[state.statementIndex];
	        state.transactionIndex++;
	        statement.transactions.push({
	            id: '',
	            code: '',
	            fundsCode: '',
	            isCredit: false,
	            isExpense: true,
	            currency: statement.openingBalance.currency,
	            description: '',
	            amount: 0,
	            valueDate: '',
	            entryDate: ''
	        });
	    },
	    close: function (state) {
	        var transaction = state.statements[state.statementIndex].transactions[state.transactionIndex];
	        var content = String.fromCharCode.apply(String, state.data.slice(state.tagContentStart, state.tagContentEnd));
	        var _a = (transactionInfoPattern.exec(content) || []), valueDateYear = _a[1], valueDateMonth = _a[2], valueDate = _a[3], entryDateMonth = _a[4], entryDate = _a[5], creditMark = _a[6], fundsCode = _a[7], amount = _a[8], code = _a[9];
	        if (!valueDateYear) {
	            return;
	        }
	        var year = Number(valueDateYear) > 80 ? "19" + valueDateYear : "20" + valueDateYear;
	        transaction.valueDate = year + "-" + valueDateMonth + "-" + valueDate;
	        if (entryDateMonth) {
	            transaction.entryDate = year + "-" + entryDateMonth + "-" + entryDate;
	        }
	        transaction.isCredit = (creditMark && (creditMark.charCodeAt(0) === tokens_1.bigCSymbolCode || creditMark.charCodeAt(1) === tokens_1.bigCSymbolCode));
	        if (fundsCode) {
	            transaction.fundsCode = fundsCode;
	        }
	        transaction.amount = parseFloat(amount.replace(commaPattern, dotSymbol));
	        transaction.code = code;
	        transaction.isExpense = incomeTransactionCodes.indexOf(code) === -1;
	        var date = transaction.valueDate || transaction.entryDate;
	        transaction.id = md5_1.default("" + date + transaction.description + amount + transaction.currency);
	    }
	};
	exports.default = transactionInfoTag;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// MD5 implementation http://www.myersdaily.org/joseph/javascript/md5.js
	function md5Cycle(x, k) {
	    var a = x[0], b = x[1], c = x[2], d = x[3];
	    a = ff(a, b, c, d, k[0], 7, -680876936);
	    d = ff(d, a, b, c, k[1], 12, -389564586);
	    c = ff(c, d, a, b, k[2], 17, 606105819);
	    b = ff(b, c, d, a, k[3], 22, -1044525330);
	    a = ff(a, b, c, d, k[4], 7, -176418897);
	    d = ff(d, a, b, c, k[5], 12, 1200080426);
	    c = ff(c, d, a, b, k[6], 17, -1473231341);
	    b = ff(b, c, d, a, k[7], 22, -45705983);
	    a = ff(a, b, c, d, k[8], 7, 1770035416);
	    d = ff(d, a, b, c, k[9], 12, -1958414417);
	    c = ff(c, d, a, b, k[10], 17, -42063);
	    b = ff(b, c, d, a, k[11], 22, -1990404162);
	    a = ff(a, b, c, d, k[12], 7, 1804603682);
	    d = ff(d, a, b, c, k[13], 12, -40341101);
	    c = ff(c, d, a, b, k[14], 17, -1502002290);
	    b = ff(b, c, d, a, k[15], 22, 1236535329);
	    a = gg(a, b, c, d, k[1], 5, -165796510);
	    d = gg(d, a, b, c, k[6], 9, -1069501632);
	    c = gg(c, d, a, b, k[11], 14, 643717713);
	    b = gg(b, c, d, a, k[0], 20, -373897302);
	    a = gg(a, b, c, d, k[5], 5, -701558691);
	    d = gg(d, a, b, c, k[10], 9, 38016083);
	    c = gg(c, d, a, b, k[15], 14, -660478335);
	    b = gg(b, c, d, a, k[4], 20, -405537848);
	    a = gg(a, b, c, d, k[9], 5, 568446438);
	    d = gg(d, a, b, c, k[14], 9, -1019803690);
	    c = gg(c, d, a, b, k[3], 14, -187363961);
	    b = gg(b, c, d, a, k[8], 20, 1163531501);
	    a = gg(a, b, c, d, k[13], 5, -1444681467);
	    d = gg(d, a, b, c, k[2], 9, -51403784);
	    c = gg(c, d, a, b, k[7], 14, 1735328473);
	    b = gg(b, c, d, a, k[12], 20, -1926607734);
	    a = hh(a, b, c, d, k[5], 4, -378558);
	    d = hh(d, a, b, c, k[8], 11, -2022574463);
	    c = hh(c, d, a, b, k[11], 16, 1839030562);
	    b = hh(b, c, d, a, k[14], 23, -35309556);
	    a = hh(a, b, c, d, k[1], 4, -1530992060);
	    d = hh(d, a, b, c, k[4], 11, 1272893353);
	    c = hh(c, d, a, b, k[7], 16, -155497632);
	    b = hh(b, c, d, a, k[10], 23, -1094730640);
	    a = hh(a, b, c, d, k[13], 4, 681279174);
	    d = hh(d, a, b, c, k[0], 11, -358537222);
	    c = hh(c, d, a, b, k[3], 16, -722521979);
	    b = hh(b, c, d, a, k[6], 23, 76029189);
	    a = hh(a, b, c, d, k[9], 4, -640364487);
	    d = hh(d, a, b, c, k[12], 11, -421815835);
	    c = hh(c, d, a, b, k[15], 16, 530742520);
	    b = hh(b, c, d, a, k[2], 23, -995338651);
	    a = ii(a, b, c, d, k[0], 6, -198630844);
	    d = ii(d, a, b, c, k[7], 10, 1126891415);
	    c = ii(c, d, a, b, k[14], 15, -1416354905);
	    b = ii(b, c, d, a, k[5], 21, -57434055);
	    a = ii(a, b, c, d, k[12], 6, 1700485571);
	    d = ii(d, a, b, c, k[3], 10, -1894986606);
	    c = ii(c, d, a, b, k[10], 15, -1051523);
	    b = ii(b, c, d, a, k[1], 21, -2054922799);
	    a = ii(a, b, c, d, k[8], 6, 1873313359);
	    d = ii(d, a, b, c, k[15], 10, -30611744);
	    c = ii(c, d, a, b, k[6], 15, -1560198380);
	    b = ii(b, c, d, a, k[13], 21, 1309151649);
	    a = ii(a, b, c, d, k[4], 6, -145523070);
	    d = ii(d, a, b, c, k[11], 10, -1120210379);
	    c = ii(c, d, a, b, k[2], 15, 718787259);
	    b = ii(b, c, d, a, k[9], 21, -343485551);
	    x[0] = add32(a, x[0]);
	    x[1] = add32(b, x[1]);
	    x[2] = add32(c, x[2]);
	    x[3] = add32(d, x[3]);
	}
	function cmn(q, a, b, x, s, t) {
	    a = add32(add32(a, q), add32(x, t));
	    return add32((a << s) | (a >>> (32 - s)), b);
	}
	function ff(a, b, c, d, x, s, t) {
	    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function gg(a, b, c, d, x, s, t) {
	    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function hh(a, b, c, d, x, s, t) {
	    return cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function ii(a, b, c, d, x, s, t) {
	    return cmn(c ^ (b | (~d)), a, b, x, s, t);
	}
	function md51(input) {
	    var state = [1732584193, -271733879, -1732584194, 271733878];
	    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	    var len = input.length;
	    var i = 64;
	    for (; i <= len; i += 64) {
	        md5Cycle(state, getMd5Blocks(input.substring(i - 64, i)));
	    }
	    input = input.substring(i - 64);
	    len = input.length;
	    for (i = 0; i < len; i++) {
	        tail[i >> 2] |= input.charCodeAt(i) << ((i % 4) << 3);
	    }
	    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
	    if (i > 55) {
	        md5Cycle(state, tail);
	        for (i = 0; i < 16; i++) {
	            tail[i] = 0;
	        }
	    }
	    tail[14] = len * 8;
	    md5Cycle(state, tail);
	    return state;
	}
	/* there needs to be support for Unicode here,
	 * unless we pretend that we can redefine the MD-5
	 * algorithm for multi-byte characters (perhaps
	 * by adding every four 16-bit characters and
	 * shortening the sum to 32 bits). Otherwise
	 * I suggest performing MD-5 as if every character
	 * was two bytes--e.g., 0040 0025 = @%--but then
	 * how will an ordinary MD-5 sum be matched?
	 * There is no way to standardize text to something
	 * like UTF-8 before transformation; speed cost is
	 * utterly prohibitive. The JavaScript standard
	 * itself needs to look at this: it should start
	 * providing access to strings as preformed UTF-8
	 * 8-bit unsigned value arrays.
	 */
	function getMd5Blocks(str) {
	    var result = [];
	    /* Andy King said do it this way. */
	    for (var i = 0; i < 64; i += 4) {
	        result[i >> 2] = (str.charCodeAt(i) +
	            (str.charCodeAt(i + 1) << 8) +
	            (str.charCodeAt(i + 2) << 16) +
	            (str.charCodeAt(i + 3) << 24));
	    }
	    return result;
	}
	var hexChars = '0123456789abcdef'.split('');
	function rhex(value) {
	    var result = '';
	    for (var j = 0; j < 4; j++) {
	        result += hexChars[(value >> (j * 8 + 4)) & 0x0F] + hexChars[(value >> (j * 8)) & 0x0F];
	    }
	    return result;
	}
	function hex(state) {
	    var result = '';
	    var length = state.length;
	    for (var i = 0; i < length; i++) {
	        result += rhex(state[i]);
	    }
	    return result;
	}
	function add32(a, b) {
	    return (a + b) & 0xFFFFFFFF;
	}
	function md5(input) {
	    return hex(md51(input));
	}
	exports.default = md5;


/***/ })
/******/ ]);