/*!
 * damping-tween
 * https://github.com/yomotsu/damping-tween
 * (c) 2020 @yomotsu
 * Released under the MIT License.
 */
const FPS_60 = 1 / 0.016;
class DampingTween {
    constructor(values, dampingFactor = 0.1) {
        this.active = false;
        this.dampingFactor = dampingFactor;
        const _values = isNumber(values) ? { value: values } : Object.keys(values).reduce((__values, key) => {
            if (!isNumber(values[key]))
                return __values;
            __values[key] = values[key];
            return __values;
        }, {});
        this._keys = Object.keys(_values);
        this._currentValues = Object.assign({}, _values);
        this._endValues = Object.assign({}, _values);
        this._deltaValues = this._keys.reduce((__values, key) => {
            __values[key] = 0;
            return __values;
        }, {});
    }
    get values() {
        return Object.assign({}, this._currentValues);
    }
    get endValues() {
        return Object.assign({}, this._endValues);
    }
    get value() {
        return this._currentValues[this._keys[0]];
    }
    get endValue() {
        return this._endValues[this._keys[0]];
    }
    setValues(values, immediate = false) {
        this._keys.forEach((key) => this.setValueByKey(key, values[key], immediate));
    }
    setValue(value, immediate = false) {
        this.setValueByKey(this._keys[0], value, immediate);
    }
    setValueByKey(key, value, immediate = false) {
        if (!isNumber(this._endValues[key]))
            return;
        if (approxEquals(value, this._endValues[key]))
            return;
        if (immediate && value === this._currentValues[key] && value === this._endValues[key])
            return;
        this._endValues[key] = value;
        if (immediate) {
            this._currentValues[key] = value;
        }
        this.active = true;
    }
    stop() {
        this.setValues(this._currentValues, true);
    }
    update(delta) {
        const shouldUpdate = this.active;
        const lerpRatio = 1.0 - Math.exp(-this.dampingFactor * delta * FPS_60);
        this._keys.forEach((key) => this._deltaValues[key] = this._endValues[key] - this._currentValues[key]);
        const needsUpdate = this._keys.some((key) => !approxZero(this._deltaValues[key]));
        if (needsUpdate) {
            this._keys.forEach((key) => {
                this._currentValues[key] += this._deltaValues[key] * lerpRatio;
            });
            this.active = true;
        }
        else {
            Object.assign(this._currentValues, this._endValues);
            this.active = false;
        }
        return shouldUpdate;
    }
}
function isNumber(value) {
    return (typeof value === 'number') && (isFinite(value));
}
const EPSILON = 1e-5;
function approxZero(number) {
    return Math.abs(number) < EPSILON;
}
function approxEquals(a, b) {
    return approxZero(a - b);
}

export default DampingTween;
