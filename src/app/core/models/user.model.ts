import { Role } from '../../domain/models/role.model';

export interface User {
    id: string;
    email: string;
    role: Role;
}
