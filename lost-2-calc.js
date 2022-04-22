
(function () {

class MaybeNumber {
    constructor(sign, number, decimalPoint) {
        lost.mixin(this, {sign, number, decimalPoint});
    }
    static from(x) {
        let s = String(lost.number(x));
        let parts = s.split('-');
        const sign = parts.length === 2 ? -1 : 1;
        s = parts[parts.length - 1];
        parts = s.split('.');
        const decimalPoint = parts.length == 2 ? parts[1].length : 0;
        const number = Number(parts.join(''));
        return new MaybeNumber(sign, Math.abs(number), decimalPoint);
    }
    add(that) {
        const decimalPoint = lost.max(this.decimalPoint, that.decimalPoint);
        const n1 = this.sign * this.number * Math.pow(10, decimalPoint - this.decimalPoint);
        const n2 = that.sign * that.number * Math.pow(10, decimalPoint - that.decimalPoint);
        const number = n1 + n2;
        const sign = number < 0 ? -1 : 1;
        return new MaybeNumber(sign, Math.abs(number), decimalPoint);
    }
    subtract(that) {
        const decimalPoint = lost.max(this.decimalPoint, that.decimalPoint);
        const n1 = this.sign * this.number * Math.pow(10, decimalPoint - this.decimalPoint);
        const n2 = that.sign * that.number * Math.pow(10, decimalPoint - that.decimalPoint);
        const number = n1 - n2;
        const sign = number < 0 ? -1 : 1;
        return new MaybeNumber(sign, Math.abs(number), decimalPoint);
    }
    multiply(that) {
        const decimalPoint = this.decimalPoint + that.decimalPoint;
        const n1 = this.sign * this.number;
        const n2 = that.sign * that.number;
        const number = n1 * n2;
        const sign = number < 0 ? -1 : 1;
        return new MaybeNumber(sign, Math.abs(number), decimalPoint);
    }
    divide(that) {
        const n1 = this.sign * this.number;
        const n2 = that.sign * that.number;
        if (n2 == 0) throw 'DivideByZero';
        const number = n1 / n2;
        let decimalPoint = 0;
        if (that.decimalPoint < this.decimalPoint) {
            const decimalPoint = this.decimalPoint - that.decimalPoint;
            const x = MaybeNumber.from(number);
            return new MaybeNumber(x.sign, x.number, x.decimalPoint + decimalPoint);
        } else if (this.decimalPoint < that.decimalPoint) {
            const decimalPoint = that.decimalPoint - this.decimalPoint;
            const mag = MaybeNumber.from(Math.pow(10, decimalPoint));
            return MaybeNumber.from(number).multiply(mag)
        } else {
            return MaybeNumber.from(number);
        }
    }
    eq(that) {
        //
    }
    gt(that) {
        //
    }
    lt(that) {
        //
    }
    value() {
        let s = String(this.number);
        if (this.decimalPoint) {
            if (s.length <= this.decimalPoint) {
                s = s.padStart(this.decimalPoint + 1, '0');
            }
            const splitPos = s.length - this.decimalPoint;
            s = s.slice(0, splitPos) + '.' + s.slice(splitPos);
        }
        return this.sign * Number(s);
    }
    stringify(opt) {
        const n = this.value();
        return lost.n2s(n, opt);
    }
}

function CrudeCalc() {
    if (!(this instanceof CrudeCalc)) {
        return new CrudeCalc();
    }
}
CrudeCalc.prototype = {
    number(x) {
        this.x = MaybeNumber.from(x);
        return this;
    },
    add(n) {
        this.x = this.x.add(MaybeNumber.from(n))
        return this;
    },
    subtract(n) {
        this.x = this.x.subtract(MaybeNumber.from(n))
        return this;
    },
    multiply(n) {
        this.x = this.x.multiply(MaybeNumber.from(n))
        return this;
    },
    divide(n) {
        this.x = this.x.divide(MaybeNumber.from(n))
        return this;
    },
    value() {
        return this.x.value();
    },
    stringify() {
        return this.x.stringify({zero: '0'});
    },
};

console.assert(CrudeCalc().number('4.5').value() === 4.5);
console.assert(CrudeCalc().number('0.03').value() === 0.03);

console.assert(CrudeCalc().number('4.5').add('0.03').value() === 4.53);
console.assert(CrudeCalc().number('4.5').subtract('0.03').value() === 4.47);
console.assert(CrudeCalc().number('4.5').multiply('0.03').value() === 0.135);
console.assert(CrudeCalc().number('4.5').divide('0.03').value() === 150);

console.assert(CrudeCalc().number('0.03').add('4.5').value() === 4.53);
console.assert(CrudeCalc().number('0.03').subtract('4.5').value() === -4.47);
console.assert(CrudeCalc().number('0.03').multiply('4.5').value() === 0.135);
console.assert(CrudeCalc().number('0.03').divide('4.5').value() === 0.006666666666666667);

console.assert(CrudeCalc().number('4.5').add('0.3').value() === 4.8);
console.assert(CrudeCalc().number('4.5').subtract('0.3').value() === 4.2);
console.assert(CrudeCalc().number('4.5').multiply('0.3').value() === 1.35);
console.assert(CrudeCalc().number('4.5').divide('0.3').value() === 15);

console.assert(CrudeCalc().number('0.3').add('4.5').value() === 4.8);
console.assert(CrudeCalc().number('0.3').subtract('4.5').value() === -4.2);
console.assert(CrudeCalc().number('0.3').multiply('4.5').value() === 1.35);
console.assert(CrudeCalc().number('0.3').divide('4.5').value() == 0.06666666666666667);

console.assert(CrudeCalc().number('4.5').add('3').value() === 7.5);
console.assert(CrudeCalc().number('4.5').subtract('3').value() === 1.5);
console.assert(CrudeCalc().number('4.5').multiply('3').value() === 13.5);
console.assert(CrudeCalc().number('4.5').divide('3').value() === 1.5);

console.assert(CrudeCalc().number('3').add('4.5').value() === 7.5);
console.assert(CrudeCalc().number('3').subtract('4.5').value() === -1.5);
console.assert(CrudeCalc().number('3').multiply('4.5').value() === 13.5);
console.assert(CrudeCalc().number('3').divide('4.5').value() === 0.6666666666666667);

console.assert(CrudeCalc().number('0.0045').multiply('100').value() === 0.45);
console.assert(CrudeCalc().number('0.0045').multiply('10').value() === 0.045);
console.assert(CrudeCalc().number('0.0045').multiply('1').value() === 0.0045);
console.assert(CrudeCalc().number('0.0045').multiply('0').value() === 0);
console.assert(CrudeCalc().number('0.0045').multiply('0.1').value() === 0.00045);
console.assert(CrudeCalc().number('0.0045').multiply('0.01').value() === 0.000045);
console.assert(CrudeCalc().number('0.0045').divide('100').value() === 0.000045);
console.assert(CrudeCalc().number('0.0045').divide('10').value() === 0.00045);
console.assert(CrudeCalc().number('0.0045').divide('1').value() === 0.0045);
console.assert(CrudeCalc().number('0.0045').divide('0.1').value() === 0.045);
console.assert(CrudeCalc().number('0.0045').divide('0.01').value() === 0.45);

})();
