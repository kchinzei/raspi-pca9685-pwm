/*
The MIT License (MIT)

Copyright (c) Kiyo Chinzei (kchinzei@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
   Raspi-PCA9685-pwm - Hardware PWM by PCA9685 via I2C on the Raspberry Pi.

   Make Asayake to Wake Project.
   Kiyo Chinzei
   https://github.com/kchinzei/raspi-pca9685-pwm
*/

const numberOfInstalledBoard = 1;

import { init } from 'raspi';
import { PCA9685Module, publicConst } from '../src/index';

function test_pca9685(ch: number, freq:number, val:number): void {
  let i = 1;

  test(`${i++}. Instantiation of PCM9685 object: illegal board (negative) should fail`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(-1, freq);
      pca9685.reset();
    }).toThrow();
  });

  test(`${i++}. Instantiation of PCM9685 object: illegal board (exceed available h/w) should fail`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(numberOfInstalledBoard, freq);
      pca9685.reset();
    }).toThrow();
  });

  test(`${i++}. Instantiation of PCM9685 object: illegal frequency (0) should fail`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0, 0);
      pca9685.reset();
    }).toThrow();
  });

  test(`${i++}. Instantiation of PCM9685 object: illegal frequency (negative) should fail`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0, -1);
      pca9685.reset();
    }).toThrow();
  });

  test(`${i++}. Instantiation of PCM9685 object: illegal frequency (exceed h/w limitation) should fail`, () => {
    expect(() => {
      // 10kHz ... max is 25MHz / 4096 / 3 =2.034 kHz
      const pca9685: PCA9685Module = new PCA9685Module(0, 10000);
      pca9685.reset();
    }).toThrow();
  });

  test(`${i++}. Instantiation of PCM9685 object: illegal frequency (too low) should fail`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0, 10);
      pca9685.reset();
    }).toThrow();
  });

  test(`${i++}. Instantiation of PWM object: omitting frequency should be accepted.`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0);
      pca9685.reset();
    }).not.toThrow();
  });

  test(`${i++}. Multiple instantiation of PCM9685 object should be no harm.`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0, freq);
      pca9685.reset();
    }).not.toThrow();
  });


  test(`${i++}. Member functions: reset() should run successfully.`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0, freq);
      pca9685.reset();
    }).not.toThrow();
  });

  test(`${i++}. Member functions: reading irregal duty (negative) should fail.`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0, freq);
      pca9685.dutyCycle(-1);
    }).toThrow();
  });

  test(`${i++}. Member functions: reading irregal channel (exceed h/w) should fail.`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0, freq);
      pca9685.dutyCycle(publicConst.maxChannelsPerBoard);
    }).toThrow();
  });



  test(`${i++}. Member functions: setDutyCycle(ch) should run successfully.`, () => {
    expect(() => {
      const pca9685: PCA9685Module = new PCA9685Module(0, freq);
      pca9685.setDutyCycle(ch, val);
    }).not.toThrow();
  });

  test(`${i++}. Member functions: dutyCycle(ch) should agree to setDutyCycle() value=${val}.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycle(ch, val);
    expect(pca9685.dutyCycle(ch)).toBeCloseTo(val);
  });

  test(`${i++}. Member functions: setDutyCycle(ch) should truncate to 0 when value<0.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycle(ch, -1);
    expect(pca9685.dutyCycle(ch)).toBe(0);
  });

  test(`${i++}. Member functions: setDutyCycle(ch) should truncate to 1 when value>1.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycle(ch, 1.5);
    expect(pca9685.dutyCycle(ch)).toBeCloseTo(1);
  });

  test(`${i++}. Member functions: setDutyCycle() should work for different channel.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycle(7, 0.8);
    expect(pca9685.dutyCycle(7)).toBeCloseTo(0.8);
  });

  test(`${i++}. Member functions: dutyCycleUInt(ch) should agree to setDutyCycleUInt() when value=0.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycleUInt(ch, 0);
    expect(pca9685.dutyCycleUInt(ch)).toBe(0);
  });

  test(`${i++}. Member functions: dutyCycleUInt(ch) should agree to setDutyCycleUInt() when value=0x01.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycleUInt(ch, 0x01);
    expect(pca9685.dutyCycleUInt(ch)).toBe(0x01);
  });

  test(`${i++}. Member functions: dutyCycleUInt(ch) should agree to setDutyCycleUInt() when value=0x0fff.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycleUInt(ch, 0x0fff);
    expect(pca9685.dutyCycleUInt(ch)).toBe(0x0fff);
  });

  test(`${i++}. Member functions: setDutyCycleUInt(ch) should truncate to 0 when value<0.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycleUInt(ch, -1);
    expect(pca9685.dutyCycleUInt(ch)).toBe(0);
  });

  test(`${i++}. Member functions: setDutyCycleUInt(ch) should truncate to 0x1000 when value>=0x1000.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycleUInt(ch, 0x1001);
    expect(pca9685.dutyCycleUInt(ch)).toBe(0x1000);
  });

  test(`${i++}. Member functions: channelOn(ch) should set raw PWM value to 0x1000.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.channelOn(ch);
    expect(pca9685.dutyCycleUInt(ch)).toBe(0x1000);
  });

  test(`${i++}. Member functions: channelOff(ch) should set PWM value to 0.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.channelOff(ch);
    expect(pca9685.dutyCycleUInt(ch)).toBe(0);
  });

  test(`${i++}. Member functions: channelOff() should set PWM values of all channels to 0.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.channelOff();
    let sum = 0;
    for (let j=0; j++; j<publicConst.maxChannelsPerBoard) {
      sum += pca9685.dutyCycleUInt(j);
    }
    expect(sum).toBe(0);
  });

  test(`${i++}. Member functions: channelOn(ch) should set PWM value to 1.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.channelOn(3);
    expect(pca9685.dutyCycle(3)).toBeCloseTo(1);
  });

  test(`${i++}. Member functions: setDutyCycle(ch) should turn on again after setting all channels to 0.`, () => {
    const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    pca9685.setDutyCycleUInt(ch, 0x3ff);
    expect(pca9685.dutyCycleUInt(ch)).toBe(0x3ff);
  });

  /*
  test(`${i++}. Destroy gracefully.`, () => {
  const pca9685: PCA9685Module = new PCA9685Module(0, freq);
    expect(() => {
      pca9685.destroy();
    }).not.toThrow();
  });
  */
}

function main() {
  //const progname: string = process.argv[1];
  let ch: number = 1;
  let freq: number = 1000;
  let val: number = 0.2;

  switch (process.argv.length) {
    case 3:
      val = parseFloat(process.argv[2]);
      break;
    case 4:
      val = parseFloat(process.argv[2]);
      ch = parseFloat(process.argv[3]);
      break;
    case 5:
      val = parseFloat(process.argv[2]);
      ch = parseFloat(process.argv[3]);
      freq = parseFloat(process.argv[4]);
      break;
  }

  init(() => {
  });

  test_pca9685(ch, freq, val);
}

main();
