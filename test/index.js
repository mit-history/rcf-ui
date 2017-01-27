/* global describe, it */

import {expect} from 'chai';

import {mdlclass, numberWithSpaces} from '../app/shared/components';

describe('mdlclass', () => {

    it('render cols only if a number is passed', () => {
        expect(mdlclass(3)).to.be.equal('mdl-cell mdl-cell--3-col');
    });

    it('defaults to desktop cols', () => {
        expect(mdlclass({col: 6})).to.be.equal('mdl-cell mdl-cell--6-col mdl-cell--6-desktop mdl-cell--6-tablet mdl-cell--6-phone');
    });

    it('phone defaults to tablet cols', () => {
        expect(mdlclass({col: 6, tablet: 4})).to.be.equal('mdl-cell mdl-cell--6-col mdl-cell--6-desktop mdl-cell--4-tablet mdl-cell--4-phone');
    });

    it('each can be specified', () => {
        expect(mdlclass({col: 6, tablet: 4, phone: 3})).to.be.equal('mdl-cell mdl-cell--6-col mdl-cell--6-desktop mdl-cell--4-tablet mdl-cell--3-phone');
    });

});



describe('numberWithSpaces', () => {
    it('formats numbers correctly', () => {
        expect(numberWithSpaces(1)).to.be.equal('1');
        expect(numberWithSpaces(11)).to.be.equal('11');
        expect(numberWithSpaces(111)).to.be.equal('111');
        expect(numberWithSpaces(1111)).to.be.equal('1 111');
        expect(numberWithSpaces(11111)).to.be.equal('11 111');
        expect(numberWithSpaces(111111)).to.be.equal('111 111');
        expect(numberWithSpaces(1111111)).to.be.equal('1 111 111');
    });
});
