'use strict';

const binutils = require('binutils64');

/**
 * Codec 8 decoding
 */
class Codec16 {

    /**
     * Trip event id's
     *
     * @returns {number}
     * @constructor
     */
    static get TRIP_EVENT_ID(){
        return 250;
    }

    /**
     * Trip start flag
     *
     * @returns {number}
     * @constructor
     */
    static get TRIP_EVENT_START(){
        return 1;
    }

    /**
     * Trip end flag
     *
     * @returns {number}
     * @constructor
     */
    static get TRIP_EVENT_END(){
        return 0;
    }

    /**
     * Codec8 constructor
     * @param buffer
     */
    constructor(buffer) {
        this._reader = new binutils.BinaryReader(buffer);
        this._avlObj = {};
        this.parseHeader();
    }

    /**
     * Parsing AVL record header
     */
    parseHeader() {
        this._avlObj.zero = this._toInt(this._reader.ReadBytes(4));
        this._avlObj.data_length = this._reader.ReadInt32();
        this._avlObj.codec_id = this._toInt(this._reader.ReadBytes(1));
        this._avlObj.number_of_avl_records = this._toInt(this._reader.ReadBytes(1));
        this._avlObj.records = [];
        for (var i = 0; i < this._avlObj.number_of_avl_records; i++) {
            this.parseAvlRecords();
        }
    }

    /**
     * Convert bytes to int
     *
     * @param bytes
     * @returns {number}
     * @private
     */
    _toInt(bytes) {
        return parseInt(bytes.toString('hex'), 16);
    }

    /**
     * Parse single AVL record
     */
    parseAvlRecords() {
        let avlRecord = {};
        avlRecord.timestamp = this._reader.ReadDouble();
        avlRecord.priority = this._toInt(this._reader.ReadBytes(1));
        avlRecord.longtitude = this._reader.ReadInt32();
        avlRecord.latitude = this._reader.ReadInt32();
        avlRecord.atitude = this._reader.ReadInt16();
        avlRecord.angle = this._reader.ReadInt16();
        avlRecord.satelites = this._reader.ReadInt8();
        avlRecord.speed = this._reader.ReadInt16();
        avlRecord.event_id = this._toInt(this._reader.ReadBytes(1));
        avlRecord.properties_count = this._toInt(this._reader.ReadBytes(1));
        avlRecord.ioElements = [];

        for (var j = 0; j < avlRecord.properties_count; j++) {
            avlRecord.ioElements.push(this.parseIoElements());
        }

        this._avlObj.records.push(avlRecord);
    }

    /**
     * Parse single IoElement records
     *
     * @returns {Array}
     */
    parseIoElements() {
        let ioElement = [];

        let ioCountInt8 = this._toInt(this._reader.ReadBytes(1));
        for (var i = 0; i < ioCountInt8; i++) {
            let property_id = this._toInt(this._reader.ReadBytes(1));
            let value = this._toInt(this._reader.ReadBytes(1));
            ioElement.push({id: property_id, value: value})
        }

        let ioCountInt16 = this._toInt(this._reader.ReadBytes(1));
        for (var i = 0; i < ioCountInt16; i++) {
            let property_id = this._toInt(this._reader.ReadBytes(1));
            let value = this._reader.ReadInt16();
            ioElement.push({id: property_id, value: value})
        }

        let ioCountInt32 = this._toInt(this._reader.ReadBytes(1));
        for (var i = 0; i < ioCountInt32; i++) {
            let property_id = this._toInt(this._reader.ReadBytes(1));
            let value = this._reader.ReadInt32();
            ioElement.push({id: property_id, value: value})
        }

        let ioCountInt64 = this._toInt(this._reader.ReadBytes(1));
        for (var i = 0; i < ioCountInt64; i++) {
            let property_id = this._toInt(this._reader.ReadBytes(1));
            let value = this._reader.ReadDouble();
            ioElement.push({id: property_id, value: value})
        }

        return ioElement;
    }

    /**
     * Get AVL object
     *
     * @returns {{}}
     */
    getAvl(){
        return this._avlObj;
    }
}

module.exports = Codec16;
