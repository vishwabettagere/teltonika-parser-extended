'use strict';

const binutils = require('binutils64');

/**
 * Base codec class
 */
class Codec {

    /**
     * Codec constructor
     *
     * @param reader
     * @param number_of_records
     */
    constructor(reader, number_of_records) {
        this.reader = reader;
        this.number_of_records = number_of_records;
        this.avlObj = {};
    }

    /**
     * Run parse process
     */
    process() {
        this.parseHeader();
    }

    /**
     * Convert bytes to int
     *
     * @param bytes
     * @returns {number}
     * @private
     */
    toInt(bytes) {
        return parseInt(bytes.toString('hex'), 16);
    }

    toString(bytes){
        return bytes.toString('utf8');
    }

    /**
     * Get AVL object
     *
     * @returns {{}}
     */
    getAvl() {
        return this.avlObj;
    }
}

module.exports = Codec;
