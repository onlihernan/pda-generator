// User configuration for branch-based access control
// NOTE: For production use (Opción 2), this will be moved to a backend with hashed passwords

export interface User {
    username: string;
    password: string;
    branchId: string | null;  // null = access to all branches
    role: 'super-admin' | 'branch-admin';
    displayName: string;
}

export const USERS: User[] = [
    {
        username: 'admin',
        password: 'admin123',
        branchId: null,
        role: 'super-admin',
        displayName: 'Administrador General'
    },
    {
        username: 'sanlorenzo',
        password: 'sl2024',
        branchId: 'san-lorenzo',
        role: 'branch-admin',
        displayName: 'San Lorenzo'
    },
    {
        username: 'rosario',
        password: 'ros2024',
        branchId: 'rosario',
        role: 'branch-admin',
        displayName: 'Rosario'
    },
    {
        username: 'buenosaires',
        password: 'ba2024',
        branchId: 'buenos-aires',
        role: 'branch-admin',
        displayName: 'Buenos Aires'
    },
    {
        username: 'campana',
        password: 'camp2024',
        branchId: 'campana',
        role: 'branch-admin',
        displayName: 'Campana'
    }
];

export const authenticateUser = (username: string, password: string): User | null => {
    const user = USERS.find(u => u.username === username && u.password === password);
    return user || null;
};
