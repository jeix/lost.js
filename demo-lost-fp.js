
(function () {
	console.log('-- copyKeys');
	let obj1 = {x:'foo', y:42, z:'oof'};
	let res = lost._.copyKeys(obj1, ['x','y'], {}, ['s','t']);
	console.log(JSON.stringify(res));
		// {"s":"foo","t":42}
})();

(function () {
	console.log('-- partial');
	let obj1 = {x:'foo', y:42, z:'oof'};
	let res;
	res = lost._.partial(obj1, 'x', 'y')
	console.log(JSON.stringify(res));
		// {"x":"foo","y":42}
	res = lost._.partial(obj1, ['x','y'])
	console.log(JSON.stringify(res));
		// {"x":"foo","y":42}
})();

(function () {
	console.log('-- mixin');
	let obj1 = {x:'foo',y:42,z:'oof'};
	let obj2 = {s:'foo',t:42,u:'oof'};
	let res = lost._.mixin({}, obj1, obj2);
	console.log(JSON.stringify(res));
		// {"x":"foo","y":42,"z":"oof","s":"foo","t":42,"u":"oof"}
})();

(function () {
	console.log('-- contain');
	let obj1 = {x:'foo', y:42, z:'oof'};
	let res;
	res = lost._.contain(obj1, {x:'foo',y:42});
	console.log(JSON.stringify(res));
		// true
	res = lost._.contain(obj1, {x:'foo',y:42,u:'oof'});
	console.log(JSON.stringify(res));
		// false
})();


(function () {
	console.log('-- find');
	let xlist = [{x:'foo',y:42,z:'oof'},{x:'bar',y:103,z:'rab'},{x:'qux',y:24,z:'xuq'}];
	let res = lost._.find(xlist, {x:'qux',y:24});
	console.log(JSON.stringify(res));
		// {"x":"qux","y":24,"z":"xuq"}
})();

(function () {
	console.log('-- findOneBy');
	let xlist = [{x:'foo',y:42,z:'oof'},{x:'bar',y:103,z:'rab'},{x:'qux',y:24,z:'xuq'}];
	let res;
	res = lost._.findOneBy()(xlist);
	console.log(JSON.stringify(res));
		// {"x":"foo","y":42,"z":"oof"}
	res = lost._.findOneBy(['x','qux','y',24])(xlist);
	console.log(JSON.stringify(res));
		// {"x":"qux","y":24,"z":"xuq"}
	res = lost._.findOneBy('x','qux','y',24)(xlist);
	console.log(JSON.stringify(res));
		// {"x":"qux","y":24,"z":"xuq"}
	res = lost._.findOneBy({x:'qux',y:24})(xlist);
	console.log(JSON.stringify(res));
		// {"x":"qux","y":24,"z":"xuq"}
	res = lost._.findOneBy((item)=>(item.x==='qux' && item.y===24))(xlist);
	console.log(JSON.stringify(res));
		// {"x":"qux","y":24,"z":"xuq"}
})();

(function () {
	console.log('-- findAllBy');
	let xlist = [{x:'foo',y:42,z:'oof'},{x:'bar',y:103,z:'rab'},{x:'qux',y:24,z:'xuq'}];
	let res;
	res = lost._.findAllBy()(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"foo","y":42,"z":"oof"},{"x":"bar","y":103,"z":"rab"},{"x":"qux","y":24,"z":"xuq"}]
	res = lost._.findAllBy(['x','qux','y',24])(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"qux","y":24,"z":"xuq"}]
	res = lost._.findAllBy('x','qux','y',24)(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"qux","y":24,"z":"xuq"}]
	res = lost._.findAllBy({x:'qux',y:24})(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"qux","y":24,"z":"xuq"}]
	res = lost._.findAllBy((item)=>(item.x==='qux' && item.y===24))(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"qux","y":24,"z":"xuq"}]
})();

(function () {
	console.log('-- narrowBy');
	let list = [
		{x:'foo', y:42,  z:function(){return lost._.reverseS(this.x)}},
		{x:'bar', y:103, z:function(){return lost._.reverseS(this.x)}},
		{x:'qux', y:24,  z:function(){return lost._.reverseS(this.x)}},
	];
	let narrowed = lost._.narrowBy('x','y')(list);
	console.log(JSON.stringify(narrowed));
		// [
		// {"x":"foo","y":42},
		// {"x":"bar","y":103},
		// {"x":"qux","y":24}
		// ]
})();

(function () {
	console.log('-- relate');
	let xlist = [{x:'foo',y:42,z:'oof'},{x:'bar',y:103,z:'rab'},{x:'qux',y:24,z:'xuq'}];
	let ylist = [{s:'foo',t:42,u:'oof'},{s:'bar',t:103,u:'rab'},{s:'qux',t:24,u:'xuq'}];
	let res = lost._.relate('rel', xlist, ['x','y'], ylist, ['s','t']);
	console.log(JSON.stringify(res));
		// [
		// {"x":"foo","y":42,"z":"oof","rel":{"s":"foo","t":42,"u":"oof"}},
		// {"x":"bar","y":103,"z":"rab","rel":{"s":"bar","t":103,"u":"rab"}},
		// {"x":"qux","y":24,"z":"xuq","rel":{"s":"qux","t":24,"u":"xuq"}}
		// ]
})();

(function () {
	console.log('-- hire');
	let xlist = [{x:'foo',y:42,z:'oof'},{x:'bar',y:103,z:'rab'},{x:'qux',y:24,z:'xuq'}];
	let ylist = [{s:'foo',t:42,u:'oof'},{s:'bar',t:103,u:'rab'},{s:'qux',t:24,u:'xuq'}];
	let res = lost._.hire(['u'], xlist, ['x','y'], ylist, ['s','t']);
	console.log(JSON.stringify(res));
		// [
		// {"x":"foo","y":42,"z":"oof","u":"oof"},
		// {"x":"bar","y":103,"z":"rab","u":"rab"},
		// {"x":"qux","y":24,"z":"xuq","u":"xuq"}
		// ]
})();

(function () {
	console.log('-- sortBy');

	let obj1 = {x: 'foo', y: 42, z: '고구마'};
	let obj2 = {x: 'bar', y: 123, z: '고사리'};
	let obj3 = {x: 'qux', y: 24, z: '고라니'};
	let arr1 = [obj1, obj2, obj3];
	let arr2 = lost._.sortBy('x')(arr1);
	console.log(JSON.stringify(arr2));
		// [
		// {"x":"bar","y":123,"z":"고사리"},
		// {"x":"foo","y":42,"z":"고구마"},
		// {"x":"qux","y":24,"z":"고라니"}
		// ]
	arr1 = [obj1, obj2, obj3];
	arr2 = lost._.sortBy('y','asNumber')(arr1);
	console.log(JSON.stringify(arr2));
		// [
		// {"x":"qux","y":24,"z":"고라니"}
		// {"x":"foo","y":42,"z":"고구마"},
		// {"x":"bar","y":123,"z":"고사리"},
		// ]

	let list = [
		{x:'foo', y:42,  z:function(){ return lost._.reverseS(this.x) }},
		{x:'bar', y:103, z:function(){ return lost._.reverseS(this.x) }},
		{x:'qux', y:24,  z:function(){ return lost._.reverseS(this.x) }},
	];
	let sorted;
	sorted = lost._.sortBy('x','y','z')(list);
	console.log(JSON.stringify (sorted));
		// [{"x":"bar","y":103},{"x":"foo","y":42},{"x":"qux","y":24}]
	sorted = lost._.sortBy('y','x')(list);
	console.log(JSON.stringify(sorted));
		// [{"x":"qux","y":24},{"x":"foo","y":42},{"x":"bar","y":103}]
	sorted = lost._.sortBy('z')(list);
	console.log(JSON.stringify(sorted));
		// [{"x":"foo","y":42},{"x":"bar","y":103},{"x":"qux","y":24}]
	sorted = lost._.sortBy((o1,o2) => (o1.x > o2.x ? 1 : o1.x < o2.x ? -1 : 0))(list);
	console.log(JSON.stringify(sorted));
		// [{"x":"bar","y":103},{"x":"foo","y":42},{"x":"qux","y":24}]
})();

(function () {
	console.log('-- uniqueBy');
	let xlist = [{x:'foo',y:42,z:'oof'},{x:'bar',y:103,z:'rab'},{x:'qux',y:24,z:'xuq'}];
	let res;
	res = lost._.uniqueBy()(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"foo","y":42,"z":"oof"},{"x":"bar","y":103,"z":"rab"},{"x":"qux","y":24,"z":"xuq"}]
	res = lost._.uniqueBy('x','y')(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"foo","y":42,"z":"oof"},{"x":"bar","y":103,"z":"rab"},{"x":"qux","y":24,"z":"xuq"}]
	res = lost._.uniqueBy(['x','y'])(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"foo","y":42,"z":"oof"},{"x":"bar","y":103,"z":"rab"},{"x":"qux","y":24,"z":"xuq"}]
	res = lost._.uniqueBy((item)=>({x:item.x,y:item.y}))(xlist);
	console.log(JSON.stringify(res));
		// [{"x":"foo","y":42,"z":"oof"},{"x":"bar","y":103,"z":"rab"},{"x":"qux","y":24,"z":"xuq"}]
})();

(function () {
	console.log('-- zip');
	let xlist = [{x:'foo',y:42,z:'oof'},{x:'bar',y:43,z:'rab'},{x:'qux',y:44,z:'xuq'}];
	let ylist = [{s:'foo',t:42,u:'oof'},{s:'bar',t:43,u:'rab'},{s:'qux',t:44,u:'xuq'}];
	zipped = lost._.zip(xlist, ylist);
	console.log(JSON.stringify(zipped));
		// [
		// [{"x":"foo","y":42,"z":"oof"},{"s":"foo","t":42,"u":"oof"}],
		// [{"x":"bar","y":43,"z":"rab"},{"s":"bar","t":43,"u":"rab"}],
		// [{"x":"qux","y":44,"z":"xuq"},{"s":"qux","t":44,"u":"xuq"}]
		// ]
})();

(function () {
	console.log('-- journey to curry (1)');

	const add = (...args) => {
		let x = 0;
		if (args.length > 0 && args[0] != undefined) {
			x = args[0];
		}
		const _add = (y) => x + y;
		if (args.length > 1) {
			return _add(args[1]);
		} else {
			return _add;
		}
	};

	let res;
	res = add(1,2);
	console.log(JSON.stringify(res));  // 3
	res = add(1)(2);
	console.log(JSON.stringify(res));  // 3
	res = add()(3);
	console.log(JSON.stringify(res));  // 3
	res = add()('a');
	console.log(JSON.stringify(res));  // 0a
	res = add(null)(3);
	console.log(JSON.stringify(res));  // 3
})();

(function () {
	console.log('-- journey to curry (2)');

	const build = (...args) => {
		const _args = ['_','_','_'];
		const _xyz = [];
		const _build = (...args) => {
			while (_args.length > 0 && args.length > 0) {
				_args.shift();
				_xyz.push(args.shift());
			}
			if (_args.length === 0) {
				const [x,y,z] = _xyz;
				return {x,y,z};
			} else {
				return _build;
			}
		};
		return _build.apply(null, args);
	};

	let res;
	res = build('foo',42,'고구마');
	console.log(JSON.stringify(res));  // {"x":"foo","y":42,"z":"고구마"}
	res = build('foo',42)('고구마');
	console.log(JSON.stringify(res));  // {"x":"foo","y":42,"z":"고구마"}
	res = build('foo')(42,'고구마');
	console.log(JSON.stringify(res));  // {"x":"foo","y":42,"z":"고구마"}
	res = build('foo')(42)('고구마');
	console.log(JSON.stringify(res));  // {"x":"foo","y":42,"z":"고구마"}
	res = build()('foo')(42)('고구마');
	console.log(JSON.stringify(res));  // {"x":"foo","y":42,"z":"고구마"}
	res = build()('foo')(42,'고구마');
	console.log(JSON.stringify(res));  // {"x":"foo","y":42,"z":"고구마"}
	res = build()('foo',42)('고구마');
	console.log(JSON.stringify(res));  // {"x":"foo","y":42,"z":"고구마"}
	res = build()('foo',42,'고구마');
	console.log(JSON.stringify(res));  // {"x":"foo","y":42,"z":"고구마"}
})();

(function () {
	console.log('-- journey to curry (3)');

	let res;
	build = (x,y,z) => ({x,y,z});
	res = lost._.curry(build,3)('foo')(42)('고구마');
	console.log(JSON.stringify(res));
		// {"x":"foo","y":42,"z":"고구마"}
	res = lost._.curry(build)('foo')(42)('고구마');
	console.log(JSON.stringify(res));
		// {"x":"foo","y":42,"z":"고구마"}
})();

(function () {
	console.log('-- memoize');

	let callCnt, res;
	//let fibonacci = (n) => (n === 1 || n === 2 ? 1 : fibonacci(n-2) + fibonacci(n-1));
	let fibonacci = (n) => {
		callCnt++;
		return (n === 1 || n === 2 ? 1 : fibonacci(n-2) + fibonacci(n-1));
	}
	callCnt = 0;
	res = fibonacci(10);
	console.log(JSON.stringify(res), 'is out;', callCnt, 'times called');  // 55 is out; 109 times called
	fibonacci = lost._.memoize(fibonacci);
	callCnt = 0;
	res = fibonacci(10);
	console.log(JSON.stringify(res), 'is out;', callCnt, 'times called');  // 55 is out 10 times called

	//let add = lost._.memoize((x,y) => x + y);
	let add = lost._.memoize((x,y) => { callCnt++; return x + y; });
	callCnt = 0;
	res = add(3,4);
	console.log(JSON.stringify(res), 'is out;', (callCnt ? 'called' : 'no call'));  // 7 is out; called
	callCnt = 0;
	res = add(13,14);
	console.log(JSON.stringify(res), 'is out;', (callCnt ? 'called' : 'no call'));  // 27 is out; called
	callCnt = 0;
	res = add(3,4);
	console.log(JSON.stringify(res), 'is out;', (callCnt ? 'called' : 'no call'));  // 7 is out; no call
})();
