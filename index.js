'use strict';

const binutils = require('binutils64');
const codec7 = require('./codecs/codec7');
const codec8 = require('./codecs/codec8');
const codec16 = require('./codecs/codec16');
const codec8e = require('./codecs/codec8e');



class TeltonikaParser {

    constructor(buffer) {
        this._reader = new binutils.BinaryReader(buffer);
        this._avlObj = {};
        this.checkIsImei();
        if (!this.isImei) {
            this.parseHeader();
            this.decodeData();
            this.parseFooter();
        }
    }

    checkIsImei() {
        let imeiLength = this._toInt(this._reader.ReadBytes(2));
        if (imeiLength > 0) {
            this.isImei = true;
            this.imei = this._reader.ReadBytes(imeiLength).toString();
            return this.imei
        } else {
            this._toInt(this._reader.ReadBytes(2))
        }

    }

    /**
     * Parsing AVL record header
     */
    parseHeader() {
        this._avlObj = {
            data_length   : this._reader.ReadInt32(),
            codec_id      : this._toInt(this._reader.ReadBytes(1)),
            number_of_data: this._toInt(this._reader.ReadBytes(1))
        };

        this._codecReader = this._reader;

        switch (this._avlObj.codec_id) {
            case 7:
                this._codec = new codec7(this._codecReader, this._avlObj.number_of_data);
                break;
            case 8:
                this._codec = new codec8(this._codecReader, this._avlObj.number_of_data);
                break;
            case 16:
                this._codec = new codec16(this._codecReader, this._avlObj.number_of_data);
                break;
            case 142:
                this._codec = new codec8e(this._codecReader, this._avlObj.number_of_data);
                break;
        }

    }

    decodeData() {
        if (this._codec) {
            this._codec.process();
            let intAvl = this._codec.getAvl();
            intAvl.zero = this._avlObj.zero;
            intAvl.data_length = this._avlObj.data_length;
            intAvl.codec_id = this._avlObj.codec_id;
            intAvl.number_of_data = this._avlObj.number_of_data;

            this._avlObj = intAvl;
        }

    }

    parseFooter() {
        this._avlObj.number_of_data2 = this._toInt(this._reader.ReadBytes(1));
        this._avlObj.CRC = {
            0: this._toInt(this._reader.ReadBytes(1)),
            1: this._toInt(this._reader.ReadBytes(1)),
            2: this._toInt(this._reader.ReadBytes(1)),
            3: this._toInt(this._reader.ReadBytes(1))
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

    getAvl() {
        return this._avlObj;
    }
}

module.exports = TeltonikaParser;

