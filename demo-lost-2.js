
function section(s) {
	console.log('##', s);
}

function print(...args) {
	args = args.map((x) => jsonify(x));
	console.log.apply(null, args);
}

const jsonify = JSON.stringify;

const assert = console.assert;

////////////////////////////////////////
// object

(function () {
	section('object.partial');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let obj2 = lost.partial(obj1, ['x','y']);
	assert(jsonify(obj2) === '{"x":"foo","y":42}');
})();

(function () {
	section('object.except');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	obj1 = {u: 'banana', v: 'orange', ...obj1};
	let obj2 = lost.except(obj1, ['x','y']);
	assert(jsonify(obj2) === '{"u":"banana","v":"orange","z":"고구마"}');
})();

(function () {
	section('object.fromArray');
	let arr1 = ['x', 'foo', 'y', 42, 'z', '고구마'];
	let obj1 = lost.fromArray(arr1);
	assert(jsonify(obj1) === '{"x":"foo","y":42,"z":"고구마"}');
	let arr2 = [['x', 'foo'], ['y', 42], ['z', '고구마']];
	let obj2 = lost.fromArray(arr2);
	assert(jsonify(obj2) === '{"x":"foo","y":42,"z":"고구마"}');
	let arr3 = [{k:'x', v:'foo'}, {k:'y', v:42}, {k:'z', v:'고구마'}];
	let obj3 = lost.fromArray(arr3);
	assert(jsonify(obj3) === '{"x":"foo","y":42,"z":"고구마"}');
})();

(function () {
	section('object.toArray');
	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let arr1 = lost.toArray(obj1, lost.FLAT);
	assert(jsonify(arr1) === '["x","foo","y",42,"z","고구마"]');
	let arr2 = lost.toArray(obj1, lost.NEST, ['x','y']);
	assert(jsonify(arr2) === '[["x","foo"],["y",42]]');
	let arr3 = lost.toArray(obj1, lost.OBJE);
	assert(jsonify(arr3) === '[{"k":"x","v":"foo"},{"k":"y","v":42},{"k":"z","v":"고구마"}]');
})();

(function () {
	section('object.mixin');
	let obj1 = {a: 'foo', b: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {m: 'qux', n: 44};
	let obj4 = lost.mixin(obj1, obj2, obj3);
	print(obj1);
		// {"a":"foo","b":42,"x":"bar","y":43,"m":"qux","n":44}
})();

(function () {
	section('object.nvo');
	const PATH = 'Foo/Bar/0/Qux';
	const pane = {};
	let val;
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', jsonify(pane) + '::' + jsonify(val));
	pane.Foo = {};
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', jsonify(pane) + '::' + jsonify(val));
	pane.Foo.Bar = [];
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', jsonify(pane) + '::' + jsonify(val));
	pane.Foo.Bar[0] = {};
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', jsonify(pane) + '::' + jsonify(val));
	pane.Foo.Bar[0].Qux = '';
	val = lost.nvo(pane, PATH, '0');
	assert(val === '', jsonify(pane) + '::' + jsonify(val));
	pane.Foo.Bar[0].Qux = '4';
	val = lost.nvo(pane, PATH, '0');
	assert(val === '4', jsonify(pane) + '::' + jsonify(val));

	pane.Foo.Bar = '';
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', jsonify(pane) + '::' + jsonify(val));
	pane.Foo.Bar = 0;
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', jsonify(pane) + '::' + jsonify(val));
	pane.Foo.Bar = true;
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', jsonify(pane) + '::' + jsonify(val));
	pane.Foo.Bar = false;
	val = lost.nvo(pane, PATH, '0');
	assert(val === '0', jsonify(pane) + '::' + jsonify(val));
})();

////////////////////////////////////////
// array

(function () {
	section('array.fillZero');
	let arr1 = lost.array(3).map((_, ix) => ix + 1);
	assert(jsonify(arr1) === '[1,2,3]');
})();

(function () {
	section('array.times');
	let arr1 = [];
	lost.repeat(3).forEach((ix) => arr1.push(ix + 1));
	assert(jsonify(arr1) === '[1,2,3]');
})();

(function () {
	section('list.howToSeek');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let seek, arr2;
	seek = lost.howToSeek((_) => _.y != 42);
	arr2 = arr1.filter(seek);
	assert(jsonify(arr2) === '[{"x":"bar","y":43},{"x":"qux","y":44}]');
	seek = lost.howToSeek([['x','foo'], ['y',42]]);
	arr2 = arr1.filter(seek);
	assert(jsonify(arr2) === '[{"x":"foo","y":42}]');
	seek = lost.howToSeek({x:'foo', y:42});
	arr2 = arr1.filter(seek);
	assert(jsonify(arr2) === '[{"x":"foo","y":42}]');
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

(function () {
	section('list.filter');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let filtered = lost.filter(arr1, [['x','bar'],['y',43]]);
	assert(jsonify(filtered) === '[{"x":"bar","y":43}]');
})();

(function () {
	section('list.find');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let found = lost.find(arr1, {x: 'bar', 'y': 43});
	assert(jsonify(found) === '{"x":"bar","y":43}');
})();

(function () {
	section('list.findLast');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 42, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let found = lost.findLast(arr1, (item) => item.x === 'foo' && item.y === 42);
	assert(jsonify(found) === '{"x":"foo","y":42,"z":"banana"}');
})();

(function () {
	section('list.findIndex');
	let obj1 = {x: 'foo', y: 42};
	let obj2 = {x: 'bar', y: 43};
	let obj3 = {x: 'qux', y: 44};
	let arr1 = [obj1, obj2, obj3];
	let index = lost.findIndex(arr1, ['x','bar','y',43]);
	assert(index === 1);
})();

(function () {
	section('list.findLastIndex');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 42, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let index = lost.findLastIndex(arr1, {x: 'foo', 'y': 42});
	assert(index === 2);
})();

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

(function () {
	section('list.unique');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'foo', y: 44, z: 'apple'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.unique(arr1, ['x','z']);
	print(arr2);	// [{"x":"foo","y":42,"z":"apple"},{"x":"bar","y":43,"z":"orange"}]
})();

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

(function () {
	section('list.adjacent');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'foo', y: 43, z: 'apple'};
	let obj3 = {x: 'bar', y: 44, z: 'orange'};
	let obj4 = {x: 'foo', y: 45, z: 'apple'};
	let arr1 = [obj1, obj2, obj3, obj4];
	let arr2 = lost.adjacent(arr1, ['x','z']);
	print(arr2);
		// [
		// [{"x":"foo","y":42,"z":"apple"},{"x":"foo","y":43,"z":"apple"}],
		// [{"x":"bar","y":44,"z":"orange"}],
		// [{"x":"foo","y":45,"z":"apple"}]
		// ]
})();

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

(function () {
	section('list.slim');
	let obj1 = {x: 'foo', y: 42, z: 'apple'};
	let obj2 = {x: 'bar', y: 43, z: 'orange'};
	let obj3 = {x: 'qux', y: 44, z: 'banana'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost.slim(arr1, ['x','y']);
	assert(jsonify(arr2) === '[{"x":"foo","y":42},{"x":"bar","y":43},{"x":"qux","y":44}]');
})();

(function () {
	section('list.flat');
	let arr1 = ['foo', 42, 'apple'];
	let arr2 = ['bar', 43, 'orange'];
	let arr3 = ['qux', 44, 'banana'];
	let arr = [arr1, arr2, arr3];
	let flatten = lost.flat(arr);
	assert(jsonify(flatten) === '["foo",42,"apple","bar",43,"orange","qux",44,"banana"]');
})();

(function () {
	section('list.findMax');
	let max = lost.findMax([-12, 42, 123]);
	assert(max === 123);
	let obj11 = {x: 'foo', y: -12};
	let obj12 = {x: 'bar', y: 42};
	let obj13 = {x: 'qux', y: 123};
	let arr1 = [obj11, obj12, obj13];
	let withMaxY = lost.findMax(arr1, '#y');
	assert(jsonify(withMaxY) === '{"x":"qux","y":123}');
})();

(function () {
	section('list.findMin');
	let min = lost.findMin([-12, 42, 123]);
	assert(min === -12);
	let obj11 = {x: 'foo', y: -12};
	let obj12 = {x: 'bar', y: 42};
	let obj13 = {x: 'qux', y: 123};
	let arr1 = [obj11, obj12, obj13];
	let withMinY = lost.findMin(arr1, '#y');
	assert(jsonify(withMinY) === '{"x":"foo","y":-12}');
})();

(function () {
	section('list.sum');
	let sum = lost.a$sum([-12, 42, 123]);
	assert(sum === 153);
	let obj11 = {x: 'foo', y: -12};
	let obj12 = {x: 'bar', y: 42};
	let obj13 = {x: 'qux', y: 123};
	let arr1 = [obj11, obj12, obj13];
	let sumY = lost.a$sum(arr1, 'y');
	assert(sumY === 153);
})();

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
		list.forEach((elem) => {
			elem.rowspan = {};
		});
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

(function () {
	section('string.slice');
	let s = '12345';
	assert(lost.s$slice(s) === '12345');
	assert(lost.s$slice(s, 1, -1) === '234');
	assert(lost.s$slice(s, -1) === '5');
	assert(lost.s$slice(s, 2, 4) === '34');
	assert(lost.s$slice(s, -1, 1) === '');
})();

(function () {
	section('string.padStart');
	section('string.padEnd');
	section('string.repeat');
	let s = '123';
	assert(lost.s$padStart(s, 5) === '  123');
	assert(lost.s$padStart(s, 5, '0') === '00123');
	assert(lost.s$padEnd(s, 5) === '123  ');
	assert(lost.s$padEnd(s, 5, '0') === '12300');
	assert(lost.s$repeat('*', 5) === '*****');
})();

////////////////////////////////////////
// date

(function () {
	section('date.from');
	section('date.stringify');
    assert(lost.d2s(lost.addMonth(lost.date('2022-04-22'), -3), 'yyyy.mm.dd') === '2022.01.22');
    //
    let dt = lost.date('2022-04-22');
    dt = lost.addMonth(dt, -3);
    dt = lost.d2s(dt, 'yyyy.mm.dd');
    assert(dt === '2022.01.22');
})();

(function () {
	section('date.alt.from');
	section('date.alt.stringify');
	assert(lost.date2('2022-04-22').addMonth(-3).stringify('yyyy.mm.dd') === '2022.01.22');
})();

(function () {
	section('merely.date');
    let dt = lost.date('2022-04-22');
    assert(lost.merely(dt).addMonth(-3).it().toJSON() === lost.date('2022-01-22').toJSON());
    assert(lost.merely(dt).addMonth(-3).stringify('yyyy.mm.dd') === '2022.01.22');
})();

////////////////////////////////////////
// number

(function () {
	section('number.max');
	let max = lost.max('42', '123', '24');
	assert(max === 123);
})();

(function () {
	section('number.min');
	let min = lost.min('42', '12.3', '24,000');
	assert(min === 12.3);
})();

(function () {
	section('number.from');
	assert(lost.number('1,234,567.89') === 1234567.89);
	assert(lost.number('-1,234,567.89') === -1234567.89);
})();

(function () {
	section('number.from');
	section('number.stringify');
	assert(lost.n2s(lost.number('20') * 10000) === '200,000');
	assert(lost.n2s(lost.number('80000000') / 10000) === '8,000');
	assert(lost.n2s(lost.number(Math.PI)) === String(Math.PI));
})();

(function () {
	section('number.alt.from');
	assert(lost.number2('1,234,567.89').value() === 1234567.89);
	assert(lost.number2('-1,234,567.89').value() === -1234567.89);
})();

(function () {
	section('number.alt.from');
	section('number.alt.stringify');
	assert(lost.number2('1000').stringify() === '1,000');
	assert(lost.number2('0').stringify('-') === '-');
	assert(lost.number2('20').multiply(10000).stringify() === '200,000');
	assert(lost.number2('80000000').divide(10000).stringify() === '8,000');
})();

(function () {
	section('merely.number');
    let n = lost.number('1,000');
    assert(lost.merely(n).multiply(100).it() === 100_000);
    assert(lost.merely(n).multiply(100).stringify() === '100,000');
})();

////////////////////////////////////////
// util

(function () {
	section('util.nvo');
	let res = lost.unv(undefined, null, 0, '', 42);
	assert(res === 42);
})();
