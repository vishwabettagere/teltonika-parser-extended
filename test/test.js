const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const Parser = require("../index");
const crc = require('crc');



describe('Teltonika parser', function () {

    before(function (done) {
        fs.readFile(path.join(__dirname, './data/test8.1.log'), function (err, fileContents) {
            if (err) throw err;
            buffer = fileContents;
            parser = new Parser(buffer);
            avl = parser.getAvl();
            record = avl.records[0];

            done();
        });
    });

    describe('Test AVL object', function () {

        it('Should return an object', () => {
            expect(avl).to.be.a('Object');
        });

        it('Should have codec ID', () => {
            expect(avl).to.have.property('codec_id');
        });

        it('Should have codec ID with value 8', () => {
            expect(avl).to.have.property('codec_id').that.equal(8);
        });

        it('Should have records list', () => {
            expect(avl).to.have.property('records');
        });

        it('Should have records list with right length', () => {
            expect(avl).to.have.property('records').with.length(avl.number_of_data);
        });

        it('Should have correct record count', () => {
            expect(avl).to.have.property('number_of_data2').that.equal(avl.number_of_data);
        });

    });

    describe('Test AVL object record', function () {
        it('Should be object', () => {
            expect(record).to.be.a('Object');
        });

        it('Should have timestamp', () => {
            expect(record).to.have.property('timestamp');
        });

        it('Should timestamp is date', () => {
            expect(record).to.have.property('timestamp').that.to.be.a('date');
        });

        it('Should have GSP property', () => {
            expect(record).to.have.property('gps');
        });

        it('Should have longitude between -180 and +180', () => {
            expect(record).to.have.property('gps').that.to.have.property('longitude').that.to.be.above(-180);
            expect(record).to.have.property('gps').that.to.have.property('longitude').that.to.be.below(180);
        });

        it('Should have latitude between -90 and +90', () => {
            expect(record).to.have.property('gps').that.to.have.property('latitude').that.to.be.above(-180);
            expect(record).to.have.property('gps').that.to.have.property('latitude').that.to.be.below(180);
        });

        it('Should have ioElement list', () => {
            expect(record).to.have.property('ioElements');
        });

        it('Should have ioElement list with right length', () => {
            expect(record).to.have.property('ioElements').with.length(record.properties_count);
        });
    });


    describe('Test ioElement object record', function () {
        it('Should be object', () => {
            let ioRecord = record.ioElements[0];
            expect(ioRecord).to.be.a('Object');
        });

        it('Should contain object', () => {
            let testObj = record.ioElements[0];
            expect(testObj).to.have.property('id');
            expect(testObj).to.have.property('value');
        });
    });

});
