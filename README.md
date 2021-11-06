# lost.js

list, object, string, tool

## lost.js

- object
  - lost.object.copyKeys(...)
  - lost.object.mixin(...)
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

:wq
