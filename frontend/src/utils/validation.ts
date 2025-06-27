function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isPasswordSecure(password: string): boolean {
    // Comprueba si la contraseña tiene al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
}

function isUsernameValid(username: string): boolean {
    return username.length >= 3;
}

function isValidName(name: string): boolean {
    // Comprueba si el nombre tiene al menos 3 caracteres y no contiene números
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
        return 'Los campos de nombre y apellidos deben tener al menos 3 caracteres y no pueden contener números';
    }
    if (!isUsernameValid(username)) {
        return 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    if (!isEmailValid(email)) {
        return 'El correo electrónico no es válido';
    }
    if (!isPasswordSecure(password)) {
        return 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número';
    }
    if (!(password === confirmPassword)) {
        return 'Las contraseñas no coinciden';
    }
    return '';
}