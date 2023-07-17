export class Project {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export function jsonToProject(value: any): Project {
    return { id: value.ID, name: value.Name };
}
