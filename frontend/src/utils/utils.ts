export function parseServerString(str: string | null | undefined): Array<string> {
    if (!str) {
        return [];
    }
    // Split the string by commas and trim each part
    return str.split(',').map(part => part.trim());
}

export function decideRank(score: number ): string {
    if (score >= 0 && score <= 20) {
        return 'Novato';
    }
    else if (score > 20 && score <= 40) {
        return 'Principiante';
    }
    else if (score > 40 && score <= 60) {
        return 'Intermedio';
    }
    else if (score > 60 && score <= 80) {
        return 'Avanzado';
    }
    else if (score > 80 && score <= 100) {
        return 'Experto';
    }
    else {
        return 'Sin definir';
    }
}