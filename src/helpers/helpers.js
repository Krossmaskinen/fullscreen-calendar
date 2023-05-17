export function getMonthData(date) {
	const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
	const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const monthData = [];

	for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
		monthData.push({
			date: new Date(d),
			details: '' // Replace this with real data
		});
	}

	return monthData;
}

export function getPrevMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export function getNextMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}
