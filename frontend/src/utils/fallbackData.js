// Static fallback data for when backend is unavailable
export const fallbackData = {
  // Admin Dashboard Data
  adminDashboard: {
    totalClubs: 12,
    totalStudents: 450,
    pendingRequests: 8,
    recentClubs: [
      {
        _id: '1',
        name: 'Computer Science Club',
        description: 'A community for CS enthusiasts to learn and grow together',
        category: 'Academic',
        members: 85,
        createdAt: '2024-01-15T00:00:00.000Z'
      },
      {
        _id: '2', 
        name: 'Photography Club',
        description: 'Capture moments and explore the art of photography',
        category: 'Arts',
        members: 42,
        createdAt: '2024-01-20T00:00:00.000Z'
      },
      {
        _id: '3',
        name: 'Music Society',
        description: 'Where melodies meet and harmonies are born',
        category: 'Arts',
        members: 67,
        createdAt: '2024-02-01T00:00:00.000Z'
      }
    ]
  },

  // Student Dashboard Data
  studentDashboard: {
    joinedClubs: [
      {
        _id: '1',
        name: 'Computer Science Club',
        description: 'A community for CS enthusiasts',
        category: 'Academic',
        role: 'member'
      },
      {
        _id: '2',
        name: 'Photography Club', 
        description: 'Capture moments and explore photography',
        category: 'Arts',
        role: 'member'
      }
    ],
    recentAnnouncements: [
      {
        _id: '1',
        title: 'Welcome New Members!',
        content: 'We are excited to welcome all new members to our community.',
        club: 'Computer Science Club',
        date: '2024-03-15T00:00:00.000Z'
      },
      {
        _id: '2',
        title: 'Photography Workshop This Weekend',
        content: 'Join us for an exciting photography workshop covering basic techniques.',
        club: 'Photography Club', 
        date: '2024-03-12T00:00:00.000Z'
      }
    ],
    upcomingEvents: [
      {
        _id: '1',
        title: 'Coding Competition',
        description: 'Annual coding competition with exciting prizes',
        club: 'Computer Science Club',
        date: '2024-04-01T00:00:00.000Z',
        location: 'Main Auditorium'
      },
      {
        _id: '2',
        title: 'Photo Walk',
        description: 'Explore the campus and capture beautiful moments',
        club: 'Photography Club',
        date: '2024-03-25T00:00:00.000Z', 
        location: 'Campus Grounds'
      }
    ]
  },

  // Clubs Data
  clubs: [
    {
      _id: '1',
      name: 'Computer Science Club',
      description: 'A vibrant community for computer science enthusiasts to learn, collaborate, and grow together. We organize coding competitions, tech talks, and workshops.',
      category: 'Academic',
      members: 85,
      admin: 'John Doe',
      image: null,
      createdAt: '2024-01-15T00:00:00.000Z'
    },
    {
      _id: '2',
      name: 'Photography Club',
      description: 'Capture the world through your lens. Join us to explore the art of photography, learn new techniques, and share your creative vision.',
      category: 'Arts',
      members: 42,
      admin: 'Jane Smith',
      image: null,
      createdAt: '2024-01-20T00:00:00.000Z'
    },
    {
      _id: '3',
      name: 'Music Society',
      description: 'Where melodies meet and harmonies are born. A place for musicians of all levels to come together and create beautiful music.',
      category: 'Arts',
      members: 67,
      admin: 'Mike Johnson',
      image: null,
      createdAt: '2024-02-01T00:00:00.000Z'
    },
    {
      _id: '4',
      name: 'Drama Club',
      description: 'Express yourself through the art of theater. From Shakespeare to modern plays, we explore all forms of dramatic expression.',
      category: 'Arts',
      members: 38,
      admin: 'Sarah Wilson',
      image: null,
      createdAt: '2024-02-10T00:00:00.000Z'
    },
    {
      _id: '5',
      name: 'Basketball Club',
      description: 'Shoot hoops, build teamwork, and stay fit. Join our basketball community for regular games and tournaments.',
      category: 'Sports',
      members: 56,
      admin: 'Alex Rodriguez',
      image: null,
      createdAt: '2024-02-15T00:00:00.000Z'
    },
    {
      _id: '6',
      name: 'Environmental Club',
      description: 'Making a difference for our planet. Join us in environmental conservation efforts and sustainability initiatives.',
      category: 'Social',
      members: 73,
      admin: 'Emma Green',
      image: null,
      createdAt: '2024-02-20T00:00:00.000Z'
    }
  ],

  // Members Data
  members: [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@university.edu',
      role: 'admin',
      joinedClubs: ['Computer Science Club'],
      avatar: null
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@university.edu',
      role: 'admin',
      joinedClubs: ['Photography Club'],
      avatar: null
    },
    {
      _id: '3',
      name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      role: 'student',
      joinedClubs: ['Computer Science Club', 'Photography Club'],
      avatar: null
    },
    {
      _id: '4',
      name: 'Emily Brown',
      email: 'emily.brown@university.edu',
      role: 'student',
      joinedClubs: ['Music Society', 'Drama Club'],
      avatar: null
    },
    {
      _id: '5',
      name: 'Michael Davis',
      email: 'michael.davis@university.edu',
      role: 'student',
      joinedClubs: ['Basketball Club', 'Environmental Club'],
      avatar: null
    }
  ],

  // Requests Data
  requests: [
    {
      _id: '1',
      student: {
        name: 'Tom Wilson',
        email: 'tom.wilson@university.edu'
      },
      club: {
        name: 'Computer Science Club'
      },
      status: 'pending',
      createdAt: '2024-03-10T00:00:00.000Z'
    },
    {
      _id: '2',
      student: {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@university.edu'
      },
      club: {
        name: 'Photography Club'
      },
      status: 'pending',
      createdAt: '2024-03-12T00:00:00.000Z'
    },
    {
      _id: '3',
      student: {
        name: 'Robert Taylor',
        email: 'robert.taylor@university.edu'
      },
      club: {
        name: 'Music Society'
      },
      status: 'pending',
      createdAt: '2024-03-14T00:00:00.000Z'
    }
  ]
};

// Categories for dropdowns
export const clubCategories = [
  'Academic',
  'Arts', 
  'Sports',
  'Social',
  'Technology',
  'Cultural',
  'Professional',
  'Other'
];

// Detailed club information for individual club pages
export const clubDetailsData = {
  '1': {
    _id: '1',
    name: 'Computer Science Club',
    description: 'A vibrant community for computer science enthusiasts to learn, collaborate, and grow together. We organize coding competitions, tech talks, workshops, and hackathons to help members develop their technical skills and network with like-minded individuals.',
    category: 'Academic',
    admin: {
      _id: 'admin1',
      name: 'John Doe',
      email: 'john.doe@university.edu',
      avatar: null
    },
    members: [
      {
        _id: 'member1',
        name: 'Alice Johnson',
        email: 'alice.j@university.edu',
        role: 'Vice President',
        joinedAt: '2024-01-20T00:00:00.000Z',
        avatar: null
      },
      {
        _id: 'member2', 
        name: 'Bob Smith',
        email: 'bob.smith@university.edu',
        role: 'Secretary',
        joinedAt: '2024-02-01T00:00:00.000Z',
        avatar: null
      },
      {
        _id: 'member3',
        name: 'Carol Wilson',
        email: 'carol.w@university.edu', 
        role: 'Member',
        joinedAt: '2024-02-15T00:00:00.000Z',
        avatar: null
      },
      {
        _id: 'member4',
        name: 'David Brown',
        email: 'david.b@university.edu',
        role: 'Member', 
        joinedAt: '2024-03-01T00:00:00.000Z',
        avatar: null
      }
    ],
    memberCount: 85,
    events: [
      {
        _id: 'event1',
        title: 'Annual Coding Competition',
        description: 'Join us for our biggest coding competition of the year! Teams will compete in various programming challenges with exciting prizes.',
        date: '2024-04-15T10:00:00.000Z',
        location: 'Computer Lab A',
        status: 'upcoming',
        attendees: 45,
        maxAttendees: 60
      },
      {
        _id: 'event2',
        title: 'Web Development Workshop',
        description: 'Learn modern web development techniques including React, Node.js, and MongoDB.',
        date: '2024-03-28T14:00:00.000Z',
        location: 'Conference Room B',
        status: 'upcoming',
        attendees: 32,
        maxAttendees: 40
      },
      {
        _id: 'event3',
        title: 'Tech Talk: AI and Machine Learning',
        description: 'Industry expert will discuss the latest trends in AI and ML.',
        date: '2024-03-10T16:00:00.000Z',
        location: 'Main Auditorium',
        status: 'completed',
        attendees: 78,
        maxAttendees: 80
      }
    ],
    announcements: [
      {
        _id: 'announce1',
        title: 'Welcome New Members!',
        content: 'We are excited to welcome all new members to our Computer Science Club community. Please join our Discord server for important updates and discussions.',
        author: 'John Doe',
        createdAt: '2024-03-15T00:00:00.000Z',
        priority: 'high'
      },
      {
        _id: 'announce2',
        title: 'Meeting Schedule Update',
        content: 'Our weekly meetings will now be held every Friday at 3 PM in Room 204. All members are encouraged to attend.',
        author: 'Alice Johnson',
        createdAt: '2024-03-12T00:00:00.000Z',
        priority: 'medium'
      },
      {
        _id: 'announce3',
        title: 'Hackathon Registration Open',
        content: 'Registration is now open for the upcoming 48-hour hackathon. Form teams of 2-4 members and register by March 25th.',
        author: 'John Doe',
        createdAt: '2024-03-08T00:00:00.000Z',
        priority: 'high'
      }
    ],
    socialLinks: {
      discord: 'https://discord.gg/csclub',
      github: 'https://github.com/university-cs-club',
      linkedin: 'https://linkedin.com/company/university-cs-club'
    },
    meetingSchedule: {
      day: 'Friday',
      time: '15:00',
      location: 'Room 204',
      frequency: 'Weekly'
    },
    requirements: [
      'Must be enrolled in Computer Science or related program',
      'Basic programming knowledge preferred',
      'Commitment to attend regular meetings'
    ],
    benefits: [
      'Access to exclusive workshops and tech talks',
      'Networking opportunities with industry professionals',
      'Participation in coding competitions',
      'Career guidance and mentorship',
      'Access to club resources and study groups'
    ],
    image: null,
    banner: null,
    createdAt: '2024-01-15T00:00:00.000Z',
    isActive: true
  },

  '2': {
    _id: '2',
    name: 'Photography Club',
    description: 'Capture the world through your lens and explore the art of photography. Our club welcomes photographers of all skill levels, from beginners to advanced. We organize photo walks, workshops, exhibitions, and competitions.',
    category: 'Arts',
    admin: {
      _id: 'admin2',
      name: 'Jane Smith',
      email: 'jane.smith@university.edu',
      avatar: null
    },
    members: [
      {
        _id: 'member5',
        name: 'Emma Davis',
        email: 'emma.d@university.edu',
        role: 'Vice President',
        joinedAt: '2024-01-25T00:00:00.000Z',
        avatar: null
      },
      {
        _id: 'member6',
        name: 'Michael Chen',
        email: 'michael.c@university.edu',
        role: 'Treasurer',
        joinedAt: '2024-02-05T00:00:00.000Z',
        avatar: null
      }
    ],
    memberCount: 42,
    events: [
      {
        _id: 'event4',
        title: 'Campus Photo Walk',
        description: 'Explore and photograph the beautiful corners of our campus. All photography equipment levels welcome.',
        date: '2024-03-30T09:00:00.000Z',
        location: 'Campus Main Gate',
        status: 'upcoming',
        attendees: 28,
        maxAttendees: 35
      },
      {
        _id: 'event5',
        title: 'Portrait Photography Workshop',
        description: 'Learn professional portrait photography techniques with lighting and composition tips.',
        date: '2024-04-05T14:00:00.000Z',
        location: 'Art Studio',
        status: 'upcoming',
        attendees: 18,
        maxAttendees: 25
      }
    ],
    announcements: [
      {
        _id: 'announce4',
        title: 'Photo Exhibition Submissions',
        content: 'Submit your best photos for our annual exhibition. Deadline is March 20th. Theme: "Campus Life".',
        author: 'Jane Smith',
        createdAt: '2024-03-10T00:00:00.000Z',
        priority: 'high'
      }
    ],
    socialLinks: {
      instagram: 'https://instagram.com/university_photo_club',
      flickr: 'https://flickr.com/groups/university-photo-club'
    },
    meetingSchedule: {
      day: 'Wednesday',
      time: '16:30',
      location: 'Art Building Room 101',
      frequency: 'Bi-weekly'
    },
    requirements: [
      'Interest in photography (any skill level)',
      'Own camera or smartphone',
      'Willingness to participate in club activities'
    ],
    benefits: [
      'Access to professional photography equipment',
      'Workshops with professional photographers',
      'Photo exhibition opportunities',
      'Networking with fellow photography enthusiasts',
      'Feedback and critique sessions'
    ],
    image: null,
    banner: null,
    createdAt: '2024-01-20T00:00:00.000Z',
    isActive: true
  }
};

// Helper function to get fallback data based on endpoint
export const getFallbackData = (endpoint) => {
  const endpointMap = {
    '/api/admin/dashboard': fallbackData.adminDashboard,
    '/api/student/dashboard': fallbackData.studentDashboard,
    '/api/admin/clubs': fallbackData.clubs,
    '/api/student/clubs': fallbackData.clubs,
    '/api/admin/members': fallbackData.members,
    '/api/admin/requests': fallbackData.requests
  };

  // Handle club details endpoints
  const clubDetailsMatch = endpoint.match(/\/api\/student\/club\/(\d+)/);
  if (clubDetailsMatch) {
    const clubId = clubDetailsMatch[1];
    return clubDetailsData[clubId] || null;
  }

  return endpointMap[endpoint] || null;
};