const isEmptyMessage = (fieldName: string) => {
	return `${fieldName} should not be empty`;
};
const isStringMessage = (fieldName: string) => {
	return `${fieldName} must be a string`;
};

export { isEmptyMessage, isStringMessage };
