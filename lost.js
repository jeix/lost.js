
(function (ctx) {

	if (ctx.lost) return;
	
	let __lime__ = {};
	
	// fallback for Object.assign()
	function _define(dst, src) {
		if (Object.assign instanceof Function) {
			Object.assign(dst, src);
		} else {
			for (let k in src) {
				if (src.hasOwnProperty(k)) {
					dst[k] = src[k];
				}
			}
		}
	}
	
	////////////////////////////////////////
	// data manipulation
	
	// row가 filter 조건을 만족하는지
	// filter 조건은 다음 중 하나
	// - [[key1,val1], [key2,val2], ...] : 모든 조건 일치 시
	// - 함수
	// - {key1:val1, key2:val2, ...} : 모든 조건 일치 시
	function _applyFilter(row, filters) {
		if (filters instanceof Array) {
			return filters.every((filter) => row[filter[0]] == filter[1]);
		} else if (filters instanceof Function) {
			return filters(row);
		} else if (filters instanceof Object) {
			let keyNames = Object.keys(filters);
			return keyNames.every((keyName) => row[keyName] == filters[keyName]);
		}
	}

	// row에서 keyNames 키들의 값을 찾아 '_'로 연결
	function _keyStrOf_v1(row, keyNames) {
		let keys = [];
		keyNames.forEach((keyName) => {
			keys.push(row[keyName]);
		});
		return keys.join('_');
	}
	function _keyStrOf(row, keyNames) {
		return keyNames.map((keyName) => row[keyName]).join('_');
	}

	// src에서 dst로 프로퍼티 복사.
	// 복사 대상 프로퍼티들은 keyNames
	function _assign(dst, src, keyNames) {
		if (keyNames === undefined) {
			keyNames = Object.keys(src);
		}
		keyNames.forEach((keyName) => {
			dst[keyName] = src[keyName];
		});
		return dst;
	}

	// rows에서 conditions 조건을 만족하는 첫번째 로우를 리턴
	function _find(rows, conditions) {
		let found = rows.find((row) => _applyFilter(row, conditions));
		return found;
	}

	////////////////////////////////////////
	// 오브젝트

	__lime__.object = {};

	_define(__lime__.object, {
		// src에서 dst로 프로퍼티 복사.
		// 모든 프로퍼티를 복사할 경우 keyNames 파라미터는 제외 가능.
		// 모든 프로퍼티를 복사하려면 Object.assign() 을 쓸 것
		copyKeys: function (dst, src, keyNames) {
			return _assign(dst, src, keyNames);
		},
		// mixin
		mixin: function (dst, src) {
			let mixed = dst;
			let ingredients = [].slice.call(arguments);
			ingredients.shift(); // dst는 제외
			ingredients.forEach((additive) => {
				mixed = _assign(mixed, additive);
			});
			return mixed;
		},
		// nested value of
		// src 객체 내부의 path 경로의 값을 찾아 리턴.
		// undefined 를 만나면 dflt 디폴트 값을 리턴.
		// path 경로 구분자는 '/', 배열 인덱스는 [] 없이.
		// 예를 들어 body.Foo.Bar[0].Qux 를 찾는 경우
		// nvo(body, "Foo/Bar/0/Qux", "0")
		nvo: function (src, path, dflt) {
			let x = src,
				y = (path == undefined ? [] : path.split('/')),
				z = (dflt == undefined ? '' : dflt);
			if (x == undefined) {
				return z;
			}
			for (let i in y) {
				x = x[y[i]];
				if (x == undefined) {
					return z;
				}
			}
			return x;
		}
	});

	////////////////////////////////////////
	// 리스트

	__lime__.list = {};

	_define(__lime__.list, {
		// row에서 conditions 조건을 만족하는 로우들을 리턴
		filter: function (rows, conditions) {
			let filtered = rows.filter((row) => _applyFilter(row, conditions));
			return filtered;
		},
		// rows에서 conditions 조건을 만족하는 첫번째 로우를 리턴
		find: function (rows, conditions) {
			return _find(rows, conditions);
		},
		// rows애서 conditions 조건을 만족하는 마지막 로우를 리턴
		findRight: function (rows, conditions) {
			let rowsRev = [];
			rows.forEach((row) => {
				rowsRev.unshift(row);
			});
			return _find(rowsRev, conditions);
		},
		// rows의 각 로우에 대해 keyNames 키들의 값을 dstKeyNames 키로 복사.
		// keyNames 키들과 dstKeyNames 키들이 같으면 dstKeyNames 파라미터는 제외 가능
		narrow: function (rows, keyNames, dstKeyNames) {
			if (dstKeyNames === undefined || dstKeyNames.length !== keyNames.length) {
				dstKeyNames = keyNames;
			}
			let narrowed = rows.map((row) => {
				let copied = {};
				keyNames.forEach((keyName, ix) => {
					copied[dstKeyNames[ix]] = row[keyName];
				});
				return copied;
			});
			return narrowed;
		},
		// xRows의 각 로우에 대해 xKeyNames 키들의 값이
		// yRows의 각 로우에서 yKeyNames 키들의 값과 일치하는
		// 로우를 찾아 dstKeyName 키에 설정.
		// xKeyNames 키들과 yKeyNames 키들이 같으면 yKeyNames 파라미터는 제외 가능
		relate: function (xRows, yRows, dstKeyName, xKeyNames, yKeyNames) {
			if (yKeyNames === undefined || yKeyNames.length !== xKeyNames.length) {
				yKeyNames = xKeyNames;
			}
			let x2y = {};
			yRows.forEach((yRow) => {
				let keyStr = _keyStrOf(yRow, yKeyNames);
				if (keyStr in x2y) {
					x2y[keyStr].push(yRow);
				} else {
					x2y[keyStr] = [yRow];
				}
			});
			xRows.forEach((xRow) => {
				let keyStr = _keyStrOf(xRow, xKeyNames);
				xRow[dstKeyName] = x2y[keyStr] || [];
			});
		},
		// xRows의 각 로우에 대해 xKeyNames 키들의 값이
		// yRows의 각 로우에서 yKeyNames 키들의 값과 일치하는
		// 로우를 찾아 copyKeyNames 키들의 값을 복사.
		// xKeyNames 키들과 yKeyNames 키들이 같으면 yKeyNames 파라미터는 제외 가능
		hire: function (xRows, yRows, copyKeyNames, xKeyNames, yKeyNames) {
			if (yKeyNames === undefined || yKeyNames.length !== xKeyNames.length) {
				yKeyNames = xKeyNames;
			}
			let x2y = {};
			yRows.forEach((yRow) => {
				let keyStr = _keyStrOf(yRow, yKeyNames);
				if (! (keyStr in x2y)) {
					x2y[keyStr] = yRow;
				}
			});
			xRows.forEach((xRow) => {
				let keyStr = _keyStrOf(xRow, xKeyNames);
				let found = x2y[keyStr];
				if (found) {
					_assign(xRow, found, copyKeyNames);
				}
			});
		},
		// rows를 keyNames 키들을 기준으로 정렬.
		sort_v1: function (rows, keyNames, asNumber) {
			function values(_row, _keyNames) {
				let vals = _keyNames.map((_keyName) => _row[_keyName]);
				return vals;
			}
			let sorted = rows.sort((row1, row2) => { // problem -- original itself changed
				let vals1 = values(row1, keyNames);
				let vals2 = values(row2, keyNames);
				for (let ix in keyNames) {
					let val1 = vals1[ix];
					let val2 = vals2[ix];
					if (asNumber) {
						val1 = Number(val1);
						val2 = Number(val2);
					}
					if (val1 > val2) {
						return 1;
					} else if (val1 < val2) {
						return -1;
					}
				}
				return 0;
			});
			return sorted;
		},
		// - arr: array to sort  -- not changed
		// - by : function or (keyNameOpt, ...)
		//   - keyNameOpt: [#][~]keyName
		//     - #: asNumber
		//     - ~: descending
		sort: function (arr, by) {
			if (typeof by === 'function') {
				return arr.slice().sort(by);
			}
			let asNumbers = by.map((k) => (k.includes('#') ? true : false));
			let keyNames = by.map((k) => k.replace(/[#~]/g, ''));
			let orders = by.map((k) => (k.includes('~') ? -1 : 1)); // -1 descending
			function values(_row, _keyNames) {
				return _keyNames.map((_keyName) => _row[_keyName]);
			}
			return arr.slice().sort((e1, e2) => {
				let vals1 = values(e1, keyNames);
				let vals2 = values(e2, keyNames);
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
		},
		// rows를 keyNames 키들을 기준으로 비교해서 중복 제거
		unique_v1: function (rows, keyNames) {
			let uniques = [];
			let uniqueKeyStrs = [];
			rows.forEach((row) => {
				let keyStr = _keyStrOf(row, keyNames);
				let duplicated = uniqueKeyStrs.find((uniqueKeyStr) => keyStr === uniqueKeyStr);
				if (duplicated === undefined) {
					uniques.push(row);
					uniqueKeyStrs.push(keyStr);
				}
			});
			return uniques;
		},
		unique: function (rows, keyNames) {
			let uniques = [];
			let uniqueKeyStrs = [];
			rows.forEach((row) => {
				let keyStr = keyNames.map((keyName) => row[keyName]).join('_');
				if (! uniqueKeyStrs.includes(keyStr)) {
					uniques.push(row);
					uniqueKeyStrs.push(keyStr);
				}
			});
			return uniques;
		},
		// xRows와 yTows 등의 각 로우에 대해
		// 동일한 인덱스에서의
		// xRows의 요소와 yRows의 요소 등으로 이루어진 배열을 구성하고
		// 그런 배열의 배열인 2차원 배열을 리턴.
		// xRows와 yRows 등의 길이가 같아야
		zip: function (xRows, yRows) {
			if (xRows && yRows && xRows.length && xRows.length === yRows.length) {
				//let otherRows = Array.from(arguments);
				let otherRows = [].slice.call(arguments);
				otherRows.shift(); // xRows는 제외
				return xRows.map((xRow, ix) => {
					let zipped = [xRow];
					otherRows.forEach((kRows) => {
						zipped.push(kRows[ix]);
					});
					return zipped;
				});
			} else {
				return [];
			}
		},
		// begin과 end 범위에서
		// linear에서 해당 키의 값을
		// 신규 객체의 keyNames 프로퍼티로 복사.
		// keyNames 프로퍼티들을 다 채우면 신규 객체를 다시 생성
		subgroup: function (linear, keyNames, begin, end) {
			let subgroups = [];
			let n = begin || 0;
			end = end || linear.length;
			if (end > linear.length) {
				end = linear.length;
			}
			while (n < end) {
				let subgroup = {};
				keyNames.forEach((keyName) => {
					subgroup[keyName] = linear[n++];
				});
				if (! subgroup[keyNames[0]]) {
					break;
				}
				subgroups.push(subgroup);
			}
			return subgroups;
		},
	});

	////////////////////////////////////////
	// 비즈

	__lime__.biz = {};

	_define(__lime__.biz, {
		// begin 과 end 범위에서 fmt로 키를 구성해서
		// linear 객체에서 해당 키의 값을
		// 신규 객체의 keyNames 프로퍼티로 복사.
		// keyNames 프로퍼티들을 다 채우면 신규 객체를 다시 생성
		subgroup: function (linear, keyNames, begin, end, fmt) {

			// 계약상세 조회 결과 중 T_SUNJCT_R_LT가
			// T_SUNJCT_R_LT[i].CHAR006이 항목명
			// T_SUNJCT_R_LT[i].CHAR007이 항목값의 짝을 이루고
			// 이러한 패턴이 T_SUNJCT_R_LT[i].CHAR100까지 계속되고 있어
			// 이 데이터를 추출해내기 위해

			let subgroups = [];
			let matched = fmt.match(/(_+)/);
			if (! matched) { // fmt에 '___' 같은 placeholder가 없으면
				return subgroups; // 처리 안 함
			}
			let len = matched[1].length;
			let prefix = fmt.substr(0, matched.index); // '___' 앞의 'CHAR' 부분
			let srcKeyName;
			let subgroup;

			let n = begin;
			while (n < end) {
				subgroup = {};
				keyNames.forEach((keyName) => {
					srcKeyName = prefix + String(n++).padStart(len, '0');
					subgroup[keyName] = linear[srcKeyName];
				});
				if (! subgroup[keyNames[0]]) { // T_SUNJCT_R_LT의 경우 항목명이 없으면
					break; // 더 이상 진행할 필요가 없으므로
				}
				subgroups.push(subgroup);
			}
			return subgroups;
		},
	});

	////////////////////////////////////////
	// 스트링

	__lime__.string = {};

	_define(__lime__.string, {
		// tmpl 문자열에서 data의 프로퍼티 이름으로 된
		// 플레이스홀더(#foo# 형식)를 각 프로퍼티의 값으로 치환
		sformat: function (tmpl, data) {
			let formatted = tmpl;
			Object.keys(data).forEach((key) => {
				let val = data[key];
				if (val instanceof Function) {
					val = val.call(data);
				}
				let re = new RegExp('#'+key+'#', 'g');
				formatted = formatted.replace(re, val);
			});
			return formatted;
		},
		// 문자열 s를 길이 len으로 패딩
		lpad: function (s, len, c) {
			if (typeof(s.padStart) === 'function') {
				return c ? s.padStart(len, c) : s.padStart(len);
			} else {
				c = c || '';
				while (s.length < len) {
					s = c + s;
				}
				return s;
			}
		},
		rpad: function (s, len, c) {
			if (typeof(s.padEnd) === 'function') {
				return c ? s.padEnd(len, c) : s.padEnd(len);
			} else {
				c = c || '';
				while (s.length < len) {
					s = s + c;
				}
				return s;
			}
		},
	});

	////////////////////////////////////////
	// 날짜

	__lime__.date = {};

	_define(__lime__.date, {
		format: function (date) {
			// TODO
		},
		parse: function (s) {
			// TODO
		},
		// 날짜 문자열 포맷 변환 (YYYY-MM-DD)
		// date 날짜 문자열 (YYYYMMDD 포맷)
		formal: function (date) {
			let re = /(\d{4})(\d{2})(\d{2})/g;
			/*
			let result = re.exec(date);
			if (result) {
				return result[1] + '-' + result[2] + '-' + result[3];
			}
			return date;
			//*/
			return date.replace(re, "$1-$2-$3");
		},
		// 날짜 문자열 포맷 변환 (YYYYMMDD)
		// date 날짜 문자열 (YYYY-MM-DD 포맷)
		imformal: function (date) {
			return date.replace(/-/g, '');
		}
	});

	let datex = (function () {
		
		// 날짜 유틸리티
		class XDate {
			// dt 날짜 Date 인스턴스
			constructor(dt) {
				this.dt = dt || new Date();
			}
			yyyy() {
				return '' + this.dt.getFullYear();
			}
			mm() {
				let m = this.dt.getMonth() + 1;
				return (m < 10 ? '0' : '') + m;
			}
			dd() {
				let d = this.dt.getDate();
				return (d < 10 ? '0' : '') + d;
			}
			hh() {
				let h = this.dt.getHours();
				return (h < 10 ? '0' : '') + h;
			}
			mi() {
				let m = this.dt.getMinutes();
				return (m < 10 ? '0' : '') + m;
			}
			ss() {
				let s = this.dt.getSeconds();
				return (s < 10 ? '0' : '') + s;
			}
			ms() {
				let ms = this.dt.getMilliseconds();
				return (ms < 10 ? '00' : ms < 100 ? '0' : '') + ms;
			}
			timestamp() {
				return this.dt.getTime();
			}
			// format 표시할 포맷의 문자열
			display(format) {
				let s = format || 'yyyymmdd';
				s = s.replace('yyyy', this.yyyy());
				s = s.replace('mm', this.mm());
				s = s.replace('dd', this.dd());
				s = s.replace('hh', this.hh());
				s = s.replace('mi', this.mi());
				s = s.replace('ss', this.ss());
				s = s.replace('SSS', this.ms());
				return s;
			}
			// Date 인스턴스
			asDate() {
				let dt = new Date();
				dt.setTime(this.timestamp());
				return dt;
			}
			// delta 년을 더한다
			addYear(delta) {
				let dt = this.asDate();
				dt.setFullYear(dt.getFullYear() + delta);
				return new XDate(dt);
			}
			// delta 월을 더한다
			addMonth(delta) {
				let dt = this.asDate();
				dt.setMonth(dt.getMonth() + delta);
				return new XDate(dt);
			}
			// delta 일을 더한다
			addDate(delta) {
				let dt = this.asDate();
				dt.setDate(dt.getDate() + delta);
				return new XDate(dt);
			}
		}
		return {
			// 오늘 날짜
			today: (function () {
				let dt = new Date();
				return new XDate(dt);
			})(),
			// 현재 시각
			now: function () {
				let dt = new Date();
				return new XDate(dt);
			},
			// 날짜 포맷 변환
			// dt 날짜 Date 인스턴스
			format: function (dt, format) {
				return new XDate(dt).display(format);
			},
		}
	})();

	_define(__lime__.date, datex);

	////////////////////////////////////////
	// 숫자
	
	__lime__.number = {};

	_define(__lime__.number, {
		// 숫자 n을 변환해서 천단위마다 쉼표.
		// (빈 문자열도 0으로 변환)
		// 변환된 값이 0이면 빈 문자열 또는 zero 파라미터 존재 시 zero
		format: function (n, zero) {
			/*
			if (n === '') {
				return n;
			}
			//*/
			let _n = Number(n || '');
			if (_n === 0) {
				return typeof(zero) !== 'undefined' ? zero : '';
			}
			if (isNaN(_n)) {
				return n;
			}
			let s = String(_n);
			let sign = '';
			let decimal = '';
			if (_n < 0) {
				sign = '-';
				s = s.slice(1);
			}
			let pointOffset = s.indexOf('.');
			if (pointOffset > 0) {
				decimal = s.slice(pointOffset);
				s = s.slice(0, pointOffset);
			}
			let acc = [].reduceRight.call(s, (acc, c, ix) => {
				acc.unshift(c);
				let jx = s.length - ix;
				if (jx % 3 === 0) {
					acc.unshift(',');
				}
				return acc;
			}, []);
			if (acc[0] === ',') {
				acc = acc.slice(1);
			}
			return sign + acc.join('') + decimal;
		},
		// 숫자 문자열 s를 숫자로 변환
		parse: function (s) {
			s = s || '';
			s = s.replace(/,/g, '');
			let n = Number(s);
			return n;
		},
	});
	
	////////////////////////////////////////
	// 유틸리티

	__lime__.util = {};

	_define(__lime__.util, {
		// until not void
		unv: function (...args) {
			//let args = [].slice.call(arguments);
			return args.find((arg) => !!arg);
		},
	});

	////////////////////////////////////////
	
	ctx.lost = __lime__;

})(window);
