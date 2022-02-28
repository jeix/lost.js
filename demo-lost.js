
(function () {
  console.log('-- object.copyKeys');
  let obj1 = {a: 'foo', b: 42};
  let obj2 = {x: 'bar', y: 123};
  lost.object.copyKeys(obj1, obj2, ['x','y']);
  console.log(JSON.stringify(obj1));
    // {"a":"foo","b":42,"x":"bar","y":123}
})();

(function () {
  console.log('--object.mixin');
  let obj1 = {a: 'foo', b: 42};
  let obj2 = {x: 'bar', y: 123};
  let obj3 = {s: 'qux', t: 24};
  lost.object.mixin(obj1, obj2, obj3);
  console.log(JSON.stringify(obj1));
    // {"a":"foo","b":42,"x":"bar","y":123,"s":"qux","t":24}
})();

(function () {
  console.log('--object.nvo');
  const PATH = 'Foo/Bar/0/Qux';
  const pane = {};
  let val = lost.object.nvo(pane, PATH, '0');
  console.assert(val === '0');
  pane.Foo = {};
  val = lost.object.nvo(pane, PATH, '0');
  console.assert(val === '0');
  pane.Foo.Bar = [];
  val = lost.object.nvo(pane, PATH, '0');
  console.assert(val === '0');
  pane.Foo.Bar[0] = {};
  val = lost.object.nvo(pane, PATH, '0');
  console.assert(val === '0');
  pane.Foo.Bar[0].Qux = '';
  val = lost.object.nvo(pane, PATH, '0');
  console.assert(val === '0');
  pane.Foo.Bar[0].Qux = '4';
  val = lost.object.nvo(pane, PATH, '0');
  console.assert(val === '4');
})();

(function () {
  console.log('-- list.filter');
  let obj1 = {x: 'foo', y: 42};
  let obj2 = {x: 'bar', y: 123};
  let obj3 = {x: 'qux', y: 24};
  let arr1 = [obj1, obj2, obj3];
  let found = lost.list.filter(arr1, [['x','bar'],['y',123]]);
  console.log(JSON.stringify(found));
    // [{"x":"bar","y":123}]
  
  console.log('-- list.find');
  found = lost.list.find(arr1, (o) => o.x === 'bar' && o.y === 123);
  console.log(JSON.stringify(found));
    // {"x":"bar","y":123}

  console.log('-- list.findRight');
  found = lost.list.findRight(arr1, {x:'bar',y:123});
  console.log(JSON.stringify(found));
    // {"x":"bar","y":123}
})();

(function () {
  console.log('--list.narrow');
  let obj1 = {x: 'foo', y: 42, z: '고구마'};
  let obj2 = {x: 'bar', y: 43, z: '고사리'};
  let obj3 = {x: 'qux', y: 44, z: '고라니'};
  let arr1 = [obj1, obj2, obj3];
  let narrowed = lost.list.narrow(arr1, ['x','y']);
  console.log(JSON.stringify(narrowed));
    // [
    // {"x":"foo","y":42},
    // {"x":"bar","y":43},
    // {"x":"qux","y":44}
    // ]
})();

(function () {
  console.log('-- list.relate');
  let obj11 = {x: 'foo', y: 42, z: '고구마'};
  let obj12 = {x: 'bar', y: 43, z: '고사리'};
  let obj13 = {x: 'qux', y: 44, z: '고라니'};
  let arr1 = [obj11, obj12, obj13];
  let obj21 = {x: 'foo', y: 142, z: '고도리'};
  let obj22 = {x: 'bar', y: 143, z: '고드름'};
  let obj23 = {x: 'qux', y: 144, z: '고양이'};
  let arr2 = [obj21, obj22, obj23];
  lost.list.relate(arr1, arr2, 'rel', ['x']);
  console.log(JSON.stringify(arr1));
    // [
    // {"x":"foo","y":42,"z":"고구마","rel":[{"x":"foo","y":142,"z":"고도리"}]},
    // {"x":"bar","y":43,"z":"고사리","rel":[{"x":"bar","y":143,"z":"고드름"}]},
    // {"x":"qux","y":44,"z":"고라니","rel":[{"x":"qux","y":144,"z":"고양이"}]}
    // ]
})();

(function () {
  console.log('-- list.hire');
  let obj11 = {x: 'foo', y: 42};
  let obj12 = {x: 'bar', y: 43};
  let obj13 = {x: 'qux', y: 44};
  let arr1 = [obj11, obj12, obj13];
  let obj21 = {x: 'foo', y: 42, z: '고구마'};
  let obj22 = {x: 'bar', y: 43, z: '고사리'};
  let obj23 = {x: 'qux', y: 44, z: '고라니'};
  let arr2 = [obj21, obj22, obj23];
  lost.list.hire(arr1, arr2, ['z'], ['x','y']);
  console.log(JSON.stringify(arr1));
    // [
    // {"x":"foo","y":42,"z":"고구마"},
    // {"x":"bar","y":43,"z":"고사리"},
    // {"x":"qux","y":44,"z":"고라니"}
    // ]
})();

(function () {
  console.log('-- list.sort (1)');
  let obj1 = {x: 'foo', y: 42, z: '고구마'};
  let obj2 = {x: 'bar', y: 123, z: '고사리'};
  let obj3 = {x: 'qux', y: 24, z: '고라니'};
  let arr1 = [obj1, obj2, obj3];
  lost.list.sort_v1(arr1, ['x']);
  console.log(JSON.stringify(arr1));
    // [
    // {"x":"bar","y":123,"z":"고사리"},
    // {"x":"foo","y":42,"z":"고구마"},
    // {"x":"qux","y":24,"z":"고라니"}
    // ]
  arr1 = [obj1, obj2, obj3];
  lost.list.sort_v1(arr1, ['y']);
  console.log(JSON.stringify(arr1));
    // [
    // {"x":"qux","y":24,"z":"고라니"},
    // {"x":"foo","y":42,"z":"고구마"},
    // {"x":"bar","y":123,"z":"고사리"}
    // ]
})();

(function () {
  console.log('-- list.sort (2)');
  let obj1 = {x: 'foo', y: '42', z: '고구마'};
  let obj2 = {x: 'bar', y: '123', z: '고사리'};
  let obj3 = {x: 'qux', y: '24', z: '고라니'};
  let arr1 = [obj1, obj2, obj3];
  let arr2 = lost.list.sort(arr1, (e1, e2) => (
  	e1.x > e2.x ? 1 : // ascending
  	e1.x < e2.x ? -1 :
  	e1.y > e2.y ? -1 : // descending
  	e1.y < e2.y ? 1 :
  	0
  ));
  console.log(JSON.stringify(arr2));
    // [
    // {"x":"bar","y":"123","z":"고사리"},
    // {"x":"foo","y":"42","z":"고구마"},
    // {"x":"qux","y":"24","z":"고라니"}
    // ]
  arr2 = lost.list.sort(arr1, ['~x']); // descending
  console.log(JSON.stringify(arr2));
    // [
    // {"x":"qux","y":"24","z":"고라니"},
    // {"x":"foo","y":"42","z":"고구마"},
    // {"x":"bar","y":"123","z":"고사리"}
    // ]
  arr2 = lost.list.sort(arr1, ['y']);
  console.log(JSON.stringify(arr2));
    // [
    // {"x":"bar","y":"123","z":"고사리"},
    // {"x":"qux","y":"24","z":"고라니"},
    // {"x":"foo","y":"42","z":"고구마"}
    // ]
  arr2 = lost.list.sort(arr1, ['~y']); // descending
  console.log(JSON.stringify(arr2));
    // [
    // {"x":"foo","y":"42","z":"고구마"},
    // {"x":"qux","y":"24","z":"고라니"},
    // {"x":"bar","y":"123","z":"고사리"}
    // ]
  arr2 = lost.list.sort(arr1, ['#y']); // asNumber
  console.log(JSON.stringify(arr2));
    // [
    // {"x":"qux","y":"24","z":"고라니"},
    // {"x":"foo","y":"42","z":"고구마"},
    // {"x":"bar","y":"123","z":"고사리"}
    // ]
  arr2 = lost.list.sort(arr1, ['#~y']); // asNumber descending
  console.log(JSON.stringify(arr2));
    // [
    // {"x":"bar","y":"123","z":"고사리"}
    // {"x":"foo","y":"42","z":"고구마"},
    // {"x":"qux","y":"24","z":"고라니"},
    // ]
})();

(function () {
  console.log('-- list.unique');
  let obj1 = {x: 'foo', y: 42, z: '고구마'};
  let obj2 = {x: 'foo', y: 43, z: '고사리'};
  let obj3 = {x: 'foo', y: 44, z: '고구마'};
  let arr1 = [obj1, obj2, obj3];
  arr1 = lost.list.unique(arr1, ['x','z']);
  console.log(JSON.stringify(arr1));
    // [
    // {"x":"foo","y":42,"z":"고구마"},
    // {"x":"foo","y":43,"z":"고사리"}
    // ]
})();

(function () {
  console.log('-- list.zip');
  let obj1 = {x: 'foo'};
  let obj2 = {x: 'bar'};
  let obj3 = {x: 'qux'};
  let arr1 = [obj1, obj2, obj3];
  obj1 = {y: 42};
  obj2 = {y: 43};
  obj3 = {y: 44};
  let arr2 = [obj1,obj2,obj3];
  obj1 = {z: '고구마'};
  obj2 = {z: '고사리'};
  obj3 = {z: '고라니'};
  let arr3 = [obj1,obj2,obj3];
  let zipped = lost.list.zip(arr1, arr2, arr3);
  console.log(JSON.stringify(zipped));
    // [
    // [{"x":"foo"},{"y":42},{"z":"고구마"}],
    // [{"x":"bar"},{"y":43},{"z":"고사리"}],
    // [{"x":"qux"},{"y":44},{"z":"고라니"}]
    // ]
})();

(function () {
  console.log('-- list.subgroup');
  let arr1 = ['foo',42,'고구마','bar',43,'고사리','qux',44,'고라니'];
  arr1 = lost.list.subgroup(arr1, ['x','y','z']);
  console.log(JSON.stringify(arr1));
    // [
    // {"x":"foo","y":42,"z":"고구마"},
    // {"x":"bar","y":43,"z":"고사리"},
    // {"x":"qux","y":44,"z":"고라니"}
    // ]
})();

(function () {
  console.log('-- biz.subgroup');
  let obj1 = {
    'CHAR004':'foo','CHAR005':42,'CHAR006':'고구마',
    'CHAR007':'bar','CHAR008':43,'CHAR009':'고사리',
    'CHAR010':'qux','CHAR011':44,'CHAR012':'고라니'
  };
  let arr1 = lost.biz.subgroup(obj1, ['x','y','z'], 4, 12, 'CHAR___');
  console.log(JSON.stringify(arr1));
    // [
    // {"x":"foo","y":42,"z":"고구마"},
    // {"x":"bar","y":43,"z":"고사리"},
    // {"x":"qux","y":44,"z":"고라니"}
    // ]
})();

(function () {
  console.log('-- string.sformat');
  let tmpl = `
::#foo#::#bar#::#foo#::
`.trim();
  let obj1 = {foo:'foo',bar:() => 42};
  let s = lost.string.sformat(tmpl, obj1);
  console.log(JSON.stringify(s));
    // "::foo::42::foo::"
})();

(function () {
  console.log('-- string.lpad');
  let s;
  s = lost.string.lpad('foo', 5, '_');
  console.log(JSON.stringify(s));      // "__foo"
  
  console.log('-- string.rpad');
  s = lost.string.rpad('foo', 5, '_');
  console.log(JSON.stringify(s));      // "foo__"
})();

(function () {
  console.log('-- date');

  let s;
  s = lost.date.formal('20211026');
  console.log(JSON.stringify(s));   // "2021-10-26"
  s = lost.date.imformal('2021-10-26');
  console.log(JSON.stringify(s));   // "20211026"

  s = lost.date.today.display('yyyy-mm-dd');
  console.log(JSON.stringify(s));   // "2021-10-27"
  s = lost.date.now().display('hh:mi:ss');
  console.log(JSON.stringify(s));   // "20:18:47"
  let dt = lost.date.today.addYear(1).addMonth(-2).addDate(3).asDate();
  s = lost.date.format(dt, 'yyyy-mm-dd hh:mi:ss.SSS');
  console.log(JSON.stringify(s));   // "2022-08-30 20:18:47.692"
})();

(function () {
  console.log('--number');

  let s;
  s = lost.number.format(0);
  console.log(JSON.stringify(s));   // ""
  s = lost.number.format('', '0');
  console.log(JSON.stringify(s));   // "0"
  s = lost.number.format(12);
  console.log(JSON.stringify(s));   // "12"
  s = lost.number.format(12.34);
  console.log(JSON.stringify(s));   // "12.34"
  s = lost.number.format(1234567.89);
  console.log(JSON.stringify(s));   // "1,234,567.89"
  s = lost.number.format(-1234.567);
  console.log(JSON.stringify(s));   // "-1,234.567"

  let n = lost.number.parse('1,234,567.89');
  console.log(JSON.stringify(n));   // 1234567.89
})();

(function () {
  console.log('--util.unv');

  let res = lost.util.unv(undefined, null, 0, '', 42);
  console.log(JSON.stringify(res));   // 42
})();
