
(function () {

function section(s) {
	console.log('##', s);
}

function print(...args) {
	args = args.map((x) => JSON.stringify(x));
	console.log.apply(null, args);
}

const assert = console.assert;

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

(function () {
	section('object.partial');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let obj2 = lost.partial(obj1, ['x','y']);
	print(obj2);	// {"x":"foo","y":42}
})();

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

(function () {
	section('object.except');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	obj1 = {u: 'banana', v: 'orange', ...obj1};
	let obj2 = lost.except(obj1, ['x','y']);
	print(obj2);	// {"u":"banana","v":"orange","z":"고구마"}
})();

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

(function () {
	section('object.fromArray');
	let arr1 = ['x', 'foo', 'y', 42, 'z', '고구마'];
	let obj1 = lost.fromArray(arr1);
	print(obj1);	// {"x":"foo","y":42,"z":"고구마"}
	let arr2 = [['x', 'foo'], ['y', 42], ['z', '고구마']];
	let obj2 = lost.fromArray(arr2);
	print(obj2);	// {"x":"foo","y":42,"z":"고구마"}
	let arr3 = [{k:'x', v:'foo'}, {k:'y', v:42}, {k:'z', v:'고구마'}];
	let obj3 = lost.fromArray(arr3);
	print(obj3);	// {"x":"foo","y":42,"z":"고구마"}
})();

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

(function () {
	section('object.toArray');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let arr1 = lost.toArray(obj1, lost.FLAT);
	print(arr1);	// ["x","foo","y",42,"z","고구마"]
	let arr2 = lost.toArray(obj1, lost.NEST, ['x','y']);
	print(arr2);	// [["x","foo"],["y",42]]
	let arr3 = lost.toArray(obj1, lost.OBJE);
	print(arr3);	// [{"k":"x","v":"foo"},{"k":"y","v":42},{"k":"z","v":"고구마"}]
})();

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

(function () {
	section('object.mixin');
	let obj1 = {a: 'foo', b: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {m: 'qux', n: 44};
	let obj4 = lost.mixin(obj1, obj2, obj3);
	print(obj1);
		// {"a":"foo","b":42,"x":"bar","y":43,"m":"qux","n":44}
})();

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

(function () {
	section('object.nvo');
	const PATH = 'Foo/Bar/0/Qux';
	const pane = {};
	let val;
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo = {};
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar = [];
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar[0] = {};
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar[0].Qux = '';
	val = lost.nvo(pane, PATH, '0');
	assert(val === '', toString(pane) + '::' + val);
	pane.Foo.Bar[0].Qux = '4';
	val = lost.nvo(pane, PATH, '0');
	assert(val === '4', toString(pane) + '::' + val);

	pane.Foo.Bar = '';
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar = 0;
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar = true;
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar = false;
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
})();

////////////////////////////////////////
// array

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

(function () {
	section('list.howToSeek');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let seek, arr2;
	seek = lost.howToSeek((_) => _.y != 42);
	arr2 = arr1.filter(seek);
	print(arr2);
		// [{"x":"bar","y":43},{"x":"qux","y":44}]
	seek = lost.howToSeek([['x','foo'], ['y',42]]);
	arr2 = arr1.filter(seek);
	print(arr2);
		// [{"x":"foo","y":42}]
	seek = lost.howToSeek({x:'foo', y:42});
	arr2 = arr1.filter(seek);
	print(arr2);
		// [{"x":"foo","y":42}]
	/* TODO
	seek = lost.howToSeek({'~x':'foo'}); // not equal
	arr2 = lost.filter(arr1, seek);
	print(filtered1);
	seek = lost.howToSeek([{x:'foo'}, {x:'bar'}]); // in (or)
	arr2 = lost.filter(arr1, seek);
	print(filtered1);
	seek = lost.howToSeek([{x:'foo', y:42}, {x:'qux', y:44}]); // or
	arr2 = lost.filter(arr1, seek);
	print(filtered1);
	//*/
})();

function _filter(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return [];
	return arr.filter(howto);
}
lost.filter = _filter;

(function () {
	section('list.filter');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let filtered = lost.filter(arr1, [['x','bar'],['y',43]]);
	print(filtered);	// [{"x":"bar","y":43}]
})();

function _find(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return false;
	return arr.find(howto) || false;
}
lost.find = _find;

(function () {
	section('list.find');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let found = lost.find(arr1, {x: 'bar', 'y': 43});
	print(found);	// {"x":"bar","y":43}
})();

lost.findLast = (arr, howto) => {
	howto = _howToSeek(howto);
	if (howto === false) return false;
	return arr.slice().reverse().find(howto) || false;
};

(function () {
	section('list.findLast');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 42, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let found = lost.findLast(arr1, (item) => item.x === 'foo' && item.y === 42);
	print(found);	// {"x":"bar","y":43,"z":"orange"}
})();

function _findIndex(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return -1;
	return arr.findIndex(howto);
}
lost.findIndex = _findIndex;

(function () {
	section('list.findIndex');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let index = lost.findIndex(arr1, ['x','bar','y',43]);
	print(index);	// 1
})();

lost.findLastIndex = (arr, howto) => {
	howto = _howToSeek(howto);
	if (howto === false) return -1;
	let index = arr.slice().reverse().findIndex(howto);
	return index >= 0 ? arr.length - index - 1 : -1
}

(function () {
	section('list.findLastIndex');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 42, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let index = lost.findLastIndex(arr1, {x: 'foo', 'y': 42});
	print(index);	// 2
})();

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

(function () {
	section('list.sort');
	let obj1 = {x: 'foo', y: '42'};
	let obj2 = {x: 'bar', y: '123'};
	let obj3 = {x: 'qux', y: '24'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.sort(arr1, (e1, e2) => (
		e1.x > e2.x ? 1 :	// ascending
		e1.x < e2.x ? -1 :
		e1.y > e2.y ? -1 :	// descending
		e1.y < e2.y ? 1 :
		0
	));
	print(arr2);
		// [
		// {"x":"bar","y":"123"},
		// {"x":"foo","y":"42"},
		// {"x":"qux","y":"24"}
		// ]
	arr2 = lost.sort(arr1, ['~x']);	// descending
	print(arr2);
		// [
		// {"x":"qux","y":"24"},
		// {"x":"foo","y":"42"},
		// {"x":"bar","y":"123"}
		// ]
	arr2 = lost.sort(arr1, ['y']);
	print(arr2);
		// [
		// {"x":"bar","y":"123"},
		// {"x":"qux","y":"24"},
		// {"x":"foo","y":"42"}
		// ]
	arr2 = lost.sort(arr1, ['~y']);	// descending
	print(arr2);
		// [
		// {"x":"foo","y":"42"},
		// {"x":"qux","y":"24"},
		// {"x":"bar","y":"123"}
		// ]
	arr2 = lost.sort(arr1, ['#y']);	// asNumber
	print(arr2);
		// [
		// {"x":"qux","y":"24"},
		// {"x":"foo","y":"42"},
		// {"x":"bar","y":"123"}
		// ]
	arr2 = lost.sort(arr1, ['#~y']);	// asNumber descending
	print(arr2);
		// [
		// {"x":"bar","y":"123"}
		// {"x":"foo","y":"42"},
		// {"x":"qux","y":"24"},
		// ]
})();

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

(function () {
	section('list.unique');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 44, z: 'apple'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.unique(arr1, ['x','z']);
	print(arr2);	// [{"x":"foo","y":42,"z":"apple"},{"x":"bar","y":43,"z":"orange"}]
})();

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

(function () {
	section('list.group');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 44, z: 'apple'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.group(arr1, ['x','z']);
	print(arr2);
		// [
		// [{"x":"foo","y":42,"z":"apple"},{"x":"foo","y":44,"z":"apple"}],
		// [{"x":"bar","y":43,"z":"orange"}]
		// ]
})();

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

(function () {
	section('list.merge');
	let obj11 = {x: 'foo', y: 42};
	let obj12 = {x: 'bar', y: 43};
	let obj13 = {x: 'qux', y: 44};
	let arr1 = [obj11, obj12, obj13];
	let obj21 = {x: 'foo', y: 42, z: 'apple'};
	let obj22 = {x: 'bar', y: 43, z: 'orange'};
	let obj23 = {x: 'qux', y: 44, z: 'banana'};
	let arr2 = [obj21, obj22, obj23];
	lost.merge(arr1, arr2, ['x','y']);
	print(arr1);
		// [
		// {"x":"foo","y":42,"z":"apple"},
		// {"x":"bar","y":43,"z":"orange"},
		// {"x":"qux","y":44,"z":"banana"}
		// ]
})();

lost.absorb = (xlist, ylist, keys, embedKeys) => {
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

(function () {
	section('list.absorb');
	let obj11 = {x: 'foo', y: 42};
	let obj12 = {x: 'bar', y: 43};
	let obj13 = {x: 'qux', y: 44};
	let arr1 = [obj11, obj12, obj13];
	let obj21 = {x: 'foo', y: 42, z: 'apple'};
	let obj22 = {x: 'bar', y: 43, z: 'orange'};
	let obj23 = {x: 'qux', y: 44, z: 'banana'};
	let arr2 = [obj21, obj22, obj23];
	lost.absorb(arr1, arr2, ['x','y'], ['z']);
	print(arr1);
		// [
		// {"x":"foo","y":42,"z":"apple"},
		// {"x":"bar","y":43,"z":"orange"},
		// {"x":"qux","y":44,"z":"banana"}
		// ]
})();

lost.embed = (xlist, ylist, keys, embedKey) => {
	xlist.forEach((x) => {
		let seek = _partial(x, keys);
		let y = _find(ylist, seek);
		if (y) {
			x[embedKey] = y;
		}
	});
};

(function () {
	section('list.embed');
	let obj11 = {x: 'foo', y: 42, z: 'apple'};
	let obj12 = {x: 'bar', y: 43, z: 'orange'};
	let obj13 = {x: 'qux', y: 44, z: 'banana'};
	let arr1 = [obj11, obj12, obj13];
	let obj21 = {x: 'foo', y: 42, z: '고구마'};
	let obj22 = {x: 'bar', y: 43, z: '고사리'};
	let obj23 = {x: 'qux', y: 44, z: '고라니'};
	let arr2 = [obj21, obj22, obj23];
	lost.embed(arr1, arr2, ['x','y'], ['u']);
	print(arr1);
		// [
		// {"x":"foo","y":42,"z":"apple","u":{"x":"foo","y":42,"z":"고구마"}},
		// {"x":"bar","y":43,"z":"orange","u":{"x":"bar","y":43,"z":"고사리"}},
		// {"x":"qux","y":44,"z":"banana","u":{"x":"qux","y":44,"z":"고라니"}}
		// ]
})();

lost.slim = (list, keys) => {
	return list.map((x) => _partial(x, keys));
};

(function () {
	section('list.slim');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'qux', y: 44, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.slim(arr1, ['x','y']);
	print(arr2);	// [{"x":"foo","y":42},{"x":"bar","y":43},{"x":"qux","y":44}]
})();

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

(function () {
	section('list.flat');
	let arr1 = ['foo', 42, 'apple'];
	let arr2 = ['bar', 43, 'orange'];
	let arr3 = ['qux', 44, 'banana'];
	let arr = [arr1, arr2, arr3];
	let flatten = lost.flat(arr);
	print(flatten);	// ["foo",42,"apple","bar",43,"orange","qux",44,"banana"]
})();

lost.a$max = (list, key) => {
	if (list.length === 0) return null;
	if (typeof key === 'undefined') {
		//return list.reduce((max, x) => max >= x ? max : x);
		return _max.apply(null, list);
	} else {
		let asNumber = key.includes('#') ? true : false;
		key = key.replace(/[#]/, '');
		let initial = list[0][key];
		if (asNumber) {
			/*
			return list.reduce((max, x) => {
				max = _asNumber(max);
				x = _asNumber(x[key]);
				return max >= x ? max : x;
			}, initial);
			//*/
			return _max.apply(null, list.map((x) => _asNumber(x[key])));
		} else {
			return list.reduce((max, x) => max >= x[key] ? max : x[key], initial);
		}
	}
};

(function () {
	section('list.max');
	let max = lost.a$max([-12, 42, 123]);
	print(max);		// 123
	let obj11 = {x: 'foo', y: -12};
	let obj12 = {x: 'bar', y: 42};
	let obj13 = {x: 'qux', y: 123};
	let arr1 = [obj11, obj12, obj13];
	let maxY = lost.a$max(arr1, '#y');
	print(maxY);	// 123
})();

lost.a$min = (list, key) => {
	if (list.length === 0) return null;
	if (typeof key === 'undefined') {
		//return list.reduce((min, x) => min <= x ? min : x);
		return _min.apply(null, list);
	} else {
		let asNumber = key.includes('#') ? true : false;
		key = key.replace(/[#]/, '');
		let initial = list[0][key];
		if (asNumber) {
			/*
			return list.reduce((min, x) => {
				min = _asNumber(min);
				x = _asNumber(x[key]);
				return min <= x ? min : x;
			}, initial);
			//*/
			return _min.apply(null, list.map((x) => _asNumber(x[key])));
		} else {
			return list.reduce((min, x) => min <= x[key] ? min : x[key], initial);
		}
	}
};

(function () {
	section('list.min');
	let min = lost.a$min([-12, 42, 123]);
	print(min);		// -12
	let obj11 = {x: 'foo', y: -12};
	let obj12 = {x: 'bar', y: 42};
	let obj13 = {x: 'qux', y: 123};
	let arr1 = [obj11, obj12, obj13];
	let minY = lost.a$min(arr1, '#y');
	print(minY);	// -12
})();

lost.a$sum = (list, key) => {
	if (list.length === 0) return null;
	if (typeof key === 'undefined') {
		return list.reduce((sum, x) => sum += x, 0);
	} else {
		return list.reduce((sum, x) => {
			return sum += _asNumber(x[key]);
		}, 0);
	}
};

(function () {
	section('list.sum');
	let sum = lost.a$sum([-12, 42, 123]);
	print(sum);		// 153
	let obj11 = {x: 'foo', y: -12};
	let obj12 = {x: 'bar', y: 42};
	let obj13 = {x: 'qux', y: 123};
	let arr1 = [obj11, obj12, obj13];
	let sumY = lost.a$sum(arr1, 'y');
	print(sumY);	// 153
})();

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

(function () {
	section('list.zip');
	let arr1 = [{x: 'foo'}, {x: 'bar'}, {x: 'qux'}];
	let arr2 = [{y: 42}, {y: 43}, {y: 44}];
	let arr3 = [{z: '고구마'}, {z: '고사리'}, {z: '고라니'}];
	let zipped = lost.zip(arr1, arr2, arr3);
	print(zipped);
		// [
		// [{"x":"foo"},{"y":42},{"z":"고구마"}],
		// [{"x":"bar"},{"y":43},{"z":"고사리"}],
		// [{"x":"qux"},{"y":44},{"z":"고라니"}]
		// ]
})();

lost.SHORTEST = constants.SHORTEST;
lost.LONGEST = constants.LONGEST;
lost.zip2 = function (length, list1, list2) {
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
	return zips;
};

(function () {
	section('list.zip2');
	let arr1 = [{x: 'foo'}, {x: 'bar'}, {x: 'qux'}];
	let arr2 = [{y: 42}, {y: 43}];
	let arr3 = [{z: 'apple'}, {z: 'orange'}, {z: 'banana'}, {z: 'peach'}];
	let zipped1 = lost.zip2(lost.SHORTEST, arr1, arr2, arr3);
	print(zipped1);
		// [
		// [{"x":"foo"},{"y":42},{"z":"apple"}],
		// [{"x":"bar"},{"y":43},{"z":"orange"}]
		// ]
	let zipped2 = lost.zip2(lost.LONGEST, arr1, arr2, arr3);
	print(zipped2);
		// [
		// [{"x":"foo"},{"y":42},{"z":"apple"}],
		// [{"x":"bar"},{"y":43},{"z":"orange"}],
		// [{"x":"qux"},null,{"z":"banana"}],
		// [null,null,{"z":"peach"}]
		// ]
})();

lost.GROUP_BY_INIT = 'none';
lost.groupBy = (list, keys, aggregate, initialize) => {
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
	outers.forEach((outer) => {
		inners.forEach((inner) => {
			if (_equal(outer, inner, keys)) {
				worker(outer, inner);
			}
		});
	});
};

(function () {
	section('list.groupBy');
	const initialize = () => ({ysum: 0, zlist: []});
	const aggregate = (group, member) => {
		group.ysum = group.ysum + member.y;
		group.zlist.push(member.z);
	};
	let obj1 = {x: 'foo', y: 42, z:'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 42, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.groupBy(arr1, ['x','y'], aggregate, initialize);
	print(arr2);
		// [
		// {"x":"foo","y":42,"ysum":84,"zlist":["apple","banana"]},
		// {"x":"bar","y":43,"ysum":43,"zlist":["orange"]}
		// ]
})();

(function () {
	section('list.groupBy');
	section('list.flowDown');
	let list1 = [
		{a:'A1', b:'B1', c:'C1', m:52, n:28, s:'foo', t:'apple'},
		{a:'A1', b:'B1', c:'C2', m:80, n:21, s:'bar', t:'orange'},
		{a:'A1', b:'B1', c:'C3', m:38, n:73, s:'baz', t:'banana'},
		{a:'A1', b:'B2', c:'C4', m:56, n:71, s:'qux', t:'apple'},
		{a:'A1', b:'B2', c:'C5', m:76, n:35, s:'foo', t:'orange'},
		{a:'A1', b:'B2', c:'C6', m:59, n:72, s:'bar', t:'banana'},
		{a:'A2', b:'B3', c:'C7', m:57, n: 6 ,s:'baz', t:'apple'},
		{a:'A2', b:'B3', c:'C8', m:88, n:56, s:'qux', t:'orange'},
		{a:'A2', b:'B3', c:'C9', m: 7, n: 0, s:'foo', t:'banana'},
	];
	// a-b 기준 그룹별 최소 m
	function min(m, n) {
		return m > n ? n : m;
	}
	const initialize2 = () => ({mmin: null});
	const aggregate2 = (group, member) => {
		group.mmin = group.mmin == null ? member.m : min(group.mmin, member.m);
	};
	let list2 = lost.groupBy(list1, ['a','b'], aggregate2, initialize2);
	print(list2);
		// [
		// {"a":"A1","b":"B1","mmin":38},
		// {"a":"A1","b":"B2","mmin":56},
		// {"a":"A2","b":"B3","mmin":7}
		// ]
	// a-b 기준 그룹 모든 멤버의 m = 찾은 a-b 기준 그룹별 최소 m
	lost.flowDown(list2, list1, ['a','b'], (group, member) => {
		member.m = group.mmin;
	});
	print(list1);
		// [
		// {"a":"A1","b":"B1","c":"C1","m":38,"n":28,"s":"foo","t":"apple"},
		// {"a":"A1","b":"B1","c":"C2","m":38,"n":21,"s":"bar","t":"orange"},
		// {"a":"A1","b":"B1","c":"C3","m":38,"n":73,"s":"baz","t":"banana"},
		// {"a":"A1","b":"B2","c":"C4","m":56,"n":71,"s":"qux","t":"apple"},
		// {"a":"A1","b":"B2","c":"C5","m":56,"n":35,"s":"foo","t":"orange"},
		// {"a":"A1","b":"B2","c":"C6","m":56,"n":72,"s":"bar","t":"banana"},
		// {"a":"A2","b":"B3","c":"C7","m":7,"n":6,"s":"baz","t":"apple"},
		// {"a":"A2","b":"B3","c":"C8","m":7,"n":56,"s":"qux","t":"orange"},
		// {"a":"A2","b":"B3","c":"C9","m":7,"n":0,"s":"foo","t":"banana"}
		// ]
	// a 기준 그룹별 m 합 = a-b 기준 그룹별 최소 m 합
	const initialize3 = () => ({msum: 0});
	const aggregate3 = (group, member) => {
		group.msum = group.msum + member.mmin;
	};
	let list3 = lost.groupBy(list2, ['a'], aggregate3, initialize3);
	print(list3);
		// [
		// {"a":"A1","msum":94},
		// {"a":"A2","msum":7}
		// ]
})();

(function () {
	section('list.groupBy');
	section('list.flowDown');
	function rowspan(list, keys) {
		list.forEach((elem) => { elem.rowspan = {}; });
		let subk;
		let aggreagte = (group, member) => {
			let k = keys.slice(-1)[0];
			if (typeof subk === 'undefined') {
				group.rowspan[k] = (group.rowspan[k] || 0) + 1;
			} else {
				group.rowspan[k] = (group.rowspan[k] || 0) + member.rowspan[subk];
			}
		};
		while (keys.length > 0) {
			let groups = lost.groupBy(list, keys, aggreagte);
			list = lost.unique(list, keys);
			lost.flowDown(groups, list, keys, (group, member) => {
				member.rowspan = group.rowspan;
			});
			subk = keys.pop();
		}
	}
	function draw(rows) {
		let lines = rows.map((row) => (
			`|${row.rowspan && row.rowspan.x ? row.rowspan.x + ':' + row.x : '     '}` +
			`|${row.rowspan && row.rowspan.y ? row.rowspan.y + ':' + row.y : '    '}` +
			`|${row.z}|`
		));
		lines = lines.join('\n');
		console.log(lines);
	}
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let obj2 = {x: 'foo', y: 42, z: '고사리'};
	let obj3 = {x: 'foo', y: 43, z: '고라니'};
	let obj4 = {x: 'bar', y: 44, z: '고등어'};
	let obj5 = {x: 'bar', y: 45, z: '고양이'};
	let obj6 = {x: 'bar', y: 45, z: '고드름'};
	let arr1 = [obj1, obj2, obj3, obj4, obj5, obj6];
	rowspan(arr1, ['x','y']);
	draw(arr1);
})();

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

(function () {
	section('list.groupBy');
	let list1 = [
		{a:'A1', b:'B1', c:'C1', m:52, n:28, s:'foo', t:'apple'},
		{a:'A1', b:'B1', c:'C2', m:80, n:21, s:'bar', t:'orange'},
		{a:'A1', b:'B1', c:'C3', m:38, n:73, s:'baz', t:'banana'},
		{a:'A1', b:'B2', c:'C4', m:56, n:71, s:'qux', t:'apple'},
		{a:'A1', b:'B2', c:'C5', m:76, n:35, s:'foo', t:'orange'},
		{a:'A1', b:'B2', c:'C6', m:59, n:72, s:'bar', t:'banana'},
		{a:'A2', b:'B3', c:'C7', m:57, n: 6 ,s:'baz', t:'apple'},
		{a:'A2', b:'B3', c:'C8', m:88, n:56, s:'qux', t:'orange'},
		{a:'A2', b:'B3', c:'C9', m: 7, n: 0, s:'foo', t:'banana'},
	];
	let list2 = lost.groupBy(list1, ['a','b'], lost.GROUP_BY_MIN('m'), lost.GROUP_BY_INIT);
	print(list2);
		// [
		// {"a":"A1","b":"B1","m":38},
		// {"a":"A1","b":"B2","m":56},
		// {"a":"A2","b":"B3","m":7}
		// ]
	let list3 = lost.groupBy(list1, ['a','b'], lost.GROUP_BY_SUM('m'), {m:0});
	print(list3);
		// [
		// {"a":"A1","b":"B1","m":170},
		// {"a":"A1","b":"B2","m":191},
		// {"a":"A2","b":"B3","m":152}
		// ]
	let list4 = lost.groupBy(list1, ['a','b'], lost.DESCRIBE('m'), lost.GROUP_BY_INIT);
	print(list4);
		// [
		// {"a":"A1","b":"B1","_count_":3,"_sum_":170,"_min_":38,"_max_":80},
		// {"a":"A1","b":"B2","_count_":3,"_sum_":191,"_min_":56,"_max_":76},
		// {"a":"A2","b":"B3","_count_":3,"_sum_":152,"_min_":7,"_max_":88}
		// ]
})();

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

(function () {
	section('string.slice');
	let s = '12345';
	console.assert(lost.s$slice(s) === '12345');
	console.assert(lost.s$slice(s, 1, -1) === '234');
	console.assert(lost.s$slice(s, -1) === '5');
	console.assert(lost.s$slice(s, 2, 4) === '34');
	console.assert(lost.s$slice(s, -1, 1) === '');
})();

function _encomma(s) {
	return (s || '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}
lost.encomma = _encomma;

function _decomma(s) {
	return (s || '').replace(/,/g, '');
}
lost.decomma = _decomma;

lost.s$padStart = (s, len, c) => {
	if (typeof s.padStart === 'function') {
		return c ? s.padStart(len, c) : s.padStart(len);
	} else {
		c = c || ' ';
		while (s.length < len) {
			s = c + s;
		}
		return s;
	}
};
lost.s$padEnd = (s, len, c) => {
	if (typeof s.padEnd === 'function') {
		return c ? s.padEnd(len, c) : s.padEnd(len);
	} else {
		c = c || ' ';
		while (s.length < len) {
			s = s + c;
		}
		return s;
	}
};
lost.s$repeat = (s, n) => {
	return new Array(n).fill(s).join('');
}

////////////////////////////////////////
// number

function _max(...nums) {
	return nums.reduce((max, num) => {
		num = Number(_decomma(String(num)));
		return max < num ? num : max;
	});
}
lost.max = _max;

(function () {
	section('number.max');
	let max = lost.max('42', '123', '24');
	print(max);	// 123
})();

function _min(...nums) {
	return nums.reduce((min, num) => {
		num = Number(_decomma(String(num)));
		return num < min ? num : min;
	});
}
lost.min = _min;

(function () {
	section('number.min');
	let min = lost.min('42', '12.3', '24,000');
	print(min);	// 12.3
})();

function _asNumber(x) {
	if (typeof x === 'number') {
		return x;
	}
	let s = _decomma(x || '');
	return Number(s);
}
lost.number = _asNumber;

(function () {
	section('number.from');
	console.assert(lost.number('1,234,567.89') === 1234567.89);
	console.assert(lost.number('-1,234,567.89') === -1234567.89);
})();

// opt : option (object or string for zero)
// - zero : alternative to 0 (default is '')
// - comma : true for encomma (default is true)
lost.stringify = (n, opt) => {
	let zero = '';
	let comma = true;
	if (typeof opt === 'string') {
		zero = opt;
	} else if (typeof opt === 'object') {
		zero = typeof opt.zero !== 'undefined' ? opt.zero : zero;
		comma = typeof opt.comma !== 'undefined' ? opt.comma : comma;
	}
	let _n = Number(n || '');
	if (_n === 0) {
		return zero;
	}
	if (isNaN(_n)) {
		return n;
	}
	let s = String(_n);
	if (comma === true) {
		return _encomma(s);
	}
	return s;
};

(function () {
	section('number.from');
	section('number.stringify');
	console.assert(lost.stringify(lost.number('20') * 10000) === '200,000');
	console.assert(lost.stringify(lost.number('80000000') / 10000) === '8,000');
})();

////////////////////////////////////////
// util

// until not void
lost.unv = (...args) => args.find((arg) => !!arg);

(function () {
	section('util.nvo');
	let res = lost.unv(undefined, null, 0, '', 42);
	console.assert(res === 42);
})();

})();
