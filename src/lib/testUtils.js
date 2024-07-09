export const testEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
};
export const testPassword = (password) => {
	const passwordRegex = /^[a-zA-Z0-9!@#&?.]{8,16}$/;
	return passwordRegex.test(password);
};