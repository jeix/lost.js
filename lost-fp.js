
(function (ctx) {

	let __lime__ = ctx.lost || {};

	if (__lime__._) return;
	
	let __ns__ = {};
	
	////////////////////////////////////////
	// lang

	const curry_v1 = (f,n) => {
		const _oof = new Array(n || f.length);
		const _inf = [];
		const _curry = (...args) => {
			while (_oof.length > 0 && args.length > 0) {
				_oof.shift();
				_inf.push(args.shift());
			}
			if (_oof.length === 0) {
				return f.apply(null, _inf);
			} else {
				return _curry;
			}
		};
		return _curry;
	};

	const curry = (f,n) => {
		const _oof = new Array(n || f.length);
		const _inf = [];
		const _curry = (_oof=[], _inf=[]) => {
			return (...args) => {
				const oof = [].concat(_oof);
				const inf = [].concat(_inf);
				while (oof.length > 0 && args.length > 0) {
					oof.shift();
					inf.push(args.shift());
				}
				if (oof.length === 0) {
					return f(...inf);
				} else {
					return _curry(oof, inf);
				}
			};
		};
		return _curry(_oof);
	};

	const memoize = (f) => {
		const _buf = {};
		const _memoize = (...args) => {
			if (args in _buf) {
				return _buf[args];
			} else {
				const v = f.apply(null, args);
				_buf[args] = v;
				return v;
			}
		};
		_memoize.f = f;
		return _memoize;
	};

	Object.assign(__ns__, {
		curry_v1,
		curry,
		memoize,
	});

	////////////////////////////////////////
	// 오브젝트

	const copyKeys = (x, xkeys, y, ykeys) => {
		if (ykeys == undefined) {
			ykeys = xkeys;
		}
		const keyPairs = zip(xkeys, ykeys);
		keyPairs.forEach((keyPair) => {
			y[keyPair[1]] = x[keyPair[0]];
		});
		return y;
	};

	const partial = (x, ...keys) => {
		if (keys.length === 0) {
			keys = Object.keys(x);
		} else if (keys[0] instanceof Array) {
			keys = keys[0];
		}
		return copyKeys(x, keys, {});
	};

	const mixin = (dst, ...ingredients) => {
		let mixed = dst;
		ingredients.forEach((additive) => {
			Object.assign(mixed, additive);
		});
		return mixed;
	};

	// TODO rename
	const contain = (x, sub) => {
		const subkeys = Object.keys(sub);
		return subkeys.every((k) => (k in x && x[k] === sub[k]));
	};

	Object.assign(__ns__, {
		copyKeys,
		partial,
		mixin,
		contain,
	});

	////////////////////////////////////////
	// 리스트

	const find = (list, seek) => {
		return list.find((item) => {
			for (const key in seek) {
				if (! key in item || item[key] !== seek[key]) {
					return false;
				}
			}
			return true;
		});
	};

	const findOneBy = (...args) => {
		if (args.length === 0) {
			return (list) => list[0];
		} else if (typeof args[0] === 'function') {
			let f = args[0];
			return (list) => list.find(f);
		}
		if (args[0] instanceof Array) {
			args = args[0];
		}
		let seeks;
		if (args.length === 1) {
			seek = args[0];
		} else {
			seek = {};
			while (args.length > 1) {
				const k = args.shift();
				const v = args.shift();
				seek[k] = v;
			}
		}
		return (list) => list.find((item) => contain(item, seek));
	};

	const findAllBy = (...args) => {
		if (args.length === 0) {
			return (list) => list.slice();
		} else if (typeof args[0] === 'function') {
			let f = args[0];
			return (list) => list.filter(f);
		}
		if (args[0] instanceof Array) {
			args = args[0];
		}
		let seeks;
		if (args.length === 1) {
			seek = args[0];
		} else {
			seek = {};
			while (args.length > 1) {
				const k = args.shift();
				const v = args.shift();
				seek[k] = v;
			}
		}
		return (list) => list.filter((item) => contain(item, seek));
	};;

	const narrowBy = (...args) => {
		if (args. length == 0) {
			return (list) => list.slice();
		} else if (typeof args[0] === 'function') {
			let f = args[0];
			return (list) => list.map(f);
		} else {
			const narrow = (origin) => {
				let derived = {};
				for (keyName of args) {
					if (keyName in origin) {
						derived[keyName] = origin[keyName];
					}
				}
				return derived;
			};
			return (list) => list.map(narrow);
		}
	};

	const relate = (relkey, xlist, xkeys, ylist, ykeys) => {
		if (ykeys == undefined) {
			ykeys = xkeys;
		}
		return xlist.map((x) => {
			x = {...x};
			const seek = copyKeys(x, xkeys, {}, ykeys);
			const y = find(ylist, seek);
			if (y) {
				x[relkey] = y;
			}
			return x;
		});
	};
	
	const hire = (keys, xlist, xkeys, ylist, ykeys) => {
		if (ykeys == undefined) {
			ykeys = xkeys;
		}
		return xlist.map((x) => {
			x = {...x};
			const seek = copyKeys(x, xkeys, {}, ykeys);
			const y = find(ylist, seek);
			if (y) {
				x = copyKeys(y, keys, x);
			}
			return x;
		});
	};

	// 정렬 방법을 입력받아 정렬 함수를 리턴
	const sortBy = (...args) => {
		if (args. length == 0) {
			return (list) => list.slice().sort();
		} else if (typeof args[0] === 'function') {
			let f = args[0];
			return (list) => list.slice().sort(f);
		} else {
			const compare = (item1, item2) => {
				for (keyName of args) {
					let val1 = item1[keyName];
					let val2 = item2[keyName];
					if (typeof val1 === 'function') {
						val1 = val1.call(item1);
					}
					if (typeof val2 === 'function') {
						val2 = val2.call(item2);
					}
					if (val1 > val2) {
						return 1;
					} else if (val1 < val2) {
						return -1;
					}
				}
				return 0;
			};
			return (list) => {
				list= list.slice();
				list.sort(compare);
				return list;
			};
		}
	};

	const uniqueBy = (...args) => {
		if (args.length === 0) {
			return (list) => list.slice();
		} else if (typeof args[0] === 'function') {
			let f = args[0];
			return (list) => {
				let ulist = [];
				list.forEach((item) => {
					const seek = f(item);
					const uitem = find(ulist, seek);
					if (! uitem) {
						ulist.push(item);
					}
				});
				return ulist;
			};
		} else {
			if (args[0] instanceof Array) {
				args = args[0];
			}
			return (list) => {
				let ulist = [];
				list.forEach((item) => {
					const seek = partial(item, args);
					const uitem = find(ulist, seek);
					if (! uitem) {
						ulist.push(item);
					}
				});
				return ulist;
			};
		}
	};

	const zip = (...lists) => {
		if (lists.length === 0) {
			return [];
		}
		let zlist = lists.shift().map((x) => [x]);
		for (let alist of lists) {
			if (alist.length < zlist.length) {
				return zlist;
			}
		}
		for (let alist of lists) {
			zlist = zlist.map((z,i) => [...z, alist[i]]);
		}
		return zlist;
	};

	Object.assign(__ns__, {
		find,
		findOneBy,
		findAllBy,
		narrowBy,
		relate,
		hire,
		sortBy,
		uniqueBy,
		zip,
	});

	////////////////////////////////////////
	// 스트링

	// 문자열의 방향을 바꾸는 것이 실제로 쓰일 일이 있을지 의문이다
	const reverseS = (s) => s.split('').reverse().join('');

	Object.assign(__ns__, {
		reverseS,
	});

	////////////////////////////////////////
	// 날짜

	const formatD = (date) => {
		// TODO
		console.log('<<TODO>>');
	};

	const parseD = (s) => {
		// TODO
		console.log('<<TODO>>');
	};

	Object.assign(__ns__, {
		formatD,
		parseD,
	});

	////////////////////////////////////////
	// 숫자

	const formatN = (number) => {
		// TODO
		console.log('<<TODO>>');
	};

	const parseN = (s) => {
		// TODO
		console.log('<<TODO>>');
	};

	Object.assign(__ns__, {
		formatN,
		parseN,
	});

	////////////////////////////////////////
	
	__lime__._ = __ns__;

	ctx.lost = __lime__;

})(window);
