var exports = module.exports = {};

/*
	You do only need to adjust year month or min. 
	for 1 hour = 60 min
	for 1 day = 60 min * 24
	for 2 days = 60 min * 24 * 2
	and so on 
*/

exports.dateAndTimeNow = function () {
	
	var date = new Date();

    return date;
};

exports.dateAddYear = function (year) {

	var date = new Date();
	var addYear = new Date (date);
	addYear.setFullYear(date.getFullYear() + year);

	return addYear;
};

exports.dateAddMonth = function (month) {

	var date = new Date();
	var addMonth = new Date (date);
	addMonth.setMonth(date.getMonth() + month);

	return addMonth;
};

exports.dateAddMin = function (min) {
	
	var date = new Date();
	var addMin = new Date (date);
	addMin.setMinutes(date.getMinutes() + min);
    
    return addMin;
};
