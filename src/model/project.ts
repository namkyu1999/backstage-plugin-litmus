export class Project {
    id: string;
    name: string;
    role: string;

    constructor(id: string, name: string, role: string) {
        this.id = id;
        this.name = name;
        this.role = role;
    }
}

export function jsonToProject(value: any, username: string): Project {
    const role = value.Members.find((x) => x.UserName === username).Role;
    return { id: value.ID, name: value.Name, role };
}
