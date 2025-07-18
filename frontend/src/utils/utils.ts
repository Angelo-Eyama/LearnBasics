import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

export const getDiceBearAvatar = (username: string) => {
    const avatar = createAvatar(identicon, {
        seed: username,
    }).toDataUri();
    return avatar;
}

export function parseServerString(str: string | null | undefined): Array<string> {
    if (!str) return [];
    return str.split(', ').map(part => part.trim());
}

export function decideRank(score: number | null | undefined): string {
    if (score === null || score === undefined) return 'Sin definir';
    if (score >= 0 && score <= 20) return 'Novato';
    else if (score > 20 && score <= 40) return 'Principiante';
    else if (score > 40 && score <= 60) return 'Intermedio';
    else if (score > 60 && score <= 80) return 'Avanzado';
    else if (score > 80 && score <= 100) return 'Experto';
    else return 'Sin definir';
}

export const formatDate = (dateStr: string | null, options_?: Intl.DateTimeFormatOptions) => {
    if (!dateStr) return "";

    const [date, time] = dateStr.split("T");

    const [year, month, day] = date.split("-");
    const [hour, minute, seconds] = time.split(":");
    let dateObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(seconds)));
    const DefaultOptions: Intl.DateTimeFormatOptions = {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
        hour: "numeric",
        minute: "numeric",
        weekday: "short",

    };
    if (!options_) return dateObj.toLocaleString('es-ES', DefaultOptions);
    return dateObj.toLocaleString('es-ES', options_);
};

export function getHighestRole(roles: { name: string }[]) {
    if (roles.some(role => role.name.toLowerCase() === "administrador")) return "Administrador"
    if (roles.some(role => role.name.toLowerCase() === "moderador")) return "Moderador"
    return "Estudiante"
}