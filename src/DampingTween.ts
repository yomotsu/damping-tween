const FPS_60 = 1 / 0.016;

interface Values {
	[ key: string ]: number;
}

export class DampingTween {

	active = false;
	dampingFactor = 0.1;

	private _keys: string[];
	private _currentValues: Values;
	private _endValues: Values;
	private _deltaValues: Values;

	constructor( values: Values ) {

		const _values = Object.keys( values ).reduce( ( __values, key ) => {

			// remove value other than number
			if ( ! isNumber( values[ key ] ) ) return __values;
			__values[ key ] = values[ key ];
			return __values;

		}, {} as Values );

		this._keys = Object.keys( _values );
		this._currentValues = { ..._values };
		this._endValues = { ..._values };
		this._deltaValues = this._keys.reduce( ( __values, key ) => {

			__values[ key ] = 0;
			return __values;

		}, {} as Values );

	}

	get values(): Values {

		return { ...this._currentValues };

	}

	get endValues(): Values {

		return { ...this._endValues };

	}

	setValues( values: Values, immediate = false ): void {

		this._keys.forEach( ( key ) => this.setValue( key, values[ key ], immediate ) );

	}

	setValue( key: string, value: number, immediate = false ): void {

		if ( ! isNumber( this._endValues[ key ] ) ) return;
		if ( approxEquals( value, this._endValues[ key ] ) ) return;
		if ( immediate && value === this._currentValues[ key ] && value === this._endValues[ key ] ) return;

		this._endValues[ key ] = value;

		if ( immediate ) {

			this._currentValues[ key ] = value;

		}

		this.active = true;

	}

	stop(): void {

		this.setValues( this._currentValues, true );

	}

	update( delta: number ): boolean {

		const shouldUpdate = this.active;

		const lerpRatio = 1.0 - Math.exp( - this.dampingFactor * delta * FPS_60 );
		// update delta
		this._keys.forEach( ( key ) => this._deltaValues[ key ] = this._endValues[ key ] - this._currentValues[ key ] );

		// if delta contains not-approxZero value
		const needsUpdate = this._keys.some( ( key ) => ! approxZero( this._deltaValues[ key ] ) );

		if ( needsUpdate ) {

			this._keys.forEach( ( key ) => {

				this._currentValues[ key ] += this._deltaValues[ key ] * lerpRatio;

			} );
			this.active = true;
			// updated

		} else {

			Object.assign( this._currentValues, this._endValues );
			this.active = false;
			// ended

		}

		return shouldUpdate;

	}

}

function isNumber( value: number ): boolean {

	return ( typeof value === 'number' ) && ( isFinite( value ) );

}

const EPSILON = 1e-5;

function approxZero( number: number ): boolean {

	return Math.abs( number ) < EPSILON;

}

function approxEquals( a: number, b: number ): boolean {

	return approxZero( a - b );

}
