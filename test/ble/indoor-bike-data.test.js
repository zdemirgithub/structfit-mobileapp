import { indoorBikeData } from '../../src/ble/ftms/indoor-bike-data.js';



describe('Indoor Bike Data', () => {

    test('speed-cadence-power', () => {
        const view = new DataView(
            new Uint8Array([
                 68,  0, // flags, 0b1000100
                202, 12, // instantaneous speed
                160,  0, // instantaneous cadence
                 44,  1, // power
            ]).buffer
        );

        const expected = {
            speed: 32.74,
            cadence: 80,
            power: 300,
        };

        const res = indoorBikeData.decode(view);
        expect(res).toEqual(expected);
    });

    test('speed-cadence-power-heartRate', () => {
        const view = new DataView(
            new Uint8Array([
                 68,  2, // flags, 0b1001000100
                202, 12, // instantaneous speed
                160,  0, // instantaneous cadence
                 44,  1, // power
                143,     // heart rate
            ]).buffer
        );

        const expected = {
            speed: 32.74,
            cadence: 80,
            power: 300,
            heartRate: 143,
        };

        const res = indoorBikeData.decode(view);
        expect(res).toEqual(expected);
    });

    test('speed-cadence-distance-power-heartRate', () => {
        // ['0x54', '0x02', '0xCA', '0x0C', '0xA0', '0x00', '0xD3', '0xA4', '0x00', '0x2C', '0x01', '0x8F']
        // '0x 54 02 CA 0C A0 00 D3 A4 00 2C 01 8F'

        const view = new DataView(
            new Uint8Array([
                84, 2,       // flags, 0b1001010100
                202, 12,     // instantaneous speed
                160, 0,      // instantaneous cadence
                211, 164, 0, // total distance
                44, 1,       // power
                143,         // heart rate
            ]).buffer
        );

        const expected = {
            speed:   32.74,
            cadence: 80,
            distance: 42195,
            power:   300,
            heartRate: 143,
        };

        const res = indoorBikeData.decode(view);

        expect(res).toEqual(expected);
    });
});

