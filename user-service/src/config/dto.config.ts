const isEmptyMessage = (fieldName: string) => {
	return `${fieldName} should not be empty`;
};
const isStringMessage = (fieldName: string) => {
	return `${fieldName} must be a string`;
};

const isEnumMessage = (fieldName: string, enumTypes) => {
	return `${fieldName} should be ${enumTypes ? Object.values(enumTypes).join(' , ') : 'valid'}`;
};

export { isEmptyMessage, isStringMessage, isEnumMessage };
