function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isPasswordValid(password: string): boolean {
    return password.length >= 8;
}

function samePassword(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
}

function isUsernameValid(username: string): boolean {
    return username.length >= 3;
}

function isValidName(name: string): boolean {
    //Verify that the name is not empty, and that it does not contain any numbers
    return name.length > 3 && !/\d/.test(name);
}

/**
 * Valida los campos del formulario de registro.
 * @param firstName - El primer nombre del usuario.
 * @param lastName - El apellido del usuario.
 * @param username - El nombre de usuario.
 * @param email - El correo electrónico del usuario.
 * @param password - La contraseña del usuario.
 * @param confirmPassword - La confirmación de la contraseña.
 * @returns Un mensaje de error si hay algún problema, o una cadena vacía si todo es válido.
 */
export function validateRegister(
    firstName: string, lastName: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
): string {
    if (!isValidName(firstName) || !isValidName(lastName)) {
        return 'Los campos de nombre y apellido deben tener al menos 3 caracteres y no pueden contener números';
    }
    if (!isUsernameValid(username)) {
        return 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    if (!isEmailValid(email)) {
        return 'El correo electrónico no es válido';
    }
    if (!isPasswordValid(password)) {
        return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!samePassword(password, confirmPassword)) {
        return 'Las contraseñas no coinciden';
    }
    return '';
}