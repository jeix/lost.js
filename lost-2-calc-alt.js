
// require lost-2.js

(function () {

// 숫자 연산
function numCalc(op, lhs, rhs) {
    var iof; // int-o-fraction
    iof = String(lhs).split('.'); // 정수부와 소수부를 분리
    var lhsDecPlc = iof.length > 1 ? iof[1] : ''; // lhs 소수점 아래
    iof = String(rhs).split('.'); // 정수부와 소수부를 분리
    var rhsDecPlc = iof.length > 1 ? iof[1] : ''; // rhs 소수점 아래
    var lhsScale = Math.pow(10, lhsDecPlc.length);
    var rhsScale = Math.pow(10, rhsDecPlc.length);
    var scale = 1;
    var result;
    switch (op) {
        case '+':
            scale = lost.max(lhsScale, rhsScale);
            result = (lhs * scale + rhs * scale) / scale;
            break;
        case '-':
            scale = lost.max(lhsScale, rhsScale);
            result = (lhs * scale - rhs * scale) / scale;
            break;
        case '*':
            result = (lhs * lhsScale) * (rhs * rhsScale) / (lhsScale *  rhsScale);
            break;
        case '/':
            result = (lhs * lhsScale) / (rhs * rhsScale) * rhsScale / lhsScale;
            break;
        default:
            throw Error('UnsupportedOperation');
    }
    return result;
}

// 반올림
// - decPlcLen : 유지할 소수점 아래 자리수
function round(n, decPlcLen) {
    var sign = n < 0 ? -1 : 1;
    n = Math.abs(n);
    decPlcLen = decPlcLen || 0;
    var scale = Math.pow(10, decPlcLen);
    n = Math.round(n * scale) / scale;
    return n * sign;
}

function print(...args) {
    //args = args.map((x) => JSON.stringify(x));
    console.log.apply(null, args);
}

const assert = console.assert;

assert(numCalc('+', 40, 2) == 42);
assert(numCalc('+', 40.234, 2.123) == 42.357); console.assert(numCalc('+', 240.5, 50) == 290.5);

assert(numCalc('-', 40, 2) == 38);
assert(numCalc('-', 40.234, 2.123) == 38.111);
assert(numCalc('-', 240.5, 50) == 190.5);

assert(numCalc('*', 40, 2) == 80);
assert(numCalc('*', 12, 2.5) == 30);
assert(numCalc('*', 12.2, 2.3) == 28.06);
assert(numCalc('*', 0.04, 0.2) == 0.008);
assert(numCalc('*', 0.24, 0.04) == 0.0096);

assert(numCalc('/', 40, 2) == 20);
assert(numCalc('/', 12, 2.5) == 4.8);
assert(numCalc('/', 12.25, 2.5) == 4.9);
assert(numCalc('/', 0.04, 0.2) == 0.2);
assert(numCalc('/', 0.24, 0.04) == 6);

assert(round(42.357) == 42);
assert(round(42.357, 1) == 42.4);
assert(round(-42.347, 1) == -42.3);
assert(round(-42.357, 1) == -42.4);

print('0.1 + 0.2 =', numCalc('+', 0.1, 0.2));
print('0.11 - 0.1 =', numCalc('-', 0.11, 0.1));
print('0.1 * 1.1 =', numCalc('*', 0.1, 1.1));
print('0.3 / 3 =', numCalc('/', 0.3, 3));
print('3.3 / 0.33 =', numCalc('/', 3.3, 0.33));

})();
