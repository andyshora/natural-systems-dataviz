import test from 'ava';
// import { Component } from '../src/component-path';

test('Browser enviromnent should be mocked', t => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    t.is(document.querySelector('div'), div);
});

// test('Components should be exposed', t => {
//   t.is(typeof Component, 'function');
// });
