
(function (ctx) {

// NOTE
// consider needs
// . mutable vs. immutable
// . shallow vs. deep copy
// . equal vs. strict equal

const lost = {
	object: {},
	array: {},
	list: {},
	string: {},
	number: {},
	util: {},
};

const constants = {
	// object.toArray
	FLAT: 'flat', // ['x', xval, 'y', yval, 'z', zval]
	NEST: 'nest', // [['x', xval], ['y', yval], ['z', zval]]
	OBJE: 'obje', // [{k:'x', v: xval}, {k:'y', v:yval}, {k:'z', v:zval}]
	// list.zip2
	SHORTEST: 'shortest',
	LONGEST: 'longest',
	// number.stringify
	EMPTY: '',
	HYPHEN: '-',
	ZERO: '0',
};

////////////////////////////////////////
// object

/*
let {x, y, z} = src;
let dst = {x, y, z};
//*/
function _partial(from, keys) {
	let to = {};
	keys.forEach((k) => {
		to[k] = from[k];
	});
	return to;
}
lost.partial = _partial;

function _partialExcept(from, keys) {
	let to = {};
	Object.keys(from).forEach((k) => {
		if (! keys.includes(k)) {
			to[k] = from[k];
		}
	});
	return to;
}
lost.except = _partialExcept;

// args
// - [['x', xval], ['y', yval], ['z', zval]]
// - [{k:'x', v: xval}, {k:'y', v:yval}, {k:'z', v:zval}]
// - ['x', xval, 'y', yval, 'z', zval]
function _fromArray(args) {
	let obj = {};
	let k, v;
	if (args.every((arg) => Array.isArray(arg) && arg.length === 2)) {
		args.forEach((kv) => {
			obj[kv[0]] = kv[1];
		});
	} else if (args.every((kv) => typeof kv === 'object' &&
			kv.hasOwnProperty('k') && kv.hasOwnProperty('v'))) {
		args.forEach((kv) => {
			obj[kv.k] = kv.v;
		});
	} else {
		args.forEach((_, ix) => {
			if (ix % 2 === 1) {
				obj[args[ix-1]] = args[ix];
			}
		});
	}
	return obj;
}
lost.fromArray = _fromArray;

lost.FLAT = constants.FLAT;
lost.NEST = constants.NEST;
lost.OBJE = constants.OBJE;
lost.toArray = (from, mode, keys) => {
	let to = [];
	keys = keys || Object.keys(from);
	if (mode === constants.FLAT) {
		keys.forEach((k) => {
			to = to.concat([k, from[k]]);
		});
	} else if (mode === constants.NEST) {
		keys.forEach((k) => {
			to.push([k, from[k]]);
		});
	} else if (mode === constants.OBJE) {
		keys.forEach((k) => {
			to.push({k, v: from[k]});
		});
	}
	return to;
};

function _deepCopy(x) {
	return JSON.parse(JSON.stringify(x));
}
lost.deepCopy = _deepCopy;

function _toString(x) {
	return JSON.stringify(x);
}
lost.toString = _toString;
lost.jsonify = _toString;
lost.jsonize = _toString;

function _values(x, keys) {
	return keys.map((k) => x[k]);
}
lost.values = _values;

function _equal(x, y, keys) {
	return keys.every((k) => x[k] === y[k]);
}
lost.equal = _equal;

function _mixin_v1(...args) {
	if (args.length == 0) return {};
	let dst = args.shift() || {}; // 
	args.forEach((additive) => {
		if (additive == undefined) return;
		Object.keys(additive).forEach((k) => {
			dst[k] = additive[k];
		});
	});
	return dst;
}
function _mixin(dst, ...ingredients) {
	dst = dst || {};
	ingredients.forEach((additive) => {
		if (additive == undefined) return;
		//Object.keys(additive).forEach((k) => {
		//	dst[k] = additive[k];
		//});
		Object.assign(dst, additive);
	});
	return dst;
}
lost.mixin = _mixin;

// nested value of
lost.nvo = function (src, path, dflt) {
	let x = src,
		y = typeof path === 'string' ? path.split('/') :
			Array.isArray(path) ? path :
			[],
		z = arguments.length < 3 ? '' : dflt; // arrow function has no arguments (BUT closure's)
	if (x == undefined) return z;
	y = y.filter((_) => _ != undefined && _ !== '');
	for (let k of y) {
		if (typeof x === 'object' && x.hasOwnProperty(k)) {
			x = x[k];
		} else {
			x = undefined;
		}
		if (x == undefined) break;
	}
	return x != undefined ? x : z;
};

////////////////////////////////////////
// array

function _fillZero(size) {
	if (Array.prototype.fill) {
		return new Array(size).fill(0);
	} else {
		let arr = [];
		for (let i = 0; i < size; i++) {
			arr.push(0);
		}
		return arr;
	}
}
lost.array = _fillZero;

// _.times(3).forEach((ix) => { ... })
// _.times(3).some((ix) => { ... })
// _.times(3).every((ix) => { ... })
function _times(n) {
	let arr = [];
	for (let i = 0; i < n; i++) {
		arr.push(i);
	}
	return arr;
}
lost.repeat = _times;

// howto
// - (x) => { ... }
// - {x, y, z}
// - [['x', xval], ['y', yval], ['z', zval]]
// - ['x', xval, 'y', yval, 'z', zval]
// 
// TODO
// - not equal
// - in
// - not in
// - or
function _howToSeek(howto) {
	if (typeof howto === 'function') return howto;
	if (Array.isArray(howto)) howto = _fromArray(howto);
	if (typeof howto === 'object') {
		return (x) => {
			return Object.keys(howto).every((k) => {
				return howto[k] === x[k];
			});
		};
	}
	return false;
}
lost.howToSeek = _howToSeek;

function _filter(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return [];
	return arr.filter(howto);
}
lost.filter = _filter;

function _find(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return false;
	return arr.find(howto) || false;
}
lost.find = _find;

lost.findLast = (arr, howto) => {
	howto = _howToSeek(howto);
	if (howto === false) return false;
	return arr.slice().reverse().find(howto) || false;
};

function _findIndex(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return -1;
	return arr.findIndex(howto);
}
lost.findIndex = _findIndex;

lost.findLastIndex = (arr, howto) => {
	howto = _howToSeek(howto);
	if (howto === false) return -1;
	let index = arr.slice().reverse().findIndex(howto);
	return index >= 0 ? arr.length - index - 1 : -1
}

// - list: list to sort  -- not changed
// - by : function or [keyNameOpt, ...]
//   - keyNameOpt: #~keyName
//     - #: asNumber (optional)
//     - ~: descending (optional)
lost.sort = (list, by) => {
	if (typeof by === 'function') {
		return list.slice().sort(by);
	}
	let asNumbers = by.map((k) => (k.includes('#') ? true : false));
	let orders = by.map((k) => (k.includes('~') ? -1 : 1)); // -1 descending
	let keyNames = by.map((k) => k.replace(/[#~]/g, ''));
	return list.slice().sort((e1, e2) => {
		let vals1 = _values(e1, keyNames);
		let vals2 = _values(e2, keyNames);
		for (let ix in keyNames) {
			let v1 = vals1[ix];
			let v2 = vals2[ix];
			if (asNumbers[ix]) {
				v1 = Number(v1);
				v2 = Number(v2);
			}
			if (v1 > v2) {
				return 1 * orders[ix];
			} else if (v1 < v2) {
				return -1 * orders[ix];
			}
		}
		return 0;
	});
};

function _unique_v1(list, keys) {
	let uniques = [];
	let uniqueValStrs = [];
	list.forEach((x) => {
		let valStr = _values(x, keys).join('_');
		if (! uniqueValStrs.includes(valStr)) {
			uniques.push(x);
			uniqueValStrs.push(valStr);
		}
	});
	return uniques;
}
lost.unique = (list, keys) => {
	if (typeof keys === 'string') keys = keys.split(',');
	let uniques = [];
	list.forEach((x) => {
		let kvo = _partial(x, keys);
		let seen = _find(uniques, kvo);
		if (seen === false) {
			uniques.push(x);
		}
	});
	return uniques;
};

function _group_v1(list, keys) {
	let groups = {};
	let uniqueValStrs = [];
	list.forEach((x) => {
		let valStr = _values(x, keys).join('_');
		if (! uniqueValStrs.includes(valStr)) {
			groups[valStr] = [x];
			uniqueValStrs.push(valStr);
		} else {
			groups[valStr].push(x);
		}
	});
	return groups;
	//return Object.keys(groups).map((valStr) => groups[valStr]);
}
lost.group = (list, keys) => {
	if (typeof keys === 'string') keys = keys.split(',');
	let groups = [];
	list.forEach((x) => {
		let kvo = _partial(x, keys);
		let group = _find(groups, kvo);
		if (group === false) {
			group = kvo;
			group._list_ = [];
			groups.push(group);
		}
		group._list_.push(x);
	});
	return groups.map((group) => group._list_);
};

function _adjacent(list, keys) {
	if (typeof keys === 'string') keys = keys.split(',');
	let groups = [];
	list.forEach((x) => {
		let kvo = _partial(x, keys);
		let group = groups[groups.length-1] || {};
		if (!_equal(group, kvo, keys)) {
			group = kvo;
			group._list_ = [];
			groups.push(group);
		}
		group._list_.push(x);
	});
	return groups.map((group) => group._list_);
}
lost.adjacent = _adjacent;

lost.slim = (list, keys) => {
	if (typeof keys === 'string') keys = keys.split(',');
	return list.map((x) => _partial(x, keys));
};

lost.merge = (xlist, ylist, keys) => {
	xlist.forEach((elem1) => {
		let seek = _partial(elem1, keys);
		let elem2 = _find(ylist, seek);
		if (elem2) {
			let copied = _partialExcept(elem2, keys);
			_mixin(elem1, copied);
		}
	});
};

lost.absorb = (xlist, ylist, keys, embedKeys) => {
	if (typeof keys === 'string') keys = keys.split(',');
	xlist.forEach((x) => {
		let seek = _partial(x, keys);
		let y = _find(ylist, seek);
		if (y) {
			let copied;
			if (Array.isArray(embedKeys) && embedKeys.length > 0) {
				copied = _partial(y, embedKeys);
			} else {
				copied = _partialExcept(y, keys);
			}
			_mixin(x, copied);
		}
	});
};

lost.embed = (xlist, ylist, keys, embedKey) => {
	if (typeof keys === 'string') keys = keys.split(',');
	xlist.forEach((x) => {
		let seek = _partial(x, keys);
		let y = _find(ylist, seek);
		if (y) {
			x[embedKey] = y;
		}
	});
};

lost.slim = (list, keys) => {
	if (typeof keys === 'string') keys = keys.split(',');
	return list.map((x) => _partial(x, keys));
};

// instead use Array.prototype.flat
lost.flat = (list) => {
	let flatten = [];
	list.forEach((x) => {
		if (Array.isArray(x)) {
			let sublist = x;
			//sublist.forEach((subx) => {
			//	flatten.push(subx);
			//});
			flatten = flatten.concat(sublist);
		} else {
			flatten.push(x);
		}
	});
	return flatten;
};

lost.findMax = (list, key) => {
	if (list.length === 0) return null;
	if (typeof key === 'undefined') {
		return list.reduce((max, x) => max >= x ? max : x);
	} else {
		let asNumber = key.includes('#') ? true : false;
		key = key.replace(/[#]/, '');
		if (asNumber) {
			return list.reduce((withMax, x) => {
				max = _asNumber(withMax[key]);
				val = _asNumber(x[key]);
				return max >= val ? withMax : x;
			});
		} else {
			return list.reduce((withMax, x) => withMax[key] >= x[key] ? withMax : x);
		}
	}
};

lost.findMin = (list, key) => {
	if (list.length === 0) return null;
	if (typeof key === 'undefined') {
		return list.reduce((min, x) => min <= x ? min : x);
	} else {
		let asNumber = key.includes('#') ? true : false;
		key = key.replace(/[#]/, '');
		if (asNumber) {
			return list.reduce((withMin, x) => {
				min = _asNumber(withMin[key]);
				val = _asNumber(x[key]);
				return min <= val ? withMin : x;
			});
		} else {
			return list.reduce((withMin, x) => withMin <= x[key] ? withMin : x[key]);
		}
	}
};

lost.a$sum = (list, key) => {
	if (list.length === 0) return null;
	if (typeof key === 'undefined') {
		return list.reduce((sum, x) => sum += (x || 0), 0);
	} else {
		return list.reduce((sum, x) => sum += _asNumber(x[key]), 0);
	}
};

lost.zip = function (list1, list2) {
	if (list1 && list2 && list1.length && list2.length && list1.length === list2.length) {
		// Array.from(arguments);
		let lists = [].slice.call(arguments); // arrow function has no arguments (BUT closure's)
		lists.shift(); // list1
		return list1.map((x, ix) => {
			let zipped = [x];
			lists.forEach((list) => {
				zipped.push(list[ix]);
			});
			return zipped;
		})
	} else {
		return [];
	}
};

function _zip2(length, list1, list2) {
	let lists = Array.from(arguments);
	lists.shift(); // length
	if (length === constants.SHORTEST) {
		length = _min.apply(null, lists.map((list) => list.length));
	} else if (length === constants.LONGEST) {
		length = _max.apply(null, lists.map((list) => list.length));
	}
	let zips = new Array(length).fill(0).map((_) => []);
	zips.forEach((zip, ix) => {
		lists.forEach((list) => {
			zip.push(list[ix] || null);
		});
	});
	zips = [];
	_times(length).forEach((ix) => {
		let zip = lists.map((list) => list[ix] || null);
		zips.push(zip);
	});
	return zips;
};
lost.SHORTEST = constants.SHORTEST;
lost.LONGEST = constants.LONGEST;
lost.zip2 = _zip2;

lost.GROUP_BY_INIT = 'none';
lost.groupBy = (list, keys, aggregate, initialize) => {
	if (typeof keys === 'string') keys = keys.split(',');
	let groups = [];
	list.forEach((x) => {
		let kvo = _partial(x, keys);
		let group = _find(groups, kvo);
		if (group === false) {
			if (typeof initialize === 'function') {
				group = _mixin(kvo, initialize(x));
			} else if (typeof initialize === 'undefined') {
				//group = _mixin({}, x);
				group = {...x};
			} else if (typeof initialize === 'object') {
				group = _mixin(kvo, initialize);
			} else if (initialize === lost.GROUP_BY_INIT) {
				group = kvo;
			}
			//group._list_ = [];
			groups.push(group);
		}
		//group._list_.push(x);
		aggregate(group, x);
	});
	return groups;
};

lost.flowDown = (outers, inners, keys, worker) => {
	if (typeof keys === 'string') keys = keys.split(',');
	outers.forEach((outer) => {
		inners.forEach((inner) => {
			if (_equal(outer, inner, keys)) {
				worker(outer, inner);
			}
		});
	});
};

lost.GROUP_BY_MAX = (key) => (group, member) => {
	group[key] = group[key] == null ? member[key] : _max(group[key], member[key]);
};

lost.GROUP_BY_MIN = (key) => (group, member) => {
	group[key] = group[key] == null ? member[key] : _min(group[key], member[key]);
};

lost.GROUP_BY_SUM = (key) => (group, member) => {
	group[key] = group[key] == null ? member[key] : group[key] + member[key];
};

lost.GROUP_BY_COUNT = (key) => (group, member) => {
	group[key] = group[key] == null ? 1 : group[key] + 1;
};

lost.DESCRIBE = (key) => (group, member) => {
	if (!group.hasOwnProperty('_count_')) {
		group._count_ = 0;
		group._sum_ = 0;
		group._min_ = null;
		group._max_ = null;
	}
	let val = member[key];
	group._count_++;
	group._sum_ += val;
	group._min_ = group._min_ == null ? val : _min(group._min_, val);
	group._max_ = group._max_ == null ? val : _max(group._max_, val);
};

////////////////////////////////////////
// string

// String.prototype.slice is there even IE
lost.s$slice = function (s, begin, end) {
	s = s || '';
	let len= s.length;
	if (arguments.length == 1) {
		return s;
	}
	if (begin < 0) {
		begin = len + begin;
		if (begin < 0) {
			begin = 0;
		}
	} else if (begin > len) {
		begin = len;
	}
	if (end == undefined) {
		end = len;
	} else if (end < 0) {
		end = len + end;
		if (end < 0) {
			end = 0;
		}
	} else if (end > len) {
		end = len;
	}
	if (begin > end) {
		return '';
	}
	return s.substring(begin, end);
};

function _encomma(s) {
	//return (s || '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	return (s || '').replace(/(?<!\.(?:\d*))(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}
lost.encomma = _encomma;

function _decomma(s) {
	return (s || '').replace(/,/g, '');
}
lost.decomma = _decomma;

function _padStart(s, len, c) {
	c = typeof c === 'undefined' ? ' ' : c;
	while (s.length < len) {
		s = c + s;
	}
	return s;
}
lost.s$padStart = (function () {
	if (typeof String.prototype.padStart === 'function') {
		return function (s, len, c) {
			//let args = [].slice.call(arguments);
			let args = Array.from(arguments);
			args.shift(); // remove s
			return s.padStart.apply(s, args);
		}
	} else {
		return _padStart;
	}
})();
function _padEnd(s, len, c) {
	c = typeof c === 'undefined' ? ' ' : c;
	while (s.length < len) {
		s = s + c;
	}
	return s;
}
lost.s$padEnd = (function () {
	if (typeof String.prototype.padEnd === 'function') {
		return function (s, len, c) {
			//let args = [].slice.call(arguments);
			let args = Array.from(arguments);
			args.shift(); // remove s
			return s.padEnd.apply(s, args);
		}
	} else {
		return _padEnd;
	}
})();
function _repeat(s, n) {
	let t = s;
	while (t.length < len) {
		t = t + s;
	}
	return t;
}
lost.s$repeat = (function () {
	if (typeof String.prototype.repeat === 'function') {
		return function (s, n) {
			//return new Array(n).fill(s).join('');
			return s.repeat(n);
		}
	} else {
		return _repeat;
	}
})();

////////////////////////////////////////
// date

function _dateFrom(x) {
	if (x instanceof Date) {
		return _dateClone(x);
	}
	const s = (x || '').replace(/-/g, '');
	const y = Number(s.slice(0, 4));
	const m = Number(s.slice(4, 6));
	const d = Number(s.slice(6, 8));
	let dt = new Date();
	dt.setFullYear(y);
	dt.setMonth(m-1);
	dt.setDate(d);
	return dt;
}
lost.date = _dateFrom;

function _dateClone(dt) {
	const ts = dt.getTime();
	dt = new Date();
	dt.setTime(ts);
	return dt;
}

function _addYear(dt, y) {
	dt = _dateClone(dt);
	dt.setFullYear(dt.getFullYear() + y);
	return dt;
}
lost.addYear = _addYear;
function _addMonth(dt, m) {
	dt = _dateClone(dt);
	dt.setMonth(dt.getMonth() + m);
	return dt;
}
lost.addMonth = _addMonth;
function _addDate(dt, d) {
	dt = _dateClone(dt);
	dt.setDate(dt.getDate() + d);
	return dt;
}
lost.addDate = _addDate;

function _dateToString(dt, fmt) {
	fmt = fmt || 'yyyy-mm-dd';
	let y = dt.getFullYear();
	let m = dt.getMonth() + 1;
	m = (m < 10 ? '0' : '') + m;
	let d = dt.getDate();
	d = (d < 10 ? '0' : '') + d;
	const s = fmt.replace('yyyy', y).replace('mm', m).replace('dd', d);
	return s;
}
lost.d2s = _dateToString;

function JustDate(x) {
	if (!(this instanceof JustDate)) {
		return new JustDate(x);
	}
	this.dt = _dateFrom(x);
}
JustDate.prototype = {
	addYear(y) {
		this.dt = _addYear(this.dt, y);
		return this;
	},
	addMonth(m) {
		this.dt = _addMonth(this.dt, m);
		return this;
	},
	addDate(d) {
		this.dt = _addDate(this.dt, d);
		return this;
	},
	it() {
		return _dateClone(this.dt);
	},
	value() {
		return this.it();
	},
	stringify(fmt) {
		return _dateToString(this.dt, fmt);
	},
};
lost.date2 = (x) => new JustDate(x);

////////////////////////////////////////
// number

function _max(...nums) {
	return nums.reduce((max, num) => {
		num = Number(_decomma(String(num)));
		return max < num ? num : max;
	});
}
lost.max = _max;

function _min(...nums) {
	return nums.reduce((min, num) => {
		num = Number(_decomma(String(num)));
		return num < min ? num : min;
	});
}
lost.min = _min;

function _asNumber(x) {
	if (typeof x === 'number') {
		return x;
	}
	let s = _decomma(x || '');
	return Number(s);
}
lost.number = _asNumber;

// opt : option (object or string for zero)
// - zero : alternative to 0 (default is '')
// - comma : true for encomma (default is true)
function _numberStringify(n, opt) {
	const dfltOpt = {zero: '', comma: true};
	if (typeof opt === 'string') opt = {zero: opt};
	opt = _mixin(dfltOpt, opt || {});
	let _n = Number(n || '');
	if (_n === 0) {
		return opt.zero;
	}
	if (isNaN(_n)) {
		return n;
	}
	let s = String(_n);
	if (opt.comma === true) {
		return _encomma(s);
	}
	return s;
}
lost.n2s = _numberStringify;

function JustNumber(x) {
	if (!(this instanceof JustNumber)) {
		return new JustNumber(x);
	}
	this.n = _asNumber(x);
}
JustNumber.prototype = {
	add(n) {
		this.n += n;
		return this;
	},
	subtract(n) {
		this.n -= n;
		return this;
	},
	multiply(n) {
		this.n *= n;
		return this;
	},
	divide(n) {
		if (n) {
			this.n /= n;
		}
		return this;
	},
	it() {
		return this.n;
	},
	value() {
		return this.it();
	},
	stringify(opt) {
		return _numberStringify(this.n, opt);
	},
};
lost.number2 = (x) => new JustNumber(x);

////////////////////////////////////////

lost.mear = (x) => {
	if (x instanceof Date) {
		return lost.date2(x);
	} else if (typeof x === 'number') {
		return lost.number2(x);
	}
};

////////////////////////////////////////
// util

// until not void
lost.unv = (...args) => args.find((arg) => !!arg);

////////////////////////////////////////

ctx.lost = lost;

})(window);
