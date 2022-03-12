
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

const lost = {
	object: {},
	list: {},
	string: {},
	number: {},
	util: {},
};

/*
let {x, y, z} = src;
let dst = {x, y, z};
//*/
function partial(from, keys) {
	let to = {};
	keys.forEach((k) => {
		to[k] = from[k];
	});
	return to;
}
lost.object.partial = partial;

(function () {
	section('object.partial');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let obj2 = lost.object.partial(obj1, ['x','y']);
	print(obj2);	// {"x":"foo","y":42}
})();

function negativePartial(from, keys) {
	let to = {};
	Object.keys(from).forEach((k) => {
		if (! keys.includes(k)) {
			to[k] = from[k];
		}
	});
	return to;
}
lost.object.negativePartial = negativePartial;

(function () {
	section('object.negativePartial');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	obj1 = {u: 'banana', v: 'orange', ...obj1};
	let obj2 = lost.object.negativePartial(obj1, ['x','y']);
	print(obj2);	// {"u":"banana","v":"orange","z":"고구마"}
})();

// args
// - [['x', xval], ['y', yval], ['z', zval]]
// - [['x', xval, 'y', yval, 'z', zval]
function fromArray(args) {
	let obj = {};
	let k, v;
	if (args.every((arg) => Array.isArray(arg) && arg.length === 2)) {
		args.forEach((kv) => {
			obj[kv[0]] = kv[1];
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
lost.object.fromArray = fromArray;

(function () {
	section('object.fromArray');
	let arr1 = ['x', 'foo', 'y', 42, 'z', '고구마'];
	let obj1 = lost.object.fromArray(arr1);
	print(obj1);	// {"x":"foo","y":42,"z":"고구마"}
	let arr2 = [['x', 'foo'], ['y', 42], ['z', '고구마']];
	let obj2 = lost.object.fromArray(arr2);
	print(obj2);	// {"x":"foo","y":42,"z":"고구마"}
})();

lost.object.toArray = (from, keys, flatten) => {
	let to = [];
	keys = keys || Object.keys(from);
	if (flatten) {
		keys.forEach((k) => {
			to = to.concat([k, from[k]]);
		});
	} else {
		keys.forEach((k) => {
			to.push([k, from[k]]);
		});
	}
	return to;
};
lost.object.FLATTEN = 'flatten';

(function () {
	section('object.toArray');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let arr1 = lost.object.toArray(obj1);
	print(arr1);	// [["x","foo"],["y",42],["z","고구마"]]
	let arr2 = lost.object.toArray(obj1, ['x','y'], lost.object.FLATTEN);
	print(arr2);	// ["x","foo","y",42]
})();

function toString(x) {
	return JSON.stringify(x);
}
lost.object.toString = toString;

lost.object.mixin = (dst, ...ingredients) => {
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
function nvo(src, path, dflt) {
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
}
lost.object.nvo = nvo;

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

// howto
// - (x) => { ... }
// - {x, y, z}
// - [['x', xval], ['y', yval], ['z', zval]]
// - ['x', xval, 'y', yval, 'z', zval]
function howToSeek(howto) {
	if (typeof howto === 'function') return howto;
	if (Array.isArray(howto)) howto = fromArray(howto);
	if (typeof howto === 'object') {
		return (x) => {
			return Object.keys(howto).every((k) => {
				return howto[k] === x[k];
			});
		};
	}
	return false;
}
lost.list.howToSeek = howToSeek;

lost.list.filter = (arr, howto) => {
	howto = howToSeek(howto);
	if (howto === false) return [];
	return arr.filter(howto);
};

(function () {
	section('list.filter');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let filtered = lost.list.filter(arr1, [['x','bar'],['y',43]]);
	print(filtered);	// [{"x":"bar","y":43}]
})();

lost.list.find = (arr, howto) => {
	howto = howToSeek(howto);
	if (howto === false) return false;
	return arr.find(howto) || false;
};

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
	howto = howToSeek(howto);
	if (howto === false) return false;
	return arr.slice().reverse().find(howto) || false;
};

(function () {
	section('list.findLast');
	let obj1 = {x: 'foo', y: 42, z:'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 42, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let found = lost.list.findLast(arr1, (item) => item.x === 'foo' && item.y === 42);
	print(found);	// {"x":"bar","y":43,"z":"orange"}
})();

lost.list.findIndex = (arr, howto) => {
	howto = howToSeek(howto);
	if (howto === false) return -1;
	return arr.findIndex(howto);
}

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
	howto = howToSeek(howto);
	if (howto === false) return -1;
	let index = arr.slice().reverse().findIndex(howto);
	return index >= 0 ? arr.length - index - 1 : -1
}

(function () {
	section('list.findLastIndex');
	let obj1 = {x: 'foo', y: 42, z:'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 42, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let index = lost.list.findLastIndex(arr1, {x: 'foo', 'y': 42});
	print(index);	// 2
})();

(function () {
	section('xxx');
})();

(function () {
	section('xxx');
})();

(function () {
	section('xxx');
})();

(function () {
	section('xxx');
})();

(function () {
	section('xxx');
})();

(function () {
	section('xxx');
})();

(function () {
	section('xxx');
})();

})();
