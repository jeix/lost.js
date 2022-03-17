
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
lost.object.partial = _partial;

(function () {
	section('object.partial');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let obj2 = lost.object.partial(obj1, ['x','y']);
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
lost.object.negativePartial = _partialExcept;

(function () {
	section('object.negativePartial');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	obj1 = {u: 'banana', v: 'orange', ...obj1};
	let obj2 = lost.object.negativePartial(obj1, ['x','y']);
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
lost.object.fromArray = _fromArray;

(function () {
	section('object.fromArray');
	let arr1 = ['x', 'foo', 'y', 42, 'z', '고구마'];
	let obj1 = lost.object.fromArray(arr1);
	print(obj1);	// {"x":"foo","y":42,"z":"고구마"}
	let arr2 = [['x', 'foo'], ['y', 42], ['z', '고구마']];
	let obj2 = lost.object.fromArray(arr2);
	print(obj2);	// {"x":"foo","y":42,"z":"고구마"}
	let arr3 = [{k:'x', v:'foo'}, {k:'y', v:42}, {k:'z', v:'고구마'}];
	let obj3 = lost.object.fromArray(arr3);
	print(obj3);	// {"x":"foo","y":42,"z":"고구마"}
})();

const constants = {
	FLAT: 'flat', // ['x', xval, 'y', yval, 'z', zval]
	NEST: 'nest', // [['x', xval], ['y', yval], ['z', zval]]
	OBJE: 'obje', // [{k:'x', v: xval}, {k:'y', v:yval}, {k:'z', v:zval}]
};
lost.object.FLAT = constants.FLAT;
lost.object.NEST = constants.NEST;
lost.object.OBJE = constants.OBJE;

lost.object.toArray = (from, mode, keys) => {
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
	let arr1 = lost.object.toArray(obj1, lost.object.FLAT);
	print(arr1);	// ["x","foo","y",42,"z","고구마"]
	let arr2 = lost.object.toArray(obj1, lost.object.NEST, ['x','y']);
	print(arr2);	// [["x","foo"],["y",42]]
	let arr3 = lost.object.toArray(obj1, lost.object.OBJE);
	print(arr3);	// [{"k":"x","v":"foo"},{"k":"y","v":42},{"k":"z","v":"고구마"}]
})();

function _toString(x) {
	return JSON.stringify(x);
}
lost.object.toString = _toString;

function _values(x, keys) {
	return keys.map((k) => x[k]);
}
lost.object.values = _values;

function _equal(x, y, keys) {
	return keys.every((k) => x[k] === y[k]);
}
lost.object.equal = _equal;

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
lost.object.mixin = _mixin;

(function () {
	section('object.mixin');
	let obj1 = {a: 'foo', b: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {m: 'qux', n: 44};
	let obj4 = lost.object.mixin(obj1, obj2, obj3);
	print(obj1);
		// {"a":"foo","b":42,"x":"bar","y":43,"m":"qux","n":44}
})();

// nested value of
lost.object.nvo = function (src, path, dflt) {
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
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo = {};
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar = [];
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar[0] = {};
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar[0].Qux = '';
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '', toString(pane) + '::' + val);
	pane.Foo.Bar[0].Qux = '4';
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '4', toString(pane) + '::' + val);

	pane.Foo.Bar = '';
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar = 0;
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar = true;
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
	pane.Foo.Bar = false;
	val = lost.object.nvo(pane, PATH, '0');
	assert(val === '0', toString(pane) + '::' + val);
})();

if (typeof Array.prototype.includes === 'function')
lost.array.includes = (arr, seek) => arr.includes(seek);
else
lost.array.includes = (arr, seek) => arr.indexOf(seek) >= 0;

(function () {
	section('array.includes');
	let arr1 = ['foo', 'bar', 'qux'];
	console.assert(lost.array.includes(arr1, 'foo') === true);
	console.assert(lost.array.includes(arr1, 'bar') === true);
	console.assert(lost.array.includes(arr1, 'qux') === true);
	console.assert(lost.array.includes(arr1, 'baz') === false);
	console.assert(lost.array.includes(arr1, '') === false);
})();

// howto
// - (x) => { ... }
// - {x, y, z}
// - [['x', xval], ['y', yval], ['z', zval]]
// - ['x', xval, 'y', yval, 'z', zval]
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
lost.list.howToSeek = _howToSeek;

function _filter(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return [];
	return arr.filter(howto);
}
lost.list.filter = _filter;

(function () {
	section('list.filter');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let filtered = lost.list.filter(arr1, [['x','bar'],['y',43]]);
	print(filtered);	// [{"x":"bar","y":43}]
})();

function _find(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return false;
	return arr.find(howto) || false;
}
lost.list.find = _find;

(function () {
	section('list.find');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let found = lost.list.find(arr1, {x: 'bar', 'y': 43});
	print(found);	// {"x":"bar","y":43}
})();

lost.list.findLast = (arr, howto) => {
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
	let found = lost.list.findLast(arr1, (item) => item.x === 'foo' && item.y === 42);
	print(found);	// {"x":"bar","y":43,"z":"orange"}
})();

function _findIndex(arr, howto) {
	howto = _howToSeek(howto);
	if (howto === false) return -1;
	return arr.findIndex(howto);
}
lost.list.findIndex = _findIndex;

(function () {
	section('list.findIndex');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let index = lost.list.findIndex(arr1, ['x','bar','y',43]);
	print(index);	// 1
})();

lost.list.findLastIndex = (arr, howto) => {
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
	let index = lost.list.findLastIndex(arr1, {x: 'foo', 'y': 42});
	print(index);	// 2
})();

// - list: list to sort  -- not changed
// - by : function or [keyNameOpt, ...]
//   - keyNameOpt: #~keyName
//     - #: asNumber (optional)
//     - ~: descending (optional)
lost.list.sort = (list, by) => {
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
	let arr2 = lost.list.sort(arr1, (e1, e2) => (
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
	arr2 = lost.list.sort(arr1, ['~x']);	// descending
	print(arr2);
		// [
		// {"x":"qux","y":"24"},
		// {"x":"foo","y":"42"},
		// {"x":"bar","y":"123"}
		// ]
	arr2 = lost.list.sort(arr1, ['y']);
	print(arr2);
		// [
		// {"x":"bar","y":"123"},
		// {"x":"qux","y":"24"},
		// {"x":"foo","y":"42"}
		// ]
	arr2 = lost.list.sort(arr1, ['~y']);	// descending
	print(arr2);
		// [
		// {"x":"foo","y":"42"},
		// {"x":"qux","y":"24"},
		// {"x":"bar","y":"123"}
		// ]
	arr2 = lost.list.sort(arr1, ['#y']);	// asNumber
	print(arr2);
		// [
		// {"x":"qux","y":"24"},
		// {"x":"foo","y":"42"},
		// {"x":"bar","y":"123"}
		// ]
	arr2 = lost.list.sort(arr1, ['#~y']);	// asNumber descending
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
lost.list.unique = (list, keys) => {
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
	let arr2 = lost.list.unique(arr1, ['x','z']);
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
lost.list.group = (list, keys) => {
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
	let arr2 = lost.list.group(arr1, ['x','z']);
	print(arr2);
		// [
		// [{"x":"foo","y":42,"z":"apple"},{"x":"foo","y":44,"z":"apple"}],
		// [{"x":"bar","y":43,"z":"orange"}]
		// ]
})();

lost.list.merge = (xlist, ylist, keys) => {
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
	lost.list.merge(arr1, arr2, ['x','y']);
	print(arr1);
		// [
		// {"x":"foo","y":42,"z":"apple"},
		// {"x":"bar","y":43,"z":"orange"},
		// {"x":"qux","y":44,"z":"banana"}
		// ]
})();

lost.list.absorb = (xlist, ylist, keys, embedKeys) => {
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
	lost.list.absorb(arr1, arr2, ['x','y'], ['z']);
	print(arr1);
		// [
		// {"x":"foo","y":42,"z":"apple"},
		// {"x":"bar","y":43,"z":"orange"},
		// {"x":"qux","y":44,"z":"banana"}
		// ]
})();

lost.list.embed = (xlist, ylist, keys, embedKey) => {
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
	lost.list.embed(arr1, arr2, ['x','y'], ['u']);
	print(arr1);
		// [
		// {"x":"foo","y":42,"z":"apple","u":{"x":"foo","y":42,"z":"고구마"}},
		// {"x":"bar","y":43,"z":"orange","u":{"x":"bar","y":43,"z":"고사리"}},
		// {"x":"qux","y":44,"z":"banana","u":{"x":"qux","y":44,"z":"고라니"}}
		// ]
})();

lost.list.slim = (list, keys) => {
	return list.map((x) => _partial(x, keys));
};

(function () {
	section('list.slim');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'qux', y: 44, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.list.slim(arr1, ['x','y']);
	print(arr2);	// [{"x":"foo","y":42},{"x":"bar","y":43},{"x":"qux","y":44}]
})();

lost.list.flatten = (list) => {
	let flatten = [];
	list.forEach((x) => {
		if (Array.isArray(x)) {
			let sublist = x;
			sublist.forEach((subx) => {
				flatten.push(subx);
			});
		} else {
			flatten.push(x);
		}
	});
	return flatten;
};

(function () {
	section('list.flatten');
	let arr1 = ['foo', 42, 'apple'];
	let arr2 = ['bar', 43, 'orange'];
	let arr3 = ['qux', 44, 'banana'];
	let arr = [arr1, arr2, arr3];
	let flatten = lost.list.flatten(arr);
	print(flatten);	// ["foo",42,"apple","bar",43,"orange","qux",44,"banana"]
})();

lost.list.zip = function (list1, list2) {
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
	let zipped = lost.list.zip(arr1, arr2, arr3);
	print(zipped);
		// [
		// [{"x":"foo"},{"y":42},{"z":"고구마"}],
		// [{"x":"bar"},{"y":43},{"z":"고사리"}],
		// [{"x":"qux"},{"y":44},{"z":"고라니"}]
		// ]
})();

lost.list.groupBy = (list, keys, aggregate, initialize) => {
	let groups = [];
	list.forEach((x) => {
		let kvo = _partial(x, keys);
		let group = _find(groups, kvo);
		if (group === false) {
			if (typeof initialize === 'function') {
				group = _mixin(kvo, initialize());
			} else {
				group = _mixin({}, x);
			}
			//group._list_ = [];
			groups.push(group);
		}
		//group._list_.push(x);
		aggregate(group, x);
	});
	return groups;
};

lost.list.flowDown = (outers, inners, keys, worker) => {
	outers.forEach((outer) => {
		inners.forEach((inner) => {
			if (_equal(outer, inner, keys)) {
				worker(outer, inner);
			}
		});
	});
};

(function () {
	section('lost.list.groupBy');
	const initialize = () => ({ysum: 0, zlist: []});
	const aggregate = (group, member) => {
		group.ysum = group.ysum + member.y;
		group.zlist.push(member.z);
	};
	let obj1 = {x: 'foo', y: 42, z:'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 42, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.list.groupBy(arr1, ['x','y'], aggregate, initialize);
	print(arr2);
		// [
		// {"x":"foo","y":42,"ysum":84,"zlist":["apple","banana"]},
		// {"x":"bar","y":43,"ysum":43,"zlist":["orange"]}
		// ]
})();

(function () {
	section('lost.list.groupBy');
	section('lost.list.flowDown');
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
	let list2 = lost.list.groupBy(list1, ['a','b'], aggregate2, initialize2);
	print(list2);
		// [
		// {"a":"A1","b":"B1","mmin":38},
		// {"a":"A1","b":"B2","mmin":56},
		// {"a":"A2","b":"B3","mmin":7}
		// ]
	// a-b 기준 그룹 모든 멤버의 m = 찾은 a-b 기준 그룹별 최소 m
	lost.list.flowDown(list2, list1, ['a','b'], (group, member) => {
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
	let list3 = lost.list.groupBy(list2, ['a'], aggregate3, initialize3);
	print(list3);
		// [
		// {"a":"A1","msum":94},
		// {"a":"A2","msum":7}
		// ]
})();

(function () {
	section('lost.list.groupBy');
	section('lost.list.flowDown');
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
			let groups = lost.list.groupBy(list, keys, aggreagte);
			list = lost.list.unique(list, keys);
			lost.list.flowDown(groups, list, keys, (group, member) => {
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

if (typeof String.prototype.includes === 'function')
lost.string.includes = (s, part) => s.includes(part);
else
lost.string.includes = (s, part) => s.indexOf(part) >= 0;

(function () {
	section('string.includes');
	let s = 'foo,bar,qux';
	console.assert(lost.string.includes(s, 'foo') === true);
	console.assert(lost.string.includes(s, 'bar') === true);
	console.assert(lost.string.includes(s, 'qux') === true);
	console.assert(lost.string.includes(s, 'baz') === false);
	console.assert(lost.string.includes(s, '') === true);
})();

// String.prototype.slice is there even IE
lost.string.slice = function (s, begin, end) {
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
	console.assert(lost.string.slice(s) === '12345');
	console.assert(lost.string.slice(s, 1, -1) === '234');
	console.assert(lost.string.slice(s, -1) === '5');
	console.assert(lost.string.slice(s, 2, 4) === '34');
	console.assert(lost.string.slice(s, -1, 1) === '');
})();

function _encomma(s) {
	return (s || '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}
lost.string.encomma = _encomma;

function _decomma(s) {
	return (s || '').replace(/,/g, '');
}
lost.string.decomma = _decomma;

lost.string.padStart = (s, len, c) => {
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
lost.string.padEnd = (s, len, c) => {
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
lost.string.repeat = (s, n) => {
	return new Array(n).fill(s).join('');
}

function _max(...nums) {
	return nums.reduce((max, num) => {
		num = Number(_decomma(String(num)));
		return max < num ? num : max;
	});
}
lost.number.max = _max;

(function () {
	section('number.max');
	let max = lost.number.max('42', '123', '24');
	print(max);	// 123
})();

function _min(...nums) {
	return nums.reduce((min, num) => {
		num = Number(_decomma(String(num)));
		return num < min ? num : min;
	});
}
lost.number.min = _min;

(function () {
	section('number.min');
	let min = lost.number.min('42', '12.3', '24,000');
	print(min);	// 12.3
})();

lost.number.from = (x) => {
	if (typeof x === 'number') {
		return x;
	}
	let s = _decomma(x || '');
	return Number(s);
};

(function () {
	section('number.from');
	console.assert(lost.number.from('1,234,567.89') === 1234567.89);
	console.assert(lost.number.from('-1,234,567.89') === -1234567.89);
})();

// opt : option (object or string for zero)
// - zero : alternative to 0 (default is '')
// - comma : true for encomma (default is true)
lost.number.stringify = (n, opt) => {
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
	console.assert(lost.number.stringify(lost.number.from('20') * 10000) === '200,000');
	console.assert(lost.number.stringify(lost.number.from('80000000') / 10000) === '8,000');
})();

// until not void
lost.util.unv = (...args) => args.find((arg) => !!arg);

(function () {
	section('util.nvo');
	let res = lost.util.unv(undefined, null, 0, '', 42);
	console.assert(res === 42);
})();

})();
