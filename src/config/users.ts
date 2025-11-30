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
        username: 'sannicolas',
        password: 'sn2024',
        branchId: 'san-nicolas',
        role: 'branch-admin',
        displayName: 'San Nicolás'
    },
    {
        username: 'campana',
        password: 'camp2024',
        branchId: 'campana',
        role: 'branch-admin',
        displayName: 'Campana'
    },
    {
        username: 'necochea',
        password: 'nec2024',
        branchId: 'necochea',
        role: 'branch-admin',
        displayName: 'Necochea'
    },
    {
        username: 'bahiablanca',
        password: 'bb2024',
        branchId: 'bahia-blanca',
        role: 'branch-admin',
        displayName: 'Bahía Blanca'
    },
    {
        username: 'ushuaia',
        password: 'ush2024',
        branchId: 'ushuaia',
        role: 'branch-admin',
        displayName: 'Ushuaia'
    },
    {
        username: 'puertomadryn',
        password: 'pm2024',
        branchId: 'puerto-madryn',
        role: 'branch-admin',
        displayName: 'Puerto Madryn'
    },
    {
        username: 'nuevapalmira',
        password: 'np2024',
        branchId: 'nueva-palmira-uru',
        role: 'branch-admin',
        displayName: 'Nueva Palmira (URU)'
    },
    {
        username: 'montevideo',
        password: 'mvd2024',
        branchId: 'montevideo-uru',
        role: 'branch-admin',
        displayName: 'Montevideo (URU)'
    },
    {
        username: 'asuncion',
        password: 'asu2024',
        branchId: 'asuncion-par',
        role: 'branch-admin',
        displayName: 'Asunción (PAR)'
    },
    {
        username: 'corumba',
        password: 'cor2024',
        branchId: 'corumba-bra',
        role: 'branch-admin',
        displayName: 'Corumba (BRA)'
    },
    {
        username: 'quijarro',
        password: 'qui2024',
        branchId: 'quijarro-bol',
        role: 'branch-admin',
        displayName: 'Quijarro (BOL)'
    }
];

export const authenticateUser = (username: string, password: string): User | null => {
    const user = USERS.find(u => u.username === username && u.password === password);
    return user || null;
};
