# lost.js

list, object, string, tool

## lost-2.js

- object
  - lost.partial(from, keys)
  - lost.except(from, keys)
  - lost.fromArray(array)
  - lost.toArray(from, mode, keys)
  - lost.deepCopy(x)
  - lost.toString(x)
  - lost.jsonify(x)
  - lost.jsonize(x)
  - lost.values(x, keys)
  - lost.equal(x, y, keys)
  - lost.mixin(dst, ...ingredients)
  - lost.nvo(src, path, dflt) — nested value of
- list
  - lost.array(size)
  - lost.times(n)
  - lost.howToSeek(howto)
  - lost.filter(list, howto) — findAll
  - lost.find(list, howto) — findFirst
  - lost.findLast(list, howto)
  - lost.findIndex(list, howto)
  - lost.findLastIndex(list, howto)
  - lost.sort(list, by)
  - lost.unique(list, keys)
  - lost.group(list, keys)
  - lost.adjacent(list, keys)
  - lost.merge(xlist, ylist, keys)
  - lost.absorb(xlist, ylist, keys, embedKeys) — hire
  - lost.embed(xlist, ylist, keys, embedKey) — relate
  - lost.slim(list, keys) — narrow
  - lost.flat(list)
  - lost.findMax(list, key)
  - lost.findMin(list, key)
  - lost.sum(list, key)
  - lost.zip(list1, list2, ...)
  - lost.zip2(length, list1, list2, ...)
  - lost.groupBy(list, keys, aggregate, initialize)
  - lost.flowDown(outers, inners, keys, worker)
- string
  - lost.s$slice(s, begin, end) : s
  - lost.s$padStart(s, len, c) : s
  - lost.s$padEnd(s, len, c) : s
  - lost.s$repeat(s, n) : s
- date
  - lost.date(s|d) : Date
  - lost.addYear(d, n) : Date
  - lost.addMonth(d, n) : Date
  - lost.addDate(d, n) : Date
  - lost.d2s(d, fmt) : s
  - lost.date2(s|d) : JustDate
    - addYear(n) : JustDate
    - addMonth(n) : JustDate
    - addDate(n) : JustDate
    - it() : Date
    - value() : Date
    - stringify(fmt) : s
  - lost.merely(d) : JustDate
- number
  - lost.max(...nums)
  - lost.min(...nums)
  - lost.number(s|n)
  - lost.n2s(n, opt)
  - lost.number2(s|n) : JustNumber
    - add(n) : JustNumber
    - subtract(n) : JustNumber
    - multiply(n) : JustNumber
    - divide(n) : JustNumber
    - it() : n
    - value() : n
    - stringify(opt) : s
  - lost.merely(n) : JustNumber
- utility
  - lost.unv(...args) — until not void — like nvl

## lost-fp.js

- lang
  - lost._.curry(f, n)
  - lost._.memoize(f)
- object
  - lost._.copyKeys(x, xkeys, y, ykeys)
  - lost._.partial(x, ...keys)
  - lost._.mixin(dst, ...)
- list
  - lost._.findAllBy(...)(list)
  - lost._.findOneBy(...)(list)
  - lost._.head «NY»
  - lost._.tail «NY»
  - lost._.drop «NY»
  - lost._.dropWhile «NY»
  - lost._.take «NY»
  - lost._.takeWhile «NY»
  - lost._.narrowBy(...)(list)
  - lost._.relate(relkey, xlist, xkeys, ylist, ykeys)
  - lost._.relateBy(relkey,xkeys,ykeys)(xlist, ylist) «NY»
  - lost._.hire(keys, xlist, xkeys, ylist, ykeys)
  - lost._.hireBy(keys,xkeys,ykeys)(xlist, ylist) «NY»
  - lost._.zip(list1, list2, ...)
  - lost._.sortBy(...)(list)
  - lost._.uniqueBy(...)(list)
- string
  - lost._.formatS «NY»
  - lost._.reverseS(s)
- date
  - lost._.formatD «NY»
  - lost._.parseD «NY»
- number
  - lost._.formatN «NY»
  - lost._.parseN «NY»

## lost.js

- object
  - lost.object.copyKeys(...)
  - lost.object.mixin(...)
  - lost.object.nvo(...) — nested value of
- list
  - lost.list.filter(list, ...) — findAll
  - lost.list.find(list, cond) — findFirst
  - lost.list.findRight(list, cond) — findLast
  - lost.list.narrow(list, ...)
  - lost.list.relate(list1, ...)
  - lost.list.hire(list1, ...)
  - lost.list.zip(list1, list2, ...)
  - lost.list.sort(list, ...)
  - lost.list.unique(list, ...)
  - lost.list.subgroup(...)
- string
  - lost.string.sformat(tmpl, data)
  - lost.string.lpad(s, len, pad)
  - lost.string.rpad(s, len, pad)
- date
  - lost.date.format(dt, format)
  - lost.date.parse(...) : Date «NY»
  - lost.date.today : XDate
  - lost.date.now(...) : XDate
  - lost.date.fromDate(dt) : XDate «NY»
  - lost.date.XDate
    - display(fmt)
    - asDate( ) : Date
    - addYear(n) : XDate
    - addMonth(n) : XDate
    - addDate(n) : XDate
- number
  - lost.number.format(n, fmt) «NY»
  - lost.number.parse(s) «NY»
- utility
  - lost.util.unv(...) — until not void — like nvl

:wq
