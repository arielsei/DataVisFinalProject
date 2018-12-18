String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.normText = function () {
    return this.toLowerCase().replace(' ', '').replace('_', '');
};