/**
 * Mock Data for Development and Testing
 * DB General Construction PLC
 */

const MockData = {
    // Sample Projects
    projects: [
        {
            id: 'proj-001',
            title: 'Addis Ababa Commercial Complex',
            description: 'Modern 15-story commercial building in the heart of Addis Ababa',
            category: ['commercial', 'high-rise'],
            location: { lat: 9.0320, lng: 38.7469, address: 'Bole, Addis Ababa' },
            images: ['Images/gallery1.jpg', 'Images/gallery2.jpg'],
            completionDate: '2023-06-15',
            duration: 18,
            size: 25000,
            client: 'ABC Corporation',
            features: ['Modern design', 'Energy efficient', 'Smart building systems'],
            cost: 50000000,
            virtualTourId: 'tour-001',
            status: 'completed'
        },
        {
            id: 'proj-002',
            title: 'Residential Villa Complex',
            description: 'Luxury residential villas with modern amenities',
            category: ['residential', 'luxury'],
            location: { lat: 9.0054, lng: 38.7636, address: 'Sarbet, Addis Ababa' },
            images: ['Images/gallery3.jpg', 'Images/gallery4.jpg'],
            completionDate: '2023-09-20',
            duration: 12,
            size: 15000,
            client: 'Private Developer',
            features: ['Gated community', 'Swimming pool', 'Landscaped gardens'],
            cost: 30000000,
            virtualTourId: null,
            status: 'completed'
        },
        {
            id: 'proj-003',
            title: 'Industrial Warehouse',
            description: 'Large-scale industrial warehouse facility',
            category: ['industrial', 'warehouse'],
            location: { lat: 8.9806, lng: 38.7578, address: 'Kaliti, Addis Ababa' },
            images: ['Images/gallery5.jpg', 'Images/gallery1.jpg'],
            completionDate: '2024-01-10',
            duration: 10,
            size: 40000,
            client: 'Manufacturing Co.',
            features: ['High ceilings', 'Loading docks', 'Security systems'],
            cost: 20000000,
            virtualTourId: null,
            status: 'in-progress'
        }
    ],

    // Sample Users
    users: [
        {
            id: 'user-001',
            email: 'dereje.zewudu@gmail.com',
            name: 'dereje zewudu',
            username: 'derejez',
            password: 'hashed_password_123',
            role: 'client',
            projectIds: ['proj-001'],
            createdAt: '2023-01-15T10:00:00Z',
            lastLogin: '2024-01-15T14:30:00Z',
            isActive: true
        },
        {
            id: 'admin-001',
            email: 'admin@dbconstruction.com',
            name: 'Admin User',
            username: 'admin',
            password: 'admin12345',
            role: 'admin',
            projectIds: [],
            createdAt: '2022-01-01T00:00:00Z',
            lastLogin: '2024-01-20T09:00:00Z',
            isActive: true
        }
    ],

    // Sample Quote Requests
    quoteRequests: [
        {
            id: 'quote-001',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '+251-911-123456',
            service: 'Residential Construction',
            message: 'Looking to build a 3-bedroom house',
            status: 'pending',
            createdAt: '2024-01-18T10:30:00Z',
            assignedTo: null,
            notes: []
        },
        {
            id: 'quote-002',
            name: 'Michael Birhanu',
            email: 'michaelb@tcompany.com',
            phone: '+251-911-654321',
            service: 'Commercial Construction',
            message: 'Need office building construction estimate',
            status: 'contacted',
            createdAt: '2024-01-15T14:20:00Z',
            assignedTo: 'admin-001',
            notes: ['Initial contact made', 'Site visit scheduled']
        }
    ],

    // Sample Newsletter Subscribers
    newsletterSubscribers: [
        {
            id: 'sub-001',
            email: 'subscriber1@example.com',
            status: 'confirmed',
            subscribedAt: '2023-12-01T10:00:00Z',
            confirmedAt: '2023-12-01T10:15:00Z',
            confirmationToken: 'token123abc'
        },
        {
            id: 'sub-002',
            email: 'subscriber2@example.com',
            status: 'pending',
            subscribedAt: '2024-01-10T15:30:00Z',
            confirmedAt: null,
            confirmationToken: 'token456def'
        }
    ],

    // Sample Resources
    resources: [
        {
            id: 'res-001',
            title: 'Company Brochure 2024',
            description: 'Comprehensive overview of our services',
            category: 'Brochures',
            fileType: 'PDF',
            fileSize: 2500000,
            filePath: '/downloads/brochure-2024.pdf',
            isRestricted: false,
            downloadCount: 145,
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 'res-002',
            title: 'Safety Guidelines',
            description: 'Construction site safety protocols',
            category: 'Guidelines',
            fileType: 'PDF',
            fileSize: 1800000,
            filePath: '/downloads/safety-guidelines.pdf',
            isRestricted: true,
            downloadCount: 67,
            createdAt: '2023-11-15T00:00:00Z'
        }
    ],

    // Sample Chat Messages
    chatMessages: [
        {
            id: 'msg-001',
            sessionId: 'session-001',
            sender: 'user',
            message: 'Hello, I need information about your services',
            timestamp: '2024-01-20T10:00:00Z',
            read: true
        },
        {
            id: 'msg-002',
            sessionId: 'session-001',
            sender: 'staff',
            message: 'Hello! I\'d be happy to help. What type of construction are you interested in?',
            timestamp: '2024-01-20T10:01:00Z',
            read: true
        }
    ],

    // Sample Cost Estimates
    costEstimates: [
        {
            id: 'est-001',
            projectType: 'Residential',
            size: 200,
            location: 'Addis Ababa',
            materials: ['Concrete', 'Steel', 'Glass'],
            estimatedCost: { min: 5000000, max: 7000000 },
            breakdown: {
                materials: 2500000,
                labor: 2000000,
                equipment: 500000,
                permits: 300000,
                contingency: 700000
            },
            createdAt: '2024-01-15T14:30:00Z',
            userEmail: 'john.doe@example.com'
        }
    ],

    // Sample Admin Actions (Audit Log)
    adminActions: [
        {
            id: 'action-001',
            adminId: 'admin-001',
            action: 'create',
            targetType: 'project',
            targetId: 'proj-003',
            details: { title: 'Industrial Warehouse' },
            timestamp: '2024-01-10T09:00:00Z',
            ipAddress: '192.168.1.1'
        },
        {
            id: 'action-002',
            adminId: 'admin-001',
            action: 'update',
            targetType: 'quote',
            targetId: 'quote-002',
            details: { status: 'contacted' },
            timestamp: '2024-01-15T14:25:00Z',
            ipAddress: '192.168.1.1'
        }
    ],

    // Sample Service Tiers
    serviceTiers: [
        {
            id: 'tier-basic',
            name: 'Basic',
            price: 'Starting at 2,000,000 ETB',
            features: [
                'Standard materials',
                'Basic design',
                '6-month warranty',
                'Email support'
            ],
            recommended: false
        },
        {
            id: 'tier-standard',
            name: 'Standard',
            price: 'Starting at 5,000,000 ETB',
            features: [
                'Quality materials',
                'Custom design',
                '1-year warranty',
                'Phone & email support',
                'Project management'
            ],
            recommended: true
        },
        {
            id: 'tier-premium',
            name: 'Premium',
            price: 'Starting at 10,000,000 ETB',
            features: [
                'Premium materials',
                'Luxury custom design',
                '2-year warranty',
                '24/7 support',
                'Dedicated project manager',
                'Smart home integration'
            ],
            recommended: false
        }
    ],

    // Sample Team Members
    teamMembers: [
        {
            id: 'team-001',
            name: 'Dale Melaku',
            position: 'CEO & Founder',
            image: 'Images/dale.png',
            bio: 'Over 20 years of experience in construction',
            email: 'dale@dbconstruction.com',
            phone: '+251-911-000001'
        },
        {
            id: 'team-002',
            name: 'John Smith',
            position: 'Chief Engineer',
            image: 'Images/cust1.jpg',
            bio: 'Structural engineering expert',
            email: 'john@dbconstruction.com',
            phone: '+251-911-000002'
        }
    ],

    // Sample Testimonials
    testimonials: [
        {
            id: 'test-001',
            name: 'John Doe',
            company: 'ABC Corporation',
            position: 'CEO',
            image: 'Images/cust1.png',
            rating: 5,
            text: 'DB General Construction delivered our project on time and within budget. Excellent work!',
            projectId: 'proj-001',
            date: '2023-07-01'
        },
        {
            id: 'test-002',
            name: 'Jane Smith',
            company: 'XYZ Developers',
            position: 'Project Manager',
            image: 'Images/cust1.jpg',
            rating: 5,
            text: 'Professional team, quality workmanship, and great communication throughout the project.',
            projectId: 'proj-002',
            date: '2023-10-15'
        }
    ]
};

// Helper functions to work with mock data
const MockDataHelpers = {
    // Get all projects
    getAllProjects() {
        return MockData.projects;
    },

    // Get project by ID
    getProjectById(id) {
        return MockData.projects.find(p => p.id === id);
    },

    // Get projects by category
    getProjectsByCategory(category) {
        return MockData.projects.filter(p => p.category.includes(category));
    },

    // Get user by email
    getUserByEmail(email) {
        return MockData.users.find(u => u.email === email);
    },

    // Get pending quote requests
    getPendingQuotes() {
        return MockData.quoteRequests.filter(q => q.status === 'pending');
    },

    // Get confirmed subscribers
    getConfirmedSubscribers() {
        return MockData.newsletterSubscribers.filter(s => s.status === 'confirmed');
    },

    // Initialize mock data in localStorage
    initializeMockData() {
        if (!localStorage.getItem('projects')) {
            localStorage.setItem('projects', JSON.stringify(MockData.projects));
        }
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify(MockData.users));
        }
        if (!localStorage.getItem('quoteRequests')) {
            localStorage.setItem('quoteRequests', JSON.stringify(MockData.quoteRequests));
        }
        if (!localStorage.getItem('newsletterSubscribers')) {
            localStorage.setItem('newsletterSubscribers', JSON.stringify(MockData.newsletterSubscribers));
        }
        if (!localStorage.getItem('resources')) {
            localStorage.setItem('resources', JSON.stringify(MockData.resources));
        }
        if (!localStorage.getItem('serviceTiers')) {
            localStorage.setItem('serviceTiers', JSON.stringify(MockData.serviceTiers));
        }
        console.log('Mock data initialized in localStorage');
    },

    // Clear all mock data
    clearMockData() {
        const keys = ['projects', 'users', 'quoteRequests', 'newsletterSubscribers', 
                     'resources', 'chatMessages', 'costEstimates', 'adminActions', 
                     'serviceTiers', 'teamMembers', 'testimonials'];
        keys.forEach(key => localStorage.removeItem(key));
        console.log('Mock data cleared from localStorage');
    }
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
    window.MockData = MockData;
    window.MockDataHelpers = MockDataHelpers;
    
    // Initialize mock data if not already present
    document.addEventListener('DOMContentLoaded', () => {
        MockDataHelpers.initializeMockData();
    });
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MockData, MockDataHelpers };
}
